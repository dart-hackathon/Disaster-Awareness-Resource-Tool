document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all emergency cards for scroll animations
    document.querySelectorAll('.emergency-card').forEach(card => {
        observer.observe(card);
    });

    // Hover effect for steps
    document.querySelectorAll('.steps-list li').forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.style.color = '#007BFF';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.color = '#333';
        });
    });

    // Click event for emergency banner
    const emergencyBanner = document.querySelector('.emergency-banner');
    if (emergencyBanner) {
        emergencyBanner.addEventListener('click', function() {
            if (confirm('Would you like to call emergency services (112)?')) {
                window.location.href = 'tel:112';
            }
        });
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Accordion functionality
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            body.style.display = body.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Quiz functionality
    const quizButton = document.getElementById('start-quiz');
    const quizContainer = document.getElementById('quiz-container');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const nextButton = document.getElementById('next-question');
    const quizResults = document.getElementById('quiz-results');
    const scoreDisplay = document.getElementById('score');
    const restartButton = document.getElementById('restart-quiz');

    const questions = [
        {
            question: "What should you do first in a cardiac arrest?",
            options: ["Start CPR", "Call 112", "Check for breathing"],
            answer: "Call 112"
        },
        {
            question: "How long should you cool a burn under running water?",
            options: ["5 minutes", "10 minutes", "15 minutes"],
            answer: "10 minutes"
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    quizButton.addEventListener('click', startQuiz);
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    });
    restartButton.addEventListener('click', restartQuiz);

    function startQuiz() {
        quizContainer.classList.remove('hidden');
        quizButton.classList.add('hidden');
        showQuestion();
    }

    function showQuestion() {
        const question = questions[currentQuestionIndex];
        quizQuestion.innerText = question.question;
        quizOptions.innerHTML = '';
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.onclick = () => checkAnswer(option);
            quizOptions.appendChild(button);
        });
        nextButton.classList.add('hidden');
    }

    function checkAnswer(selectedOption) {
        const correctAnswer = questions[currentQuestionIndex].answer;
        if (selectedOption === correctAnswer) {
            score++;
        }
        nextButton.classList.remove('hidden');
    }

    function showResults() {
        quizContainer.classList.add('hidden');
        quizResults.classList.remove('hidden');
        scoreDisplay.innerText = `You scored ${score} out of ${questions.length}!`;
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        quizResults.classList.add('hidden');
        quizButton.classList.remove('hidden');
    }
});
