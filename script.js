document.addEventListener('DOMContentLoaded', function() {
    initializeAll();
});

function initializeAll() {
    initializeSkillBars();
    initializeProjectCards();
    initializeContactForm();
    initializeImageSlider();
    initializeThemeToggle();
    initializeBackToTop();
    initializeCanvas();
    initializeMobileMenu();
}

function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const skillLevel = skillBar.getAttribute('data-skill');
                skillBar.style.width = '0%';
                setTimeout(() => {
                    skillBar.style.transition = 'width 2s ease-in-out';
                    skillBar.style.width = skillLevel + '%';
                }, 100);
                observer.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });
    skillBars.forEach(bar => observer.observe(bar));
}

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearFormErrors();
        const formData = validateForm();
        if (formData.isValid) {
            const submissionData = {
                name: formData.data.name,
                email: formData.data.email,
                message: formData.data.message,
                timestamp: new Date().toLocaleString()
            };
            localStorage.setItem('contactFormData', JSON.stringify(submissionData));
            showFormStatus('Message sent successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'form-details.html';
            }, 2000);
        } else {
            showFormStatus('Please fix the errors above.', 'error');
        }
    });
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let isValid = true;
    if (name.length < 2) {
        showFieldError('nameError', 'Name must be at least 2 characters long');
        isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    if (message.length < 10) {
        showFieldError('messageError', 'Message must be at least 10 characters long');
        isValid = false;
    }
    return {
        isValid,
        data: { name, email, message }
    };
}

function showFieldError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

function showFormStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
    }
}

function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (url && url !== '#') {
                window.open(url, '_blank');
            }
        });
        card.style.cursor = 'pointer';
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function initializeCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    const clearBtn = document.getElementById('clearCanvas');
    const colorPicker = document.getElementById('colorPicker');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentColor = '#2563eb';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    function startDrawing(e) {
        isDrawing = true;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    }
    function stopDrawing() {
        isDrawing = false;
    }
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }
    if (colorPicker) {
        colorPicker.addEventListener('change', function() {
            currentColor = this.value;
            ctx.strokeStyle = currentColor;
        });
    }
    drawWelcomeMessage();
    function drawWelcomeMessage() {
        ctx.font = '16px Inter';
        ctx.fillStyle = '#6b7280';
        ctx.textAlign = 'center';
        ctx.fillText('Draw something!', canvas.width / 2, canvas.height / 2);
    }
}

function initializeImageSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (slides.length === 0) return;
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });
    setInterval(nextSlide, 5000);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    if (!themeToggle) return;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateThemeToggleIcon(savedTheme === 'dark-mode');
    }
    themeToggle.addEventListener('click', function() {
        const isDarkMode = body.classList.contains('dark-mode');
        if (isDarkMode) {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
            updateThemeToggleIcon(false);
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            updateThemeToggleIcon(true);
        }
    });
    function updateThemeToggleIcon(isDark) {
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    }
}

function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
            backToTopBtn.style.opacity = '1';
        } else {
            backToTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (window.pageYOffset <= 300) {
                    backToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    if (!menuToggle || !nav) return;
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

function addScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

addScrollAnimations();
