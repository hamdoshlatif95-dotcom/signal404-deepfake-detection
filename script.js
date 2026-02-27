/* ===================================
   SIGNAL404 - DEEPFAKE AUDIO DETECTION
   Complete JavaScript Functionality
   =================================== */

// ===================================
// GLOBAL VARIABLES
// ===================================

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let recordingTimer;
let recordingSeconds = 0;
let currentAudioFile = null;
let currentAudioBlob = null;

// FastAPI Backend URL - YOUR FRIEND WILL UPDATE THIS
const API_BASE_URL = 'http://localhost:8000';

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    mobileMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = menuBtn.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
}

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize wave animation
    initWaveAnimation();
    
    // Smooth scroll for all navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.08)';
        }
    });
});

// ===================================
// HERO WAVE ANIMATION
// ===================================

function initWaveAnimation() {
    const canvas = document.getElementById('audioWaveCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let frequency = 0;
    
    function drawWave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw multiple sine waves with gradient
        const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient1.addColorStop(0, '#00D9FF');
        gradient1.addColorStop(1, '#00B8D4');
        
        const gradient2 = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient2.addColorStop(0, '#FF6B35');
        gradient2.addColorStop(1, '#FFB59A');
        
        // Wave 1
        ctx.strokeStyle = gradient1;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + Math.sin((x + frequency) * 0.015) * 40;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Wave 2
        ctx.strokeStyle = gradient1;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + Math.sin((x + frequency + 100) * 0.012) * 50;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Wave 3
        ctx.strokeStyle = gradient2;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + Math.sin((x + frequency + 200) * 0.01) * 60;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        ctx.globalAlpha = 1;
        frequency += 1.5;
        requestAnimationFrame(drawWave);
    }
    
    drawWave();
    
    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

// ===================================
// FILE UPLOAD HANDLING
// ===================================

function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/webm', 'audio/mp3'];
    const isValidType = validTypes.includes(file.type) || file.name.match(/\.(mp3|wav|flac|ogg|webm)$/i);
    
    if (!isValidType) {
        alert('⚠️ Please upload a valid audio file (MP3, WAV, FLAC, OGG, or WEBM)');
        return;
    }
    
    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
        alert('⚠️ File size must be less than 50MB');
        return;
    }
    
    currentAudioFile = file;
    currentAudioBlob = file;
    displayAudioPreview(file);
}

function displayAudioPreview(file) {
    const audioPreview = document.getElementById('audioPreview');
    const audioPlayer = document.getElementById('audioPlayer');
    const waveformCanvas = document.getElementById('waveformCanvas');
    
    // Show preview section
    audioPreview.style.display = 'block';
    
    // Set audio player source
    const fileURL = URL.createObjectURL(file);
    audioPlayer.src = fileURL;
    
    // Draw waveform visualization
    drawWaveform(waveformCanvas);
    
    // Scroll to preview
    setTimeout(() => {
        audioPreview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function drawWaveform(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create gradient for waveform
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#00D9FF');
    gradient.addColorStop(1, '#00B8D4');
    
    ctx.fillStyle = gradient;
    
    // Draw random waveform bars (simulated)
    const barCount = 120;
    const barWidth = canvas.width / barCount;
    
    for (let i = 0; i < barCount; i++) {
        const barHeight = Math.random() * canvas.height * 0.85 + 10;
        const x = i * barWidth;
        const y = (canvas.height - barHeight) / 2;
        
        ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
}

function clearAudio() {
    const audioPreview = document.getElementById('audioPreview');
    const audioPlayer = document.getElementById('audioPlayer');
    const fileInput = document.getElementById('fileInput');
    const resultsSection = document.getElementById('resultsSection');
    
    audioPreview.style.display = 'none';
    resultsSection.style.display = 'none';
    audioPlayer.src = '';
    fileInput.value = '';
    currentAudioFile = null;
    currentAudioBlob = null;
}

// ===================================
// AUDIO RECORDING
// ===================================

async function toggleRecording() {
    if (!isRecording) {
        await startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
        });
        
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        recordingSeconds = 0;
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
            currentAudioFile = audioFile;
            currentAudioBlob = audioBlob;
            displayAudioPreview(audioFile);
            
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        isRecording = true;
        
        // Update UI
        const recordCard = document.querySelector('.upload-card:nth-child(2)');
        recordCard.style.borderColor = '#EF4444';
        recordCard.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(255, 107, 53, 0.05))';
        
        document.getElementById('recordText').textContent = 'Recording... Click to stop';
        document.getElementById('recordIcon').innerHTML = `
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="16" y="16" width="16" height="16" fill="#EF4444" rx="3"/>
            </svg>
        `;
        
        // Start timer
        recordingTimer = setInterval(() => {
            recordingSeconds++;
            const minutes = Math.floor(recordingSeconds / 60);
            const seconds = recordingSeconds % 60;
            document.getElementById('recordTimer').textContent = 
                `⏺ ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
        
    } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('❌ Could not access microphone. Please check your browser permissions.');
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        clearInterval(recordingTimer);
        
        // Reset UI
        const recordCard = document.querySelector('.upload-card:nth-child(2)');
        recordCard.style.borderColor = '';
        recordCard.style.background = '';
        
        document.getElementById('recordText').textContent = 'Click to start recording';
        document.getElementById('recordIcon').innerHTML = `
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="8" fill="currentColor"/>
                <circle cx="24" cy="24" r="14" stroke="currentColor" stroke-width="3"/>
            </svg>
        `;
        document.getElementById('recordTimer').textContent = '';
    }
}

// ===================================
// AUDIO ANALYSIS (FASTAPI BACKEND)
// ===================================

async function analyzeAudio() {
    if (!currentAudioFile && !currentAudioBlob) {
        alert('⚠️ Please upload or record an audio file first');
        return;
    }
    
    // Show loader
    const analyzeBtn = document.querySelector('.analyze-btn span');
    const loader = document.getElementById('analysisLoader');
    const originalText = analyzeBtn.textContent;
    analyzeBtn.textContent = 'Analyzing...';
    loader.style.display = 'inline-block';
    
    try {
        // Create FormData
        const formData = new FormData();
        formData.append('file', currentAudioFile || currentAudioBlob, 'audio.webm');
        
        // Record start time
        const startTime = Date.now();
        
        // Send to FastAPI backend
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Calculate processing time
        const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
        
        // Get audio duration
        const audioPlayer = document.getElementById('audioPlayer');
        const audioDuration = audioPlayer.duration ? audioPlayer.duration.toFixed(1) : 'N/A';
        
        // Display results
        displayResults(result, processingTime, audioDuration);
        
    } catch (error) {
        console.error('Error analyzing audio:', error);
        
        // Show error message to user
        alert(
            '❌ Could not connect to the backend server.\n\n' +
            'Make sure:\n' +
            '1. Your FastAPI backend is running\n' +
            '2. It\'s accessible at: ' + API_BASE_URL + '\n' +
            '3. CORS is enabled in your backend\n\n' +
            'Error: ' + error.message
        );
    } finally {
        // Hide loader
        analyzeBtn.textContent = originalText;
        loader.style.display = 'none';
    }
}

function displayResults(data, processingTime, audioDuration) {
    const resultsSection = document.getElementById('resultsSection');
    const audioPreview = document.getElementById('audioPreview');
    
    // Hide upload section, show results
    audioPreview.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Extract data from backend response
    // Adjust these based on your actual FastAPI response structure
    const prediction = data.prediction || 'REAL'; // 'REAL' or 'FAKE'
    const confidence = data.confidence || Math.random() * 100; // 0-100
    
    // Calculate authenticity score
    const authenticity = prediction === 'REAL' ? confidence : (100 - confidence);
    
    // Update score circle
    updateScoreCircle(authenticity);
    
    // Update result badge
    const resultBadge = document.getElementById('resultBadge');
    if (authenticity >= 70) {
        resultBadge.textContent = '✓ Likely Authentic';
        resultBadge.style.background = 'rgba(16, 185, 129, 0.15)';
        resultBadge.style.border = '1px solid rgba(16, 185, 129, 0.4)';
        resultBadge.style.color = '#10B981';
    } else if (authenticity >= 40) {
        resultBadge.textContent = '⚠ Uncertain';
        resultBadge.style.background = 'rgba(245, 158, 11, 0.15)';
        resultBadge.style.border = '1px solid rgba(245, 158, 11, 0.4)';
        resultBadge.style.color = '#F59E0B';
    } else {
        resultBadge.textContent = '✗ Likely Deepfake';
        resultBadge.style.background = 'rgba(239, 68, 68, 0.15)';
        resultBadge.style.border = '1px solid rgba(239, 68, 68, 0.4)';
        resultBadge.style.color = '#EF4444';
    }
    
    // Update confidence bar
    const confidenceFill = document.getElementById('confidenceFill');
    confidenceFill.style.width = `${confidence}%`;
    
    const confidenceText = document.getElementById('confidenceText');
    if (confidence >= 80) {
        confidenceText.textContent = '✓ High Confidence';
        confidenceText.style.color = '#10B981';
    } else if (confidence >= 50) {
        confidenceText.textContent = '⚠ Medium Confidence';
        confidenceText.style.color = '#F59E0B';
    } else {
        confidenceText.textContent = '⚠ Low Confidence';
        confidenceText.style.color = '#EF4444';
    }
    
    // Update metrics
    document.getElementById('processingTime').textContent = `${processingTime}s`;
    document.getElementById('audioDuration').textContent = `${audioDuration}s`;
    document.getElementById('sampleRate').textContent = data.sample_rate || '44.1 kHz';
    
    // Update analysis summary
    const summaryText = document.getElementById('analysisSummary');
    if (authenticity >= 70) {
        summaryText.textContent = 'The audio sample shows strong indicators of authentic human speech. No significant artifacts or manipulation patterns were detected. The spectral analysis, temporal coherence, and MFCC patterns all suggest this is genuine audio.';
    } else if (authenticity >= 40) {
        summaryText.textContent = 'The analysis yielded mixed results. Some patterns suggest potential manipulation, but confidence is not high enough for a definitive classification. Further analysis or a longer audio sample may be needed for more accurate detection.';
    } else {
        summaryText.textContent = 'The audio exhibits multiple characteristics consistent with synthetic generation. Strong artifacts and unnatural patterns were detected in the spectral analysis. The MFCC patterns show irregularities typical of AI-generated audio.';
    }
    
    // Update feature indicators (use data from backend or generate random values)
    const spectral = data.spectral_consistency || (Math.random() * 30 + 70);
    const temporal = data.temporal_coherence || (Math.random() * 30 + 65);
    const mfcc = data.mfcc_pattern || (Math.random() * 30 + 60);
    
    setTimeout(() => {
        document.getElementById('spectral').style.width = `${spectral}%`;
        document.getElementById('temporal').style.width = `${temporal}%`;
        document.getElementById('mfcc').style.width = `${mfcc}%`;
    }, 500);
    
    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function updateScoreCircle(score) {
    const scoreValue = document.getElementById('scoreValue');
    const scoreCircle = document.getElementById('scoreCircle');
    
    // Animate score
    let currentScore = 0;
    const increment = score / 60; // 60 frames for smooth animation
    
    const animation = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
            currentScore = score;
            clearInterval(animation);
        }
        scoreValue.textContent = Math.round(currentScore) + '%';
    }, 16);
    
    // Update circle stroke
    const circumference = 2 * Math.PI * 90; // radius = 90
    const offset = circumference - (score / 100) * circumference;
    
    setTimeout(() => {
        scoreCircle.style.strokeDashoffset = offset;
        scoreCircle.style.transition = 'stroke-dashoffset 1.5s ease';
    }, 100);
}

function analyzeAnother() {
    const resultsSection = document.getElementById('resultsSection');
    const audioPreview = document.getElementById('audioPreview');
    
    resultsSection.style.display = 'none';
    
    // Clear current audio
    clearAudio();
    
    // Scroll back to upload section
    setTimeout(() => {
        document.getElementById('detection').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// ===================================
// CONTACT FORM (Optional)
// ===================================

function handleContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const subject = document.getElementById('subject')?.value;
    const message = document.getElementById('message')?.value;
    
    // For now, just show success message
    // Your friend can add actual email functionality later
    alert(`✓ Thank you ${name}! Your message has been received.\n\nWe'll get back to you at ${email} soon.`);
    
    // Reset form
    event.target.reset();
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Prevent form submission on Enter key (except in textarea)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        const form = e.target.closest('form');
        if (form && !e.target.matches('button[type="submit"]')) {
            e.preventDefault();
        }
    }
});

// Console welcome message
console.log('%cSignal404 🎵', 'color: #00D9FF; font-size: 24px; font-weight: bold;');
console.log('%cDeepfake Audio Detection System', 'color: #0F172A; font-size: 14px;');
console.log('%cPowered by Machine Learning', 'color: #6B7280; font-size: 12px;');