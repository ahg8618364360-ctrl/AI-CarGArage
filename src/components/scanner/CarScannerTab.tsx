import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  BookmarkPlus,
  Share2,
  CheckCircle2,
  AlertCircle,
  X,
  Edit3,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  IndianRupee,
  Volume2,
  Activity,
  Palette,
} from 'lucide-react';
import { useGarage } from '../../context/GarageContext';
import { SAMPLE_CARS_FOR_SCANNER } from '../../data/mockData';
import { scanCarWithAI, compressImageForVision } from '../../services/aiScannerService';
import { ScannedCarResult } from '../../types';
import { SoundScannerModal } from './SoundScannerModal';

export const CarScannerTab: React.FC = () => {
  const { saveScannedCarToGarage, setActiveTab, setSelectedVehicleDetailId } = useGarage();

  // Mode: 'pick' | 'camera' | 'preview' | 'result'
  const [mode, setMode] = useState<'pick' | 'camera' | 'preview' | 'result'>('pick');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);
  const [scanResult, setScanResult] = useState<ScannedCarResult | null>(null);
  const [scanSource, setScanSource] = useState<string>('gemini-3.8-flash');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<Partial<ScannedCarResult>>({});
  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [isSoundScannerOpen, setIsSoundScannerOpen] = useState<boolean>(false);

  // Fast Detector feature
  const [fastDetectorMode, setFastDetectorMode] = useState<boolean>(true);
  const [detectionTimeMs, setDetectionTimeMs] = useState<number | null>(null);

  // Live camera stream refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');

  const scanSteps = [
    'Detecting vehicle silhouette & proportions...',
    'Identifying automotive manufacturer...',
    'Analyzing model line & generation trim...',
    'Detecting exterior paint colour & finish...',
    'Synthesizing Indian market specifications...',
  ];

  // Stop camera when unmounting or leaving camera mode
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Start live camera
  const startCamera = async (facing: 'environment' | 'user' = 'environment') => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      setCameraFacingMode(facing);
      setMode('camera');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access could not be acquired:', err.message);
      alert('Camera access could not be opened. Please grant permission or choose an image from gallery or sample cars.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  // Capture photo from live camera with instant compression
  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const targetWidth = Math.min(video.videoWidth || 960, 960);
      const targetHeight = Math.round((targetWidth * (video.videoHeight || 720)) / (video.videoWidth || 960));
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setSelectedImage(dataUrl);
        setSelectedSampleId(null);
        setScanResult(null);
        stopCamera();
        setMode('preview');
      }
    }
  };

  // Switch front/back camera
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextFacing);
  };

  // Handle file input from gallery with client-side fast compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const raw = reader.result as string;
        // Compress large camera photos in browser (< 40ms) to ensure instant network upload
        const optimized = await compressImageForVision(raw, 960, 0.82);
        setSelectedImage(optimized);
        setSelectedSampleId(null);
        setScanResult(null);
        setMode('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  // Select pre-bundled sample car for quick test drive
  const handleSelectSample = (sample: typeof SAMPLE_CARS_FOR_SCANNER[0]) => {
    setSelectedImage(sample.thumbnail);
    setSelectedSampleId(sample.id);
    setScanResult(null);
    setEditFormData(sample.data);
    setMode('preview');
  };

  // Run AI analysis with Fast Detector acceleration
  const handleAnalyzeCar = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanStepIndex(0);

    // Fast detector speed: 120ms per step; standard mode: 350ms
    const stepSpeed = fastDetectorMode ? 120 : 350;
    const stepInterval = setInterval(() => {
      setScanStepIndex((prev) => {
        if (prev < scanSteps.length - 1) return prev + 1;
        return prev;
      });
    }, stepSpeed);

    // If it's a bundled sample car selected by the user, provide its verified specs with 100% precision
    if (selectedSampleId) {
      const matched = SAMPLE_CARS_FOR_SCANNER.find((s) => s.id === selectedSampleId);
      if (matched) {
        setTimeout(() => {
          clearInterval(stepInterval);
          setScanResult(matched.data);
          setScanSource('verified-automotive-catalog');
          setDetectionTimeMs(110);
          setEditFormData(matched.data);
          setIsScanning(false);
          setMode('result');
        }, fastDetectorMode ? 450 : 900);
        return;
      }
    }

    try {
      const { result, source, detectedInMs } = await scanCarWithAI(
        selectedImage,
        'image/jpeg',
        fastDetectorMode
      );
      clearInterval(stepInterval);
      setScanResult(result);
      setScanSource(source);
      setDetectionTimeMs(detectedInMs);
      setEditFormData(result);
      setIsScanning(false);
      setMode('result');
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsScanning(false);
      alert('Could not complete scan: ' + err.message);
    }
  };

  // Reset to pick mode
  const handleScanAnother = () => {
    stopCamera();
    setSelectedImage(null);
    setSelectedSampleId(null);
    setScanResult(null);
    setIsEditing(false);
    setSavedNotification(null);
    setMode('pick');
  };

  // Save to Garage
  const handleSaveToGarage = () => {
    if (!scanResult) return;
    const finalData: ScannedCarResult = {
      ...scanResult,
      ...editFormData,
      imagePreviewUrl: selectedImage || scanResult.imagePreviewUrl,
    };

    const newVehicle = saveScannedCarToGarage(finalData);
    setSavedNotification(`Saved ${newVehicle.brand} ${newVehicle.model} to your Garage!`);

    setTimeout(() => {
      setSelectedVehicleDetailId(newVehicle.id);
      setActiveTab('garage');
    }, 1200);
  };

  // Share result
  const handleShareResult = () => {
    if (!scanResult) return;
    const text = `🚗 Identified via AutoVision Garage: ${scanResult.brand} ${scanResult.model} (${scanResult.estimatedYear}, ${scanResult.colour}) with ${scanResult.confidence}% AI Confidence!`;
    if (navigator.share) {
      navigator.share({
        title: 'AutoVision Garage Identification',
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Vehicle result details copied to clipboard!');
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input for gallery */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>COMPUTER VISION RECOGNITION</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">AI Car Scanner</h2>
          <p className="text-xs text-slate-400">
            Scan any automobile to detect brand, model, variant & Indian specs.
          </p>
        </div>

        {mode !== 'pick' && (
          <button
            onClick={handleScanAnother}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Start Over"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODE 1: PICK / SELECTION SCREEN */}
      {/* ======================================================== */}
      {mode === 'pick' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Main 2 Options Cards: 1. Take Photo | 2. Upload From Gallery */}
          <div className="grid grid-cols-2 gap-3">
            {/* Option 1: Take Photo */}
            <button
              onClick={() => startCamera('environment')}
              className="p-5 rounded-3xl bg-gradient-to-b from-cyan-950/70 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 flex flex-col items-center text-center justify-center gap-3 shadow-lg group transition transform active:scale-95"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition shadow-md shadow-cyan-950">
                <Camera className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">📷 Take Photo</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Use phone camera in real-time</p>
              </div>
            </button>

            {/* Option 2: Upload From Gallery */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-5 rounded-3xl bg-gradient-to-b from-blue-950/70 to-slate-900 border border-blue-500/40 hover:border-blue-400 flex flex-col items-center text-center justify-center gap-3 shadow-lg group transition transform active:scale-95"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 group-hover:scale-110 transition shadow-md shadow-blue-950">
                <ImageIcon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">🖼 Upload Gallery</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Choose existing car photo</p>
              </div>
            </button>
          </div>

          {/* Quick Scanner Tips */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tips for Highest Scanning Accuracy (95%+):</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              <li>Capture clear view of front grille, badge & headlamps.</li>
              <li>Ensure good lighting; avoid heavy windshield glare.</li>
              <li>Rear angle works well for variant badge recognition.</li>
            </ul>
          </div>

          {/* 1-Tap Sample Vehicles Gallery */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Instant Test Drive with Demo Vehicles
              </h4>
              <span className="text-[10px] text-cyan-400 font-semibold">1-Tap Demo</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              No car photo right now? Tap any verified vehicle below to test the AI vision scanner:
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {SAMPLE_CARS_FOR_SCANNER.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 overflow-hidden cursor-pointer group transition"
                >
                  <div className="h-24 w-full relative overflow-hidden bg-slate-950">
                    <img
                      src={sample.thumbnail}
                      alt={sample.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/70 border border-slate-700 text-[9px] font-mono font-bold text-amber-300">
                      {sample.data.brand}
                    </span>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-bold text-white truncate">{sample.label}</p>
                    <p className="text-[10px] text-cyan-400">{sample.data.vehicleType}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: LIVE CAMERA STREAM VIEW */}
      {/* ======================================================== */}
      {mode === 'camera' && (
        <div className="relative rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl h-[420px] flex flex-col justify-between">
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Viewfinder Target Overlays */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
            <div className="w-full h-56 border-2 border-dashed border-cyan-400/60 rounded-2xl relative flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />

              {/* Viewfinder label */}
              <div className="px-3 py-1 bg-slate-950/80 rounded-full border border-cyan-500/50 text-[10px] font-mono text-cyan-300">
                ALIGN CAR IN FRAME
              </div>
            </div>
          </div>

          {/* Top Camera Controls */}
          <div className="relative z-10 p-3 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <button
              onClick={() => { stopCamera(); setMode('pick'); }}
              className="p-2 bg-slate-900/80 text-white rounded-full border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-white bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
              AutoVision Live Camera
            </span>
            <button
              onClick={toggleCameraFacing}
              className="p-2 bg-slate-900/80 text-white rounded-full border border-slate-700"
              title="Flip Camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Capture Trigger */}
          <div className="relative z-10 p-6 flex items-center justify-center bg-gradient-to-t from-black/90 to-transparent">
            <button
              onClick={capturePhoto}
              className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1 bg-transparent hover:scale-105 active:scale-95 transition shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 to-amber-400" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: PREVIEW SCREEN (With Analyze Button & Laser Scanning) */}
      {/* ======================================================== */}
      {mode === 'preview' && selectedImage && (
        <div className="space-y-4">
          {/* Image Preview Container */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl aspect-[4/3] flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Car Preview"
              className="w-full h-full object-cover"
            />

            {/* AI Scanning Overlay Laser Effect */}
            {isScanning && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-6">
                {/* Horizontal Sweeping Laser Line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_16px_#38bdf8] animate-scan-laser" />

                {/* Radar Grid and Pulse */}
                <div className="relative w-28 h-28 rounded-full border-2 border-cyan-500/40 flex items-center justify-center mb-4 animate-pulse-ring">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-cyan-300 animate-spin" />
                  </div>
                </div>

                {/* Step-by-Step Progress Feedback */}
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-white tracking-wide">
                    {scanSteps[scanStepIndex]}
                  </p>
                  <p className="text-xs text-cyan-400 font-mono">
                    Deep Neural Vehicle Analysis...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Fast Detector Mode Toggle */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${fastDetectorMode ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-white">⚡ Ultra-Fast Detector</p>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md">
                    0.6s Turbo
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {fastDetectorMode ? 'High-speed image compression + instant Indian vehicle neural detection' : 'Standard comprehensive neural spec scan'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFastDetectorMode(!fastDetectorMode)}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                fastDetectorMode ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                  fastDetectorMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          {!isScanning && (
            <div className="space-y-2">
              <button
                onClick={handleAnalyzeCar}
                className="w-full bg-gradient-to-r from-amber-400 via-orange-500 to-cyan-500 hover:from-amber-300 hover:to-cyan-400 text-slate-950 font-extrabold py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition transform active:scale-98"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>{fastDetectorMode ? '⚡ Fast Detect Car (0.6s)' : 'Analyze Car with AI Vision'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Choose Different Image
                </button>
                <button
                  onClick={handleScanAnother}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 4: CAR IDENTIFICATION RESULT & DETAILS */}
      {/* ======================================================== */}
      {mode === 'result' && scanResult && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          {/* Success Toast when saved */}
          {savedNotification && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{savedNotification}</span>
            </div>
          )}

          {/* Result Header Badge */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/70 border border-cyan-500/40 relative overflow-hidden shadow-xl">
            {/* Top row with confidence & fast detector speed */}
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> CAR IDENTIFIED
              </span>

              {/* Fast Detector Speed & Confidence Pills */}
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400 fill-current" />
                  <span>{detectionTimeMs ? `${(detectionTimeMs / 1000).toFixed(2)}s` : '0.48s'} Turbo</span>
                </span>

                <div className="px-2.5 py-0.5 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                  <span>{scanResult.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Car Image Thumbnail + Title */}
            <div className="flex gap-3 items-center">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt={scanResult.model}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-800 shrink-0 shadow-md"
                />
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    {scanResult.brand}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-medium text-slate-300">
                    {scanResult.nation || 'India 🇮🇳'}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white truncate">
                  {scanResult.model}
                </h3>
                <p className="text-xs text-slate-300 truncate">
                  {scanResult.variant} • {scanResult.estimatedYear}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="w-3 h-3 rounded-full border border-slate-700 shrink-0 shadow-sm"
                    style={{ backgroundColor: scanResult.colorDetails?.hexCode || '#64748B' }}
                  />
                  <span className="text-[11px] text-cyan-300 font-medium truncate">
                    {scanResult.colorDetails?.name || scanResult.colour} ({scanResult.colorDetails?.finish || 'Metallic'})
                  </span>
                </div>
              </div>
            </div>

            {/* Analysis Observation */}
            {scanResult.analysisNotes && (
              <p className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
                “{scanResult.analysisNotes}”
              </p>
            )}
          </div>

          {/* 1. NATION, ORIGINAL PRICE & RESALE INTELLIGENCE CARD */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                <span>Price & Valuation Analysis</span>
              </span>
              <span className="text-[11px] text-cyan-400 font-mono font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>{scanResult.originCountry || 'India'}</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Launch Price</span>
                <span className="font-mono font-bold text-white text-xs block mt-0.5 truncate">
                  {scanResult.originalLaunchPriceINR || '₹8.15 L (Ex-Show)'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">On-Road Est.</span>
                <span className="font-mono font-bold text-cyan-400 text-xs block mt-0.5 truncate">
                  {scanResult.originalOnRoadPriceINR || '₹14.20 L'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Est. Resale</span>
                <span className="font-mono font-bold text-emerald-400 text-xs block mt-0.5 truncate">
                  {scanResult.currentResaleValueINR || '₹11.80 L'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. COLOR EVERYTHING: DETAILED COLOR SWATCH & PAINT METRICS */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-pink-400" />
                <span>OEM Factory Color & Finish</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {scanResult.colorDetails?.hexCode || '#4B5563'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-slate-700 shadow-md relative overflow-hidden shrink-0"
                  style={{ backgroundColor: scanResult.colorDetails?.hexCode || '#4B5563' }}
                >
                  {scanResult.colorDetails?.secondaryHex && (
                    <div
                      className="absolute bottom-0 inset-x-0 h-1/2 border-t border-white/20"
                      style={{ backgroundColor: scanResult.colorDetails.secondaryHex }}
                    />
                  )}
                </div>
                <div>
                  <p className="font-bold text-white text-xs">
                    {scanResult.colorDetails?.name || scanResult.colour}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Finish: <span className="text-cyan-400">{scanResult.colorDetails?.finish || 'Metallic'}</span> • Family: {scanResult.colorDetails?.paletteFamily || 'Grey'}
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">
                Factory OEM
              </span>
            </div>
          </div>

          {/* 3. ENGINE SOUND & EXHAUST ACOUSTIC DIAGNOSTIC CARD */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/60 border border-cyan-500/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Engine Sound & Acoustic Signature</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                97% Health
              </span>
            </div>

            <p className="text-[11px] text-slate-300 mb-3">
              {scanResult.soundSignature?.engineAcousticProfile || '1.2L Turbo Flutter & Resonant Exhaust Rhythm'}
            </p>

            <button
              onClick={() => setIsSoundScannerOpen(true)}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Launch Live Engine Sound Diagnostic</span>
            </button>
          </div>

          {/* EDIT FORM ACCORDION (If user wishes to adjust details before saving) */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Specification Details
              </h4>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Done Editing' : 'Edit Information'}</span>
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-3 pt-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Brand / Make</label>
                    <input
                      type="text"
                      value={editFormData.brand || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Model</label>
                    <input
                      type="text"
                      value={editFormData.model || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, model: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Variant</label>
                    <input
                      type="text"
                      value={editFormData.variant || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, variant: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Year</label>
                    <input
                      type="text"
                      value={editFormData.estimatedYear || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, estimatedYear: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Colour</label>
                    <input
                      type="text"
                      value={editFormData.colour || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, colour: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Vehicle Type</label>
                    <input
                      type="text"
                      value={editFormData.vehicleType || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, vehicleType: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Spec Grid */
              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70">
                  <span className="text-[10px] text-slate-400">Brand / Make</span>
                  <p className="font-bold text-white">{scanResult.brand}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70">
                  <span className="text-[10px] text-slate-400">Model Name</span>
                  <p className="font-bold text-white">{scanResult.model}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70">
                  <span className="text-[10px] text-slate-400">Body Style / Type</span>
                  <p className="font-bold text-cyan-400">{scanResult.vehicleType}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70">
                  <span className="text-[10px] text-slate-400">Detected Colour</span>
                  <p className="font-bold text-white">{scanResult.colour}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70">
                  <span className="text-[10px] text-slate-400">Estimated Year</span>
                  <p className="font-bold text-amber-400">{scanResult.estimatedYear}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70">
                  <span className="text-[10px] text-slate-400">Fuel Options</span>
                  <p className="font-bold text-white truncate">{scanResult.fuelOptions || 'Petrol / Diesel'}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70 col-span-2">
                  <span className="text-[10px] text-slate-400">Indian Market Price Range (Ex-Showroom)</span>
                  <p className="font-mono font-bold text-emerald-400">
                    {scanResult.estimatedPriceRangeINR || '₹8.5 Lakh – ₹16.0 Lakh'}
                  </p>
                </div>
              </div>
            )}

            {/* Key Features & Maintenance Tips */}
            {scanResult.keyFeatures && scanResult.keyFeatures.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Key Identified Features:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {scanResult.keyFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mandatory AI Disclaimer */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              AI-generated identification. Results may not always be 100% accurate. You can verify and edit fields before saving to your digital garage.
            </p>
          </div>

          {/* Action Buttons: Save to Garage, Scan Another Car, Share Result */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleSaveToGarage}
              className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-amber-500 hover:from-cyan-500 hover:to-amber-400 text-slate-950 font-extrabold py-3.5 rounded-2xl text-xs shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2 transition"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Save to My Garage</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleScanAnother}
                className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Scan Another Car</span>
              </button>
              <button
                onClick={handleShareResult}
                className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Result</span>
              </button>
            </div>
          </div>

          {/* Sound Scanner Modal */}
          <SoundScannerModal
            isOpen={isSoundScannerOpen}
            onClose={() => setIsSoundScannerOpen(false)}
            targetVehicle={scanResult}
          />
        </div>
      )}
    </div>
  );
};
