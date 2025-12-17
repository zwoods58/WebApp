import { useState, useRef, useEffect } from 'react';
import { Mic, Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { voiceToBooking, supabase } from '../utils/supabase';
import { useOfflineStore } from '../store/offlineStore';
import { useAuthStore } from '../store/authStore';
import { compressAudio, audioToBase64 } from '../utils/audioProcessor';

const MAX_RECORDING_TIME = 10; // seconds

export default function VoiceBookingRecorder({ 
  onBookingCreated, 
  onTaskCreated,
  onCancel,
  type = 'booking', // 'booking' or 'task'
  isEditMode = false // For editing existing bookings/tasks
}) {
  const { user } = useAuthStore();
  const { isOnline } = useOfflineStore();

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasStartedRecording, setHasStartedRecording] = useState(false);

  // Extracted data states
  const [extractedData, setExtractedData] = useState(null);
  const [confidence, setConfidence] = useState(null);

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      });

      streamRef.current = stream;

      // Determine supported MIME type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 32000,
      });

      audioChunksRef.current = [];

      // Set timeslice to collect data periodically (every 100ms)
      // This prevents the recorder from stopping prematurely
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle errors
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast.error('Recording error occurred. Please try again.');
        stopRecording();
      };

      mediaRecorder.onstop = handleRecordingStop;

      // Start recording with timeslice to prevent premature stopping
      // Timeslice of 100ms ensures data is collected regularly
      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);
      setHasStartedRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            if (navigator.vibrate) {
              navigator.vibrate(200);
            }
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);

      toast.success(
        type === 'booking' 
          ? 'Recording started! Say the client name, date, and time.'
          : 'Recording started! Say the task title and due date.'
      );
    } catch (error) {
      console.error('Error starting recording:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone permission denied. Please enable it in your browser settings.');
      } else {
        toast.error('Failed to start recording. Please try again.');
      }
    }
  };

  const stopRecording = () => {
    // Prevent stopping if recording hasn't actually started yet
    if (!hasStartedRecording) {
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current) {
      // Only stop if recording is actually active
      if (mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.error('Error stopping recorder:', error);
        }
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
    setHasStartedRecording(false);
  };

  const handleRecordingStop = async () => {
    // Check if recording was stopped too quickly (less than 1 second)
    // This prevents processing empty or very short recordings
    if (recordingTime < 1) {
      setIsProcessing(false);
      setIsRecording(false);
      setHasStartedRecording(false);
      toast.error("Recording was too short. Please hold the button and speak for at least 1 second.");
      // Clear audio chunks
      audioChunksRef.current = [];
      return;
    }

    setIsProcessing(true);

    try {
      // Wait a bit to ensure all chunks are collected
      await new Promise(resolve => setTimeout(resolve, 300));

      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: mediaRecorderRef.current?.mimeType || 'audio/webm'
      });

      // Check if audio is too small (likely no audio captured)
      if (audioBlob.size < 1000) {
        toast.error("I couldn't hear you clearly. Try again in a quieter place.");
        setIsProcessing(false);
        audioChunksRef.current = [];
        return;
      }

      // Compress audio if needed
      const compressedBlob = await compressAudio(audioBlob);
      
      // Convert to base64
      const audioBase64 = await audioToBase64(compressedBlob);

      if (isOnline) {
        // Process with AI
        const result = await voiceToBooking(audioBase64, 'en', type);

        if (result.error === 'subscription_required') {
          toast.error('AI features require an active subscription', { duration: 4000 });
          setTimeout(() => {
            window.location.href = '/dashboard/subscription';
          }, 1500);
          return;
        }

        if (result.success && result.confidence >= 0.5) {
          setExtractedData(type === 'booking' ? result.booking : result.task);
          setConfidence(result.confidence);
          try {
            const userId = localStorage.getItem('beezee_user_id');
            if (userId) {
              await supabase.from('voice_logs').insert({
                user_id: userId,
                type,
                success: true,
                confidence: result.confidence,
                raw_response: result.rawResponse || null,
              });
            }
          } catch (logErr) {
            console.warn('Voice log insert failed:', logErr);
          }
          setIsProcessing(false);
        } else {
          const errorMsg = result.error || result.message || "I didn't understand that.";
          toast.error(
            type === 'booking'
              ? errorMsg + " Please say the client name, date, and time."
              : errorMsg + " Please say the task title and due date."
          );
          if (result.rawResponse) {
            console.warn('Voice parse raw response:', result.rawResponse);
          }
          try {
            const userId = localStorage.getItem('beezee_user_id');
            if (userId) {
              await supabase.from('voice_logs').insert({
                user_id: userId,
                type,
                success: false,
                error: errorMsg,
                raw_response: result.rawResponse || null,
                confidence: result.confidence || null,
              });
            }
          } catch (logErr) {
            console.warn('Voice log insert failed:', logErr);
          }
          setIsProcessing(false);
          // Clear audio chunks on error
          audioChunksRef.current = [];
        }
      } else {
        toast('Voice recording saved. Will process when you\'re online.', {
          icon: '📱',
          duration: 5000,
        });
        setIsProcessing(false);
        if (onCancel) onCancel();
      }
    } catch (error) {
      console.error('Error processing recording:', error);
      toast.error('Something went wrong. Please try again.');
      setIsProcessing(false);
      // Clear audio chunks on error
      audioChunksRef.current = [];
      try {
        const userId = localStorage.getItem('beezee_user_id');
        if (userId) {
          await supabase.from('voice_logs').insert({
            user_id: userId,
            type,
            success: false,
            error: error?.message || 'processing_error',
          });
        }
      } catch (logErr) {
        console.warn('Voice log insert failed:', logErr);
      }
      setExtractedData(null);
    }
  };

  const handleConfirm = async () => {
    if (!extractedData) {
      toast.error('No data to save. Please record again.');
      return;
    }

    try {
      if (type === 'booking' && onBookingCreated) {
        await onBookingCreated(extractedData);
      } else if (type === 'task' && onTaskCreated) {
        await onTaskCreated(extractedData);
      }
      // Reset state after successful save
      setExtractedData(null);
      setConfidence(null);
    } catch (error) {
      console.error('Error saving booking/task:', error);
      toast.error('Failed to save. Please try again.');
    }
  };

  const handleRetake = () => {
    setExtractedData(null);
    setConfidence(null);
    setIsProcessing(false);
  };

  // Show confirmation screen if we have extracted data
  if (extractedData) {
    const confidenceLevel = confidence >= 0.8 ? 'high' : confidence >= 0.6 ? 'medium' : 'low';

    return (
      <div className="voice-recorder-container">
        <div className="voice-recorder-header">
          <h3>Review {type === 'booking' ? 'Booking' : 'Task'}</h3>
          <button onClick={handleRetake} className="voice-recorder-close">
            <X size={20} />
          </button>
        </div>

        {confidenceLevel === 'low' && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-center mb-4">
            <p className="text-yellow-800 font-semibold text-sm">
              I'm not 100% sure. Please check the details below.
            </p>
          </div>
        )}

        <div className="voice-recorder-content">
          {isProcessing && (
            <div className="voice-recorder-processing inline mb-3">
              <Loader2 className="spinner" size={18} />
              <p className="text-sm text-gray-600">Processing...</p>
            </div>
          )}
          {type === 'booking' ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Client Name</label>
                <p className="text-lg font-semibold">{extractedData.client_name || 'Not specified'}</p>
              </div>
              {extractedData.appointment_date && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p className="text-lg">{extractedData.appointment_date}</p>
                </div>
              )}
              {extractedData.appointment_time && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Time</label>
                  <p className="text-lg">{extractedData.appointment_time}</p>
                </div>
              )}
              {extractedData.service && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Service</label>
                  <p className="text-lg">{extractedData.service}</p>
                </div>
              )}
              {extractedData.location && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-lg">{extractedData.location}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Task Title</label>
                <p className="text-lg font-semibold">{extractedData.title || 'Not specified'}</p>
              </div>
              {extractedData.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-lg">{extractedData.description}</p>
                </div>
              )}
              {extractedData.due_date && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date</label>
                  <p className="text-lg">{extractedData.due_date}</p>
                </div>
              )}
              {extractedData.due_time && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Time</label>
                  <p className="text-lg">{extractedData.due_time}</p>
                </div>
              )}
              {extractedData.priority && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Priority</label>
                  <p className="text-lg capitalize">{extractedData.priority}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="voice-recorder-actions">
          <button onClick={handleRetake} className="voice-recorder-button secondary">
            <X size={18} />
            Retake
          </button>
          <button onClick={handleConfirm} className="voice-recorder-button primary">
            <Check size={18} />
            Confirm
          </button>
        </div>
      </div>
    );
  }

  // Show recording interface
  return (
    <div className="voice-recorder-container">
      <div className="voice-recorder-header">
        <h3>Voice {isEditMode ? 'Edit' : ''} {type === 'booking' ? 'Booking' : 'Task'}</h3>
        <button onClick={onCancel} className="voice-recorder-close">
          <X size={20} />
        </button>
      </div>

      <div className="voice-recorder-content">
        {isProcessing ? (
          <div className="voice-recorder-processing">
            <Loader2 className="spinner" size={32} />
            <p>Processing your voice...</p>
          </div>
        ) : isRecording ? (
          <div className="voice-recorder-recording">
            <div className="voice-recorder-mic-container recording">
              <Mic size={48} />
            </div>
            <p className="voice-recorder-timer">{MAX_RECORDING_TIME - recordingTime}s</p>
            <p className="voice-recorder-hint">
              {type === 'booking'
                ? 'Say: "Book [name] for [service] on [date] at [time]"'
                : 'Say: "Remind me to [task] on [date]"'}
            </p>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                stopRecording();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isRecording && hasStartedRecording) {
                  stopRecording();
                }
              }}
              className="voice-recorder-button primary stop"
            >
              Stop Recording
            </button>
          </div>
        ) : (
          <div className="voice-recorder-idle">
            <div className="voice-recorder-mic-container">
              <Mic size={48} />
            </div>
            <p className="voice-recorder-hint">
              {type === 'booking'
                ? isEditMode ? 'Tap to record booking changes' : 'Tap to record a booking'
                : isEditMode ? 'Tap to record task changes' : 'Tap to record a task'}
            </p>
            <button 
              onClick={() => {
                if (!isRecording && !isProcessing) {
                  startRecording();
                }
              }}
              className="voice-recorder-button primary"
            >
              <Mic size={20} />
              {isEditMode ? 'Start Recording Changes' : 'Start Recording'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

