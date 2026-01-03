import React, { useRef, useState, useEffect } from 'react'
import { Camera, RefreshCw, XCircle } from 'lucide-react'
import visionService from '../../services/visionService'

const VisionQC = ({ onScanComplete, mode = 'OBJECT_DETECTION' }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [detections, setDetections] = useState([])

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
      }
    } catch (err) {
      console.error('Camera Error:', err)
      // Fallback for easy testing without permissions
      setIsStreaming(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const captureAndAnalyze = async () => {
    if (!videoRef.current) return

    setAnalyzing(true)
    setDetections([])

    // Capture frame to canvas
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob (mock simulation)
    canvas.toBlob(async (blob) => {
      try {
        let results
        if (mode === 'OCR') {
          results = await visionService.performOCR(blob)
        } else {
          results = await visionService.analyzeImage(blob)
        }

        setDetections(Array.isArray(results) ? results : [results]) // normalize
        if (onScanComplete) onScanComplete(results)
      } catch (error) {
        console.error('Vision Analysis Failed:', error)
      } finally {
        setAnalyzing(false)
      }
    })
  }

  return (
    <div className="vision-qc relative rounded-xl overflow-hidden glass border border-white/10 bg-black">
      {/* Live Feed */}
      <div className="relative aspect-video bg-black flex items-center justify-center">
        {isStreaming ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="text-center text-slate-500 p-8">
            <Camera size={48} className="mx-auto mb-2 opacity-50" />
            <p>Simulating Camera Input</p>
            <p className="text-xs mt-2">(Use 'Capture' to mock scan)</p>
          </div>
        )}

        {/* Overlays */}
        {detections.map((det, idx) => (
          <div
            key={idx}
            className="absolute border-2 border-green-400 bg-green-400/20 text-green-400 text-xs font-bold px-1 rounded animate-pulse"
            style={{
              // Mock positioning for demo
              top: `${20 + idx * 10}%`,
              left: `${20 + idx * 20}%`,
              width: '150px',
              height: '100px',
            }}
          >
            {det.label || det.text || 'Detected'}
            <span className="block text-[10px] opacity-75">
              {det.confidence ? `${Math.round(det.confidence * 100)}% Conf` : 'Text Extracted'}
            </span>
          </div>
        ))}

        {/* Scanning overlay */}
        {analyzing && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center pointer-events-none z-20">
            <div className="w-full h-1 bg-cyan-400 box-shadow-cyan blur-sm animate-[scan_1.5s_ease-in-out_infinite]" />
            <p className="mt-4 font-mono text-cyan-400 text-sm tracking-widest animate-pulse">
              ANALYZING SCENE...
            </p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      <div className="p-4 flex justify-between items-center glass-card-top border-t border-white/5">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500'} shadow-lg`}
          />
          <span className="text-xs text-slate-400 font-mono tracking-wider">
            {isStreaming ? 'LIVE FEED ACTIVE' : 'SIMULATION MODE'}
          </span>
        </div>

        <button
          disabled={analyzing}
          onClick={captureAndAnalyze}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <>Processing...</>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" /> SCAN NOW
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-150px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(150px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default VisionQC
