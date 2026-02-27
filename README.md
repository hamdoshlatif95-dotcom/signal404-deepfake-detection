# 🎵 Signal404 - Deepfake Audio Detection

![Signal404 Banner](https://img.shields.io/badge/AI-Deepfake%20Detection-00D9FF?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-10B981?style=for-the-badge)

An advanced AI-powered web application for detecting deepfake audio using machine learning.

## 🚀 Features

- **Real-Time Analysis** - Instant deepfake detection as audio is uploaded or recorded
- **Advanced ML Models** - Trained on authentic and synthetic voice samples
- **Interactive UI** - Modern, professional interface with smooth animations
- **Multiple Input Methods** - Upload files or record directly in browser
- **Detailed Results** - Comprehensive analysis with confidence scores
- **Secure & Private** - Audio processed securely, never stored

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6+)** - Interactive functionality
- **Canvas API** - Waveform visualizations

### Backend
- **FastAPI** - High-performance Python web framework
- **TensorFlow/PyTorch** - Machine learning models
- **Librosa** - Audio analysis
- **NumPy/Pandas** - Data processing

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Microphone access (for recording feature)
- FastAPI backend server (for audio analysis)

## 🚀 Getting Started

### Frontend Setup

1. **Clone the repository**
```bash
   git clone https://github.com/hamdoshlatif95-dotcom/signal404-deepfake-detection.git
   cd signal404-deepfake-detection
```

2. **Open the application**
   - Simply open `index.html` in your web browser
   - Or use a local server:
```bash
     python -m http.server 8080
```
   - Navigate to `http://localhost:8080`

### Backend Setup

1. Your backend developer will set up the FastAPI server
2. Update `API_BASE_URL` in `script.js` to match the backend URL

## 📁 Project Structure
```
signal404-deepfake-detection/
├── index.html              # Main HTML file
├── styles.css              # Styling and animations
├── script.js               # Interactive functionality
├── images/                 # Image assets
│   ├── aimen.png
│   ├── ayesha.png
│   ├── hamdosh.png
│   └── deepfake-ai.jpg
└── README.md               # Documentation
```

## 🎯 Usage

1. **Upload Audio**
   - Click "Upload Audio File"
   - Select an audio file (MP3, WAV, FLAC, OGG, WEBM)
   - Max file size: 50MB

2. **Record Audio**
   - Click "Live Recording"
   - Allow microphone access
   - Record your audio
   - Click again to stop

3. **Analyze**
   - Click "Analyze Audio"
   - Wait for results
   - View detailed analysis

## 🧠 How It Works

Signal404 uses a three-step process:

1. **Audio Ingestion** - File upload or live recording with preprocessing
2. **Neural Analysis** - ML model extracts features and analyzes patterns
3. **Result Verification** - Confidence scoring with detailed metrics

The system analyzes:
- Spectral consistency
- Temporal coherence
- MFCC patterns (Mel-frequency cepstral coefficients)
- Harmonic structures

## 👥 Team

- **Aimen Ijaz** - Electrical & ML Engineer
- **Hamdosh Latif** - Electrical & ML Engineer
- **Ayesha Javed** - Electrical & ML Engineer

## 📊 Performance

- **Accuracy**: 89%
- **Detection Time**: <15 seconds
- **Samples Analyzed**: 40,000+

## 🔧 Backend Integration

The backend developer needs to:

1. Create a FastAPI endpoint at `/predict`
2. Accept audio files via POST request
3. Return JSON with prediction results
4. Enable CORS for frontend access

Example response format:
```json
{
  "prediction": "REAL",
  "confidence": 85.5,
  "sample_rate": "44.1 kHz",
  "spectral_consistency": 82.3,
  "temporal_coherence": 91.2,
  "mfcc_pattern": 78.9
}
```

## 📧 Contact

- **Email**: aah.fyp@gmail.com
- **GitHub**: [Backend Repository](https://github.com/aahfyp-commits/deep-fake-audio-detector-backend)
- **Institution**: Military College Of Signals, NUST, Rawalpindi, Pakistan

## 🙏 Acknowledgments

- Military College Of Signals, NUST
- FastAPI Community
- TensorFlow/PyTorch Teams

---

**⚡ Built with passion for AI security and audio authenticity**

**📅 Final Year Project 2025-2026**
```

4. Scroll down and click **"Commit new file"**

---

### **STEP 7: Verify Your Upload**

Your repository should now have:
```
signal404-deepfake-detection/
├── index.html
├── styles.css
├── script.js
├── README.md
└── images/
    ├── aimen.png
    ├── ayesha.png
    ├── hamdosh.png
    └── deepfake-ai.jpg
```

---

### **STEP 8: Share with Your Friend**

1. Copy your repository URL. It will be:
```
   https://github.com/hamdoshlatif95-dotcom/signal404-deepfake-detection
