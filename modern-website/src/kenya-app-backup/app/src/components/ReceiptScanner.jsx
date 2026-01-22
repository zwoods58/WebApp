import { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, Upload, Zap, ZapOff, RotateCcw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { receiptToTransaction } from '../utils/supabase';
import { compressImage, validateImage } from '../utils/imageProcessor';
import { uploadReceiptImage } from '../utils/receiptStorage';
import { addOfflineReceipt } from '../utils/receiptOfflineQueue';
import { useOfflineStore } from '../store/offlineStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

const CATEGORIES = [
  'Transport',
  'Stock',
  'Food',
  'Services',
  'Rent',
  'Electricity',
  'Supplies',
  'Other',
];

export default function ReceiptScanner({ onTransactionCreated, onCancel, initialFile = null }) {
  const { user } = useAuthStore();
  const { isOnline } = useOfflineStore();
  
  // Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // Back camera

  // Capture states
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extracted data states
  const [extractedData, setExtractedData] = useState(null);
  const [confidence, setConfidence] = useState(null);

  // Edit mode states
  const [vendor, setVendor] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle initial file if provided
  useEffect(() => {
    if (initialFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setCapturedImage(e.target.result);
        setImageBlob(initialFile);
        // Process the file using the same logic as handleFileUpload
        const file = initialFile;
        if (!file.type.startsWith('image/')) {
          toast.error('Please select an image file');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error('Image too large. Maximum 10MB.');
          return;
        }
        // Call processImage directly
        setIsProcessing(true);
        toast.loading('Scanning receipt...');
        try {
          const validation = await validateImage(file);
          if (!validation.valid) {
            toast.dismiss();
            toast.error(validation.errors[0] || 'Invalid image');
            return;
          }
          const compressed = await compressImage(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 2048,
            useWebWorker: true,
          });
          if (isOnline) {
            const imageUrl = await uploadReceiptImage(user.id, compressed);
            const base64 = await blobToBase64(compressed);
            const result = await receiptToTransaction(base64, 'image/jpeg');
            toast.dismiss();
            if (result.error === 'subscription_required') {
              toast.error('AI features require an active subscription', { duration: 4000 });
              setTimeout(() => {
                window.location.href = '/dashboard/subscription';
              }, 1500);
              return;
            }
            if (result.success && result.confidence >= 0.5) {
              const data = result.transaction || result.data;
              setExtractedData(data);
              setConfidence(result.confidence);
              setVendor(data.vendor || '');
              setDate(data.date || format(new Date(), 'yyyy-MM-dd'));
              setAmount(data.total_amount?.toString() || '');
              setCategory(inferCategory(data.vendor) || '');
              if (result.confidence < 0.7) {
                toast('Please review the details carefully', { icon: '⚠️' });
              } else {
                toast.success('Receipt scanned successfully!');
              }
            } else {
              toast.error(result.message || 'Could not read receipt. Please enter manually.');
            }
          } else {
            await addOfflineReceipt(user.id, compressed);
            toast.dismiss();
            toast('Receipt saved. Will process when online.', { icon: '📱', duration: 5000 });
            if (onCancel) onCancel();
          }
        } catch (error) {
          console.error('Error processing image:', error);
          toast.dismiss();
          toast.error('Failed to process receipt. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(initialFile);
    }
  }, [initialFile, isOnline, user.id]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setCameraActive(true);

      // Check if flash is supported
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      if (capabilities.torch) {
        // Flash is supported
        console.log('Flash supported');
      }
    } catch (error) {
      console.error('Camera error:', error);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Please allow camera access in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera found. Please use the upload option.');
      } else {
        toast.error('Could not start camera. Try uploading an image instead.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleFlash = async () => {
    if (!streamRef.current) return;

    const track = streamRef.current.getVideoTracks()[0];
    const capabilities = track.getCapabilities();

    if (capabilities.torch) {
      try {
        await track.applyConstraints({
          advanced: [{ torch: !flashEnabled }],
        });
        setFlashEnabled(!flashEnabled);
      } catch (error) {
        console.error('Flash toggle error:', error);
        toast.error('Flash not available on this device');
      }
    } else {
      toast.error('Flash not supported on this device');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // Convert to blob
    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error('Failed to capture photo');
        return;
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      setImageBlob(blob);

      stopCamera();
      await processImage(blob);
    }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image too large. Maximum 10MB.');
      return;
    }

    // Convert to data URL for preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      setCapturedImage(e.target.result);
      setImageBlob(file);
      await processImage(file);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageBlob) => {
    setIsProcessing(true);
    toast.loading('Scanning receipt...');

    try {
      // Validate image
      const validation = await validateImage(imageBlob);
      if (!validation.valid) {
        toast.dismiss();
        toast.error(validation.errors[0] || 'Invalid image');
        return;
      }

      // Compress image
      const compressed = await compressImage(imageBlob, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 2048,
        useWebWorker: true,
      });

      console.log(`Image compressed: ${imageBlob.size} → ${compressed.size} bytes`);

      if (isOnline) {
        // Upload to Supabase Storage
        const imageUrl = await uploadReceiptImage(user.id, compressed);

        // Convert to base64
        const base64 = await blobToBase64(compressed);

        // Process with Gemini Vision API
        const result = await receiptToTransaction(base64, 'image/jpeg');

        toast.dismiss();

        if (result.error === 'subscription_required') {
          toast.error('AI features require an active subscription', { duration: 4000 });
          setTimeout(() => {
            window.location.href = '/dashboard/subscription';
          }, 1500);
          return;
        }

        if (result.success && result.confidence >= 0.5) {
          const data = result.transaction || result.data;
          
          setExtractedData(data);
          setConfidence(result.confidence);
          
          // Pre-fill form
          setVendor(data.vendor || '');
          setDate(data.date || format(new Date(), 'yyyy-MM-dd'));
          setAmount(data.total_amount?.toString() || '');
          setCategory(inferCategory(data.vendor) || '');

          if (result.confidence < 0.7) {
            toast('Please review the details carefully', { icon: '⚠️' });
          } else {
            toast.success('Receipt scanned successfully!');
          }
        } else {
          toast.error(result.message || 'Could not read receipt. Please enter manually.');
        }
      } else {
        // Save for offline processing
        await addOfflineReceipt(user.id, compressed);
        toast.dismiss();
        toast('Receipt saved. Will process when online.', { icon: '📱', duration: 5000 });
        
        if (onCancel) onCancel();
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.dismiss();
      toast.error('Failed to process receipt. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const inferCategory = (vendor) => {
    if (!vendor) return '';
    
    const vendorLower = vendor.toLowerCase();
    
    if (vendorLower.includes('taxi') || vendorLower.includes('uber') || vendorLower.includes('bolt')) {
      return 'Transport';
    }
    if (vendorLower.includes('shop') || vendorLower.includes('store') || vendorLower.includes('spaza')) {
      return 'Stock';
    }
    if (vendorLower.includes('food') || vendorLower.includes('restaurant') || vendorLower.includes('cafe')) {
      return 'Food';
    }
    if (vendorLower.includes('shell') || vendorLower.includes('engen') || vendorLower.includes('bp') || vendorLower.includes('petrol')) {
      return 'Transport';
    }
    if (vendorLower.includes('pick n pay') || vendorLower.includes('shoprite') || vendorLower.includes('checkers')) {
      return 'Stock';
    }
    
    return '';
  };

  const handleConfirm = async () => {
    if (!amount || !date) {
      toast.error('Please fill in amount and date');
      return;
    }

    setIsProcessing(true);

    try {
      const transaction = {
        user_id: user.id,
        amount: parseFloat(amount),
        type: 'expense', // Receipts are typically expenses
        category: category || 'Other',
        description: vendor || 'Receipt expense',
        date: date,
        source: 'receipt',
        receipt_image_url: extractedData?.imageUrl || null,
        metadata: {
          vendor,
          confidence,
          extracted_data: extractedData,
        },
      };

      if (onTransactionCreated) {
        await onTransactionCreated(transaction);
      }

      toast.success('Transaction saved!');
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Failed to save transaction');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setImageBlob(null);
    setExtractedData(null);
    setConfidence(null);
    setVendor('');
    setAmount('');
    setCategory('');
    startCamera();
  };

  // Show confirmation screen if we have extracted data
  if (extractedData) {
    const confidenceLevel = confidence >= 0.8 ? 'high' : confidence >= 0.6 ? 'medium' : 'low';

    return (
      <>
        {/* Backdrop */}
        <div 
          className="modal-backdrop"
          onClick={onCancel}
        />
        {/* Bottom Sheet Modal */}
        <div className="receipt-scanner-modal">
          {/* Drag Handle */}
          <div className="modal-drag-handle" />
          
          <div className="manual-transaction-form max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="modal-header-section">
              <h2 className="manual-form-title mb-0">Review Receipt</h2>
              <button onClick={onCancel} className="modal-close-button" aria-label="Close">
                <X size={24} />
              </button>
            </div>

          {/* Confidence Warning */}
          {confidenceLevel === 'low' && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-center mb-6">
              <AlertCircle className="text-yellow-600 mx-auto mb-2" size={24} />
              <p className="text-yellow-800 font-semibold">
                Receipt wasn't clear. Please check the details below.
              </p>
            </div>
          )}

          {/* Receipt Thumbnail */}
          {capturedImage && (
            <div className="relative rounded-lg overflow-hidden mb-6">
              <img
                src={capturedImage}
                alt="Captured receipt"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={handleRetake}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              >
                <RotateCcw size={20} className="text-gray-700" />
              </button>
            </div>
          )}

          {/* Editable Fields */}
          <div className="space-y-6">
            {/* Vendor */}
            <div className="transaction-form-field">
              <label className="transaction-form-label">
                Business Name
              </label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="e.g., Pick n Pay, Taxi, Spaza Shop"
                className={`transaction-form-input ${confidenceLevel === 'low' ? 'border-yellow-400 bg-yellow-50' : ''}`}
              />
            </div>

            {/* Date */}
            <div className="transaction-form-field">
              <label className="transaction-form-label">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`transaction-form-input ${confidenceLevel === 'low' ? 'border-yellow-400 bg-yellow-50' : ''}`}
              />
            </div>

            {/* Amount */}
            <div className="transaction-form-field">
              <label className="transaction-form-label">
                Amount (R)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="R 0.00"
                className={`transaction-form-input amount-input ${confidenceLevel === 'low' ? 'border-yellow-400 bg-yellow-50' : ''}`}
                required
              />
            </div>

            {/* Category */}
            <div className="transaction-form-field">
              <label className="transaction-form-label">
                Category
              </label>
              <div className="category-pills-container">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`category-pill ${category === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={handleRetake}
              className="btn btn-secondary py-3 text-lg font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Retake
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing || !amount}
              className="transaction-submit-button"
            >
              {isProcessing ? (
                <div className="spinner w-5 h-5"></div>
              ) : (
                <>
                  <Check size={20} />
                  Save
                </>
              )}
            </button>
          </div>
          </div>
        </div>
      </>
    );
  }

  // Show camera/capture interface
  if (!capturedImage) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="modal-backdrop"
          onClick={onCancel}
        />
        {/* Bottom Sheet Modal */}
        <div className="receipt-scanner-modal">
          {/* Drag Handle */}
          <div className="modal-drag-handle" />
          
          {/* Header */}
          <div className="modal-header-section">
            <div className="modal-title">
              <Camera size={28} className="modal-title-icon" />
              Scan Receipt
            </div>
            <button
              onClick={onCancel}
              className="modal-close-button"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
          
          {cameraActive ? (
            <div className="receipt-camera-view">
              {/* Video Stream */}
              <video
                ref={videoRef}
                className="receipt-camera-video"
                playsInline
                autoPlay
              />

              {/* Receipt Frame Overlay */}
              <div className="receipt-frame-overlay">
                <div className="receipt-frame-border" />
              </div>

              {/* Guide Text */}
              <div className="receipt-camera-guide">
                <p className="receipt-camera-guide-text">
                  Position receipt within frame
                </p>
              </div>

              {/* Controls */}
              <div className="receipt-camera-controls">
                {/* Close Button */}
                <button
                  onClick={() => {
                    stopCamera();
                    if (onCancel) onCancel();
                  }}
                  className="receipt-camera-control-button"
                  aria-label="Close camera"
                >
                  <X size={24} />
                </button>

                {/* Flash Toggle */}
                <button
                  onClick={toggleFlash}
                  className="receipt-camera-control-button"
                  aria-label={flashEnabled ? "Turn off flash" : "Turn on flash"}
                >
                  {flashEnabled ? <Zap size={24} /> : <ZapOff size={24} />}
                </button>
              </div>

              {/* Capture Button */}
              <div className="receipt-camera-capture">
                <button
                  onClick={capturePhoto}
                  className="receipt-camera-capture-button"
                  aria-label="Capture photo"
                >
                  <Camera size={40} />
                </button>
              </div>
            </div>
          ) : (
            /* Initial Screen - Choose Camera or Upload */
            <div className="receipt-scanner-options">
              <div className="receipt-scanner-options-content">
                <p className="receipt-scanner-instruction">
                  Take a photo or upload an existing image
                </p>

                <div className="receipt-scanner-buttons">
                  <button
                    onClick={startCamera}
                    className="receipt-scanner-button primary"
                  >
                    <div className="receipt-scanner-button-icon">
                      <Camera size={28} />
                    </div>
                    <span className="receipt-scanner-button-text">Take Photo</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="receipt-scanner-button secondary"
                  >
                    <div className="receipt-scanner-button-icon">
                      <Upload size={28} />
                    </div>
                    <span className="receipt-scanner-button-text">Upload Image</span>
                  </button>
                </div>

                {/* Tips */}
                <div className="receipt-scanner-tips">
                  <p className="receipt-scanner-tips-text">
                    💡 <strong>Tips:</strong> Make sure the receipt is flat, well-lit, and all text is visible
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Hidden Canvas for Capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Offline Notice */}
          {!isOnline && (
            <div className="receipt-scanner-offline-notice">
              📱 You're offline. Receipt will be processed when you're back online.
            </div>
          )}
        </div>
      </>
    );
  }

  // Processing state (after capture, before confirmation)
  return (
    <>
      <div className="modal-backdrop" />
      <div className="receipt-scanner-modal">
        <div className="receipt-scanner-options">
          <div className="text-center space-y-4">
            <div className="spinner w-16 h-16 mx-auto border-4"></div>
            <p className="text-xl font-semibold text-gray-900">Scanning receipt...</p>
            <p className="text-sm text-gray-600">This may take a few seconds</p>
          </div>
        </div>
      </div>
    </>
  );
}


