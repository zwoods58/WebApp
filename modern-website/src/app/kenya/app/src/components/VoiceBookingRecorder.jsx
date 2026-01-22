import { useState, useRef, useEffect } from 'react';
import { Mic, Check, X, Loader2, RefreshCcw, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { voiceToBooking, supabase } from '../utils/supabase';
import { useOfflineStore } from '../store/offlineStore';
import { useAuthStore } from '../store/authStore';
import { compressAudio, audioToBase64 } from '../utils/audioProcessor';

const MAX_RECORDING_TIME = 10; // seconds

export default function VoiceBookingRecorder({ 
  onBookingCreated, 
  onTaskCreated,
  onInventoryCreated,
  onSuccess, // General success callback for modal pre-filling
  onClose,
  onCancel,
  type = 'booking', // 'booking', 'task', or 'inventory'
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
          let data = null;
          if (type === 'booking') data = result.booking;
          else if (type === 'task') data = result.task;
          else if (type === 'inventory') data = result.inventory;
          
          // Fallback if key doesn't match type
          if (!data) {
            data = result.inventory || result.task || result.booking;
          }
          
          console.log('[VoiceRecorder] Extracted data:', data);
          setExtractedData(data);
          setConfidence(result.confidence);
          
          if (onSuccess) {
            onSuccess(data);
          }
          
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
              : type === 'task'
              ? errorMsg + " Please say the task title and due date."
              : errorMsg + " Please say the item name and quantity."
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
      } else if (type === 'inventory' && onInventoryCreated) {
        await onInventoryCreated(extractedData);
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
        {/* Modern Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-gray-900">
              Review {type === 'booking' ? 'Booking' : type === 'task' ? 'Task' : 'Item'}
            </h3>
            <p className="text-gray-500 text-sm font-medium">Verify the details I heard</p>
          </div>
          <button 
            onClick={handleRetake} 
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 active:scale-90 transition-all"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {confidenceLevel === 'low' && (
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-3 mb-6 animate-pulse">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 flex-shrink-0">
              <Info size={20} />
            </div>
            <p className="text-orange-900 font-bold text-xs leading-tight">
              I'm not 100% sure. Please double check these details.
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {type === 'booking' ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-5 rounded-[24px]">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Client Name</label>
                <p className="text-lg font-black text-gray-900">{extractedData.client_name || 'Not specified'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-5 rounded-[24px]">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Date</label>
                  <p className="text-lg font-black text-gray-900">{extractedData.appointment_date || 'Today'}</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-[24px]">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Time</label>
                  <p className="text-lg font-black text-gray-900">{extractedData.appointment_time || '---'}</p>
                </div>
              </div>
              {extractedData.service && (
                <div className="bg-gray-50 p-5 rounded-[24px]">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Service</label>
                  <p className="text-lg font-black text-gray-900">{extractedData.service}</p>
                </div>
              )}
            </div>
          ) : type === 'task' ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-5 rounded-[24px]">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Task</label>
                <p className="text-lg font-black text-gray-900">{extractedData.title || 'Not specified'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-5 rounded-[24px]">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Due Date</label>
                  <p className="text-lg font-black text-gray-900">{extractedData.due_date || 'No date'}</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-[24px]">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Priority</label>
                  <p className="text-lg font-black text-gray-900 capitalize">{extractedData.priority || 'Medium'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-5 rounded-[24px]">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Item Name</label>
                <p className="text-lg font-black text-gray-900">{extractedData.name || 'Not specified'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-5 rounded-[24px]">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Quantity</label>
                  <p className="text-lg font-black text-gray-900">{extractedData.quantity || '0'}</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-[24px]">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Cost Price</label>
                  <p className="text-lg font-black text-primary-600">R{extractedData.cost_price || '0'}</p>
                </div>
              </div>
              {extractedData.selling_price && (
                <div className="bg-gray-50 p-5 rounded-[24px]">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Selling Price</label>
                  <p className="text-lg font-black text-green-600">R{extractedData.selling_price}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 pb-10">
          <button 
            onClick={handleRetake} 
            className="bg-gray-100 text-gray-900 py-4 rounded-2xl font-black text-base active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} strokeWidth={3} />
            Retake
          </button>
          <button 
            onClick={handleConfirm} 
            className="bg-primary-600 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-primary-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={18} strokeWidth={3} />
            Confirm
          </button>
        </div>
      </div>
    );
  }

  // Show recording interface
  return (
    <div className="voice-recorder-container justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-gray-900">
            {isEditMode ? 'Voice Edit' : 'Voice Entry'}
          </h3>
          <p className="text-gray-500 text-sm font-medium">I'm listening...</p>
        </div>
        <button 
          onClick={onCancel || onClose} 
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 active:scale-90 transition-all"
        >
          <X size={20} strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-10">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center">
              <Loader2 className="animate-spin text-primary-600" size={40} strokeWidth={3} />
            </div>
            <p className="text-lg font-black text-gray-900">Thinking...</p>
            <p className="text-gray-500 text-sm font-medium">Extracting details from your voice</p>
          </div>
        ) : isRecording ? (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-200">
                <Mic size={48} strokeWidth={2.5} />
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-4xl font-black text-gray-900 mb-1">{MAX_RECORDING_TIME - recordingTime}s</p>
              <p className="text-primary-600 font-bold uppercase tracking-widest text-[10px]">Time Left</p>
            </div>

            <div className="bg-primary-50 p-6 rounded-[32px] w-full max-w-xs border border-primary-100">
              <p className="text-primary-900 text-center font-bold text-sm leading-relaxed italic">
                {type === 'booking'
                  ? '"Book Sipho for a haircut tomorrow at 2pm"'
                  : type === 'task'
                  ? '"Remind me to buy milk tomorrow morning"'
                  : '"Add 10 cans of Coke costing 10 rand selling for 15"'}
              </p>
            </div>

            <button 
              onClick={stopRecording}
              className="mt-4 w-full max-w-xs bg-[#2C2C2E] text-white py-5 rounded-[24px] font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Finish Recording
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <Mic size={48} strokeWidth={2.5} />
            </div>
            
            <div className="text-center">
              <p className="text-xl font-black text-gray-900 mb-2">Ready to listen</p>
              <p className="text-gray-500 text-sm font-medium px-10">Tap the button below and speak clearly into your phone.</p>
            </div>

            <button 
              onClick={startRecording}
              className="w-full max-w-xs bg-primary-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-primary-200 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Mic size={24} strokeWidth={3} />
              Start Recording
            </button>
          </div>
        )}
      </div>

      <div className="pb-10 px-6 text-center">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">BeeZee AI Voice Engine</p>
      </div>
    </div>
  );
}

