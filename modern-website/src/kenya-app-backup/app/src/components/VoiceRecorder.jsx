import { useState, useRef, useEffect } from 'react';
import { Mic, Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { voiceToTransaction } from '../utils/supabase';
import { addOfflineTransaction } from '../utils/offlineSync';
import { useOfflineStore } from '../store/offlineStore';
import { useAuthStore } from '../store/authStore';
import { compressAudio, audioToBase64 } from '../utils/audioProcessor';

const MAX_RECORDING_TIME = 10; // seconds

export default function VoiceRecorder({ onTransactionCreated, onCancel }) {
  const { user } = useAuthStore();
  const { isOnline } = useOfflineStore();

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Transaction states
  const [extractedTransaction, setExtractedTransaction] = useState(null);
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
          sampleRate: 16000, // Lower sample rate for smaller files
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
        audioBitsPerSecond: 32000, // Compress for low bandwidth
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleRecordingStop;

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            // Gentle vibration feedback
            if (navigator.vibrate) {
              navigator.vibrate(200);
            }
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);

      toast.success('Recording started! Say the amount and what it was for.');
    } catch (error) {
      console.error('Error starting recording:', error);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Please allow microphone access in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No microphone found. Please check your device.');
      } else {
        toast.error('Could not start recording. Please try again.');
      }
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
  };

  const handleRecordingStop = async () => {
    setIsProcessing(true);

    try {
      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: mediaRecorderRef.current.mimeType 
      });

      // Check if audio is too small (likely no audio captured)
      if (audioBlob.size < 1000) {
        toast.error("I couldn't hear you clearly. Try again in a quieter place.");
        setIsProcessing(false);
        return;
      }

      // Compress audio if needed
      const compressedBlob = await compressAudio(audioBlob);
      
      // Convert to base64
      const audioBase64 = await audioToBase64(compressedBlob);

      if (isOnline) {
        // Process with Gemini API
        const result = await voiceToTransaction(audioBase64, 'en');

        if (result.error === 'subscription_required') {
          toast.error('AI features require an active subscription', { duration: 4000 });
          setTimeout(() => {
            window.location.href = '/dashboard/subscription';
          }, 1500);
          return;
        }

        if (result.success && result.confidence >= 0.5) {
          setExtractedTransaction(result.transaction);
          setConfidence(result.confidence);
        } else {
          toast.error("I didn't understand that. Please say the amount and what it was for.");
        }
      } else {
        // Save for offline processing
        await addOfflineTransaction({
          user_id: user.id,
          source: 'voice',
          audio_data: audioBase64,
          status: 'pending_processing',
          created_at: new Date().toISOString(),
        });

        toast('Voice recording saved. Will process when you\'re online.', {
          icon: '📱',
          duration: 5000,
        });
        
        if (onCancel) onCancel();
      }
    } catch (error) {
      console.error('Error processing recording:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);

      if (onTransactionCreated) {
        await onTransactionCreated(extractedTransaction);
      }

      toast.success('Transaction saved!');
      
      // Reset state
      setExtractedTransaction(null);
      setConfidence(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Failed to save transaction');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setExtractedTransaction(null);
    setConfidence(null);
    setRecordingTime(0);
  };

  // Show confirmation screen if we have extracted transaction
  if (extractedTransaction) {
    const isIncome = extractedTransaction.type === 'income';
    const confidenceLevel = confidence >= 0.8 ? 'high' : confidence >= 0.6 ? 'medium' : 'low';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6">
          {/* Warning for low confidence */}
          {confidenceLevel === 'low' && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-center">
              <p className="text-yellow-800 font-semibold text-lg">
                ⚠️ Did I hear you right?
              </p>
            </div>
          )}

          {/* Transaction Type */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xl font-bold ${
              isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isIncome ? '💰 Money In' : '💸 Money Out'}
            </div>
          </div>

          {/* Amount */}
          <div className="text-center">
            <p className="text-gray-600 mb-2">Amount</p>
            <p className={`text-5xl font-bold ${
              isIncome ? 'text-green-600' : 'text-red-600'
            }`}>
              R{parseFloat(extractedTransaction.amount).toFixed(2)}
            </p>
          </div>

          {/* Category */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-1">Category</p>
            <p className="text-xl font-semibold text-gray-900">
              {extractedTransaction.category}
            </p>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-1">What it was for</p>
            <p className="text-lg text-gray-900 italic">
              "{extractedTransaction.description}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleRetry}
              disabled={isProcessing}
              className="btn btn-danger py-4 text-lg font-bold flex items-center justify-center gap-2"
            >
              <X size={24} />
              No, Try Again
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="btn btn-primary bg-green-500 hover:bg-green-600 py-4 text-lg font-bold flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Check size={24} />
              )}
              Yes, Save It
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Recording interface
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 space-y-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isRecording ? 'Listening...' : 'Record Transaction'}
          </h2>
          <p className="text-gray-600">
            {isRecording 
              ? 'Say the amount and what it was for'
              : 'Hold the button and speak clearly'}
          </p>
        </div>

        {/* Timer */}
        {isRecording && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 rounded-full">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-2xl font-bold text-red-600">
                {recordingTime}s / {MAX_RECORDING_TIME}s
              </p>
            </div>
          </div>
        )}

        {/* Microphone Button */}
        <div className="flex justify-center">
          <button
            onMouseDown={isRecording ? null : startRecording}
            onMouseUp={isRecording ? stopRecording : null}
            onTouchStart={isRecording ? null : startRecording}
            onTouchEnd={isRecording ? stopRecording : null}
            disabled={isProcessing}
            className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 scale-110 animate-pulse'
                : isProcessing
                ? 'bg-gray-400'
                : 'bg-primary-500 hover:bg-primary-600 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <Loader2 size={64} className="text-white animate-spin" />
            ) : (
              <Mic size={64} className="text-white" />
            )}
            
            {/* Pulsing ring animation */}
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                <div className="absolute inset-0 rounded-full bg-red-400 animate-pulse"></div>
              </>
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-primary-50 rounded-lg p-4 text-center space-y-2">
          <p className="text-primary-900 font-semibold">💡 Examples:</p>
          <div className="text-sm text-primary-800 space-y-1">
            <p>"Sold 50 rand airtime"</p>
            <p>"Bought stock for 200 rand"</p>
            <p>"Taxi fare, 30 rand"</p>
            <p>"Paid 150 for electricity"</p>
          </div>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <Loader2 size={20} className="animate-spin" />
              <span>Processing your voice...</span>
            </div>
          </div>
        )}

        {/* Cancel button */}
        {!isRecording && !isProcessing && onCancel && (
          <button
            onClick={onCancel}
            className="w-full btn btn-secondary py-3 text-lg font-medium"
          >
            Cancel
          </button>
        )}

        {/* Offline notice */}
        {!isOnline && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-yellow-800 text-sm">
              📱 You're offline. Recording will be processed when you're back online.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

