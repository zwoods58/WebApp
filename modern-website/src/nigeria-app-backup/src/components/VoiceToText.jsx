import { useState, useRef, useEffect } from 'react';
import { Mic, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOfflineStore } from '../store/offlineStore';

const MAX_RECORDING_TIME = 30; // seconds

/**
 * Simple Voice-to-Text Component for Coach
 * Records audio and converts to text using browser's SpeechRecognition API
 */
export default function VoiceToText({ onTranscript, onCancel }) {
  const { isOnline } = useOfflineStore();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if SpeechRecognition is available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsProcessing(false);
      setIsRecording(false);
      if (onTranscript && transcript.trim()) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsProcessing(false);
      setIsRecording(false);

      if (event.error === 'no-speech') {
        toast.error('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        toast.error('Microphone permission denied. Please enable it in your browser settings.');
      } else {
        toast.error('Voice recognition failed. Please try again.');
      }

      if (onCancel) onCancel();
    };

    recognition.onend = () => {
      setIsRecording(false);
      setIsProcessing(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, onCancel]);

  const startRecording = () => {
    if (!isOnline) {
      toast.error('Voice recording requires an internet connection');
      return;
    }

    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    try {
      setIsRecording(true);
      setIsProcessing(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsRecording(false);
      setIsProcessing(false);
      toast.error('Failed to start voice recording');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    stopRecording();
    if (onCancel) onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[1003] flex items-end justify-center animate-fade-in">
      <div className="bg-white rounded-t-[32px] w-full max-w-md shadow-2xl animate-slide-up pb-safe">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-gray-900">Voice Input</h2>
            <button
              onClick={handleCancel}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-8">
            {isRecording ? (
              <>
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-4 animate-pulse">
                  <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
                    <Mic size={32} className="text-white" />
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-2">Listening...</p>
                <p className="text-xs text-gray-500">Speak your question</p>
                <button
                  onClick={stopRecording}
                  className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold active:scale-95 transition-transform"
                >
                  Stop Recording
                </button>
              </>
            ) : isProcessing ? (
              <>
                <Loader2 size={48} className="text-primary animate-spin mb-4" />
                <p className="text-sm font-bold text-gray-900">Processing...</p>
              </>
            ) : (
              <>
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mic size={32} className="text-primary" />
                </div>
                <p className="text-sm font-bold text-gray-900 mb-2">Tap to start recording</p>
                <p className="text-xs text-gray-500 mb-6">Ask your question about your business</p>
                <button
                  onClick={startRecording}
                  className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg active:scale-95 transition-transform shadow-lg shadow-primary/20"
                >
                  Start Recording
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

