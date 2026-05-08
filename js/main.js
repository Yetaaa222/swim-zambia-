document.addEventListener('DOMContentLoaded', () => {
    // ─── Navbar ───────────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNavLink();
    });

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.setAttribute('data-lucide', navLinks.classList.contains('active') ? 'x' : 'menu');
        lucide.createIcons();
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.querySelector('i').setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // ─── Active Nav Highlight on Scroll ───────────────────────
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id], header[id]');
        let currentId = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) currentId = sec.id;
        });
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.toggle('active-link', a.getAttribute('href') === `#${currentId}`);
        });
    }

    // ─── Parallax Hero ────────────────────────────────────────
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        if (hero) {
            hero.style.backgroundPositionY = `${window.scrollY * 0.4}px`;
        }
    });

    // ─── Animated Stat Counters ───────────────────────────────
    function animateCounter(el, target, suffix = '') {
        let start = 0;
        const duration = 1800;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const raw = el.dataset.target;
                const suffix = el.dataset.suffix || '';
                animateCounter(el, parseInt(raw), suffix);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => statsObserver.observe(el));

    // ─── Scroll Reveal ────────────────────────────────────────
    const revealEls = document.querySelectorAll('.card, .price-card, .news-card, .safety-content, .safety-image-container, .banner-content');
    revealEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.07}s, transform 0.6s ease ${i * 0.07}s`;
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));

    // ─── News Filter ──────────────────────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            newsCards.forEach(card => {
                const tag = card.dataset.tag;
                const show = filter === 'all' || tag === filter;
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                if (show) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                    card.style.display = '';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => { if (!show) card.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // ─── Testimonials Slider ──────────────────────────────────
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let current = 0;
    let autoPlay;

    function goToSlide(n) {
        if (!slides.length) return;
        slides[current].classList.remove('active');
        dots[current]?.classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current]?.classList.add('active');
    }

    document.getElementById('prev-btn')?.addEventListener('click', () => { goToSlide(current - 1); resetAuto(); });
    document.getElementById('next-btn')?.addEventListener('click', () => { goToSlide(current + 1); resetAuto(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); resetAuto(); }));

    function resetAuto() {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => goToSlide(current + 1), 5000);
    }

    if (slides.length) {
        slides[0].classList.add('active');
        dots[0]?.classList.add('active');
        resetAuto();
    }

    // ─── FAQ Accordion ────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    lucide.createIcons();
});
