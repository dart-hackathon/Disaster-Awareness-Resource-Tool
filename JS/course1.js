const quizSection = document.getElementById('quiz-section');
const certificateBtn = document.getElementById('certificate-btn');
const goBackBtn = document.getElementById('go-back-btn');
const nameInputDiv = document.getElementById('name-input');
const quizModal = document.getElementById('quizModal');
const quizModal2 = document.getElementById('quizModal2');

let player; // Declare player variable in a broader scope
let videoCompleted = false; // Moved outside to avoid redeclaration
const progressMessage = document.getElementById('progress-message');

// Event listener for DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    checkDarkMode();
    initializeVideo();
    addAccessibility();
    loadProgress();

    // Add periodic progress saving
    setInterval(saveProgress, 30000); // Save every 30 seconds

    // Initialize video player
    player = videojs('my-video');
    player.on('error', handleVideoError);

    // Video event listeners
    setupVideoEvents();
});

function initializeVideo() {
    // Initialize video player if not already initialized
    if (!player) {
        player = videojs('my-video', {
            controls: true,
            fluid: true,
            playbackRates: [0.5, 1, 1.5, 2],
            userActions: { hotkeys: true }
        });
    }
}

function setupVideoEvents() {
    // Track video progress and handle video end logic
    player.on('play', function() {
        if (!videoCompleted && progressMessage) {
            progressMessage.style.display = 'block';
        }
    });

    player.on('timeupdate', function() {
        if (!videoCompleted && progressMessage) {
            const progress = (player.currentTime() / player.duration()) * 100;
            progressMessage.textContent = `Video Progress: ${Math.round(progress)}%`;
        }
    });

    // Prevent seeking ahead if the video isn't completed
    player.on('seeking', function() {
        if (!videoCompleted && player.currentTime() > player.duration() * 0.95) {
            player.currentTime(0);
            alert('Please watch the complete video before accessing the quiz.');
        }
    });

    // When the video ends, show quiz
    player.on('ended', function() {
        if (!videoCompleted) {
            videoCompleted = true;
            if (progressMessage) {
                progressMessage.textContent = 'Video completed! Quiz loading...';
            }

            setTimeout(() => {
                if (progressMessage) {
                    progressMessage.style.display = 'none';
                }
                quizSection.style.display = 'block';
                goBackBtn.style.display = 'inline-block';
                quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                showCompletionMessage();
            }, 1000);
        }
    });

    // Add custom styling for dark mode compatibility
    if (document.body.classList.contains('dark-mode')) {
        player.addClass('vjs-dark-mode');
    }
}

function loadProgress() {
    const savedProgress = localStorage.getItem('videoProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        const lastUpdated = new Date(progress.lastUpdated);
        const now = new Date();
        const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60);

        if (hoursSinceUpdate < 24 && player) {
            player.currentTime(progress.currentTime);
            videoCompleted = progress.completed;
        } else {
            localStorage.removeItem('videoProgress');
        }
    }
}

function saveProgress() {
    if (player) {
        const currentTime = player.currentTime();
        const progress = {
            currentTime: currentTime,
            completed: videoCompleted,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('videoProgress', JSON.stringify(progress));
    }
}

function handleVideoError() {
    console.error('Video error occurred');
}

function showCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'completion-message';
    message.innerHTML = `
        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p class="font-bold">Video Completed!</p>
            <p>You can now take the quiz below.</p>
        </div>
    `;
    quizSection.parentNode.insertBefore(message, quizSection);
    setTimeout(() => message.remove(), 5000);
}

function startQuiz() {
    quizSection.style.display = 'block';
    goBackBtn.style.display = 'inline-block';
    // Scroll the quiz section into view smoothly
    quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showCompletionMessage();
}


function submitQuiz() {
    const answers = ['b', 'd', 'b', 'a', 'c', 'c', 'c', 'b', 'a', 'd'];
    let score = 0;
    let allQuestionsAnswered = true;

    for (let i = 1; i <= 10; i++) {
        const selectedAnswer = document.querySelector(`input[name="q${i}"]:checked`);
        if (!selectedAnswer) {
            allQuestionsAnswered = false;
            break;
        }
        if (selectedAnswer.value === answers[i - 1]) score++;
    }

    if (!allQuestionsAnswered) {
        alert('Please answer all questions before submitting.');
        return;
    }

    const percentage = (score / 10) * 100;
    if (percentage >= 75) {
        openModal();
        certificateBtn.style.display = 'inline-block';
    } else {
        openModal2();
    }
}

function openModal() {
    quizModal.style.display = 'block';
}

function openModal2() {
    quizModal2.style.display = 'block';
}

function closeModal() {
    quizModal.style.display = 'none';
}

function closeModal2() {
    quizModal2.style.display = 'none';
    resetQuiz();
}

function showNameInput() {
    nameInputDiv.style.display = 'block';
    certificateBtn.style.display = 'none';
}

function generateCertificate() {
    const userName = document.getElementById('user-name').value.trim();
    if (!userName) {
        alert('Please enter your name for the certificate.');
        return;
    }

    // Access jsPDF correctly from the UMD bundle
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Design the certificate
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 297, 210, 'F'); // Background rectangle
    doc.setDrawColor(0); // Set color for border
    doc.setLineWidth(1); // Set border thickness
    doc.rect(10, 10, 277, 190); // Border

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(44, 62, 80);
    doc.text('Certificate of Completion', 148.5, 40, { align: 'center' });

    // Certifying message
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', 148.5, 70, { align: 'center' });

    // User's Name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(userName, 148.5, 85, { align: 'center' });

    // Course name
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully completed the course', 148.5, 100, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text('Disaster Management 101', 148.5, 115, { align: 'center' });

    // Date
    const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${date}`, 148.5, 160, { align: 'center' });

    // Save the PDF with a downloadable filename
    const fileName = `${userName.replace(/\s+/g, '_')}_Certificate.pdf`;
    doc.save(fileName);
}


function resetQuiz() {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(button => button.checked = false);

    quizSection.style.display = 'none';
    certificateBtn.style.display = 'none';
    nameInputDiv.style.display = 'none';
    if (document.getElementById('start-quiz-btn')) {
        document.getElementById('start-quiz-btn').style.display = 'block';
    }
}

function toggleDarkMode() {
    const body = document.body;
    const icon = document.querySelector('#darkModeToggle i');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('darkMode', 'disabled');
    }

    const player = videojs('my-video');
    if (player) {
        if (body.classList.contains('dark-mode')) {
            player.addClass('vjs-dark-mode');
        } else {
            player.removeClass('vjs-dark-mode');
        }
    }
}

function checkDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    const icon = document.querySelector('#darkModeToggle i');

    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        if (icon) icon.className = 'fas fa-sun';
    }
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.navbar ul');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

function goBack() {
    const videoSection = document.getElementById('video-section');
    if (videoSection) {
        videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    resetQuiz();
}

function addAccessibility() {
    const quizControls = document.querySelectorAll('.quiz-control');
    quizControls.forEach(control => {
        control.setAttribute('tabindex', '0');
    });
}