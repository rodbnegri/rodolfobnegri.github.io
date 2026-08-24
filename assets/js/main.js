/**
 * Rodolfo Batista Negri - Personal Website Scripts
 * Single Page App Navigation, Publication Filters, BibTeX Copy, Theme Toggling, Space Canvas
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Single Page Application (SPA) Section Routing
    // ==========================================================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const sidebar = document.querySelector('.sidebar');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Close mobile drawer if open
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                showSection(sectionId);
                history.pushState(null, null, `#${sectionId}`);
            }
        });
    });

    // Handle internal page links (e.g. CTA buttons)
    document.querySelectorAll('a[data-jump]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSec = btn.getAttribute('data-jump');
            showSection(targetSec);
            history.pushState(null, null, `#${targetSec}`);
        });
    });

    // Initial load hash handler
    if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        if (document.getElementById(hashId)) {
            showSection(hashId);
        }
    }

    // Mobile menu toggle
    if (mobileNavToggle && sidebar) {
        mobileNavToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar on outside click on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    // ==========================================================================
    // 2. Publication Filter Tabs
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pubCards = document.querySelectorAll('.pub-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            pubCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter || (filter === 'history' && card.getAttribute('data-featured') === 'history')) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================================================
    // 3. BibTeX Drawer & Copy to Clipboard
    // ==========================================================================
    const toastNotice = document.getElementById('toast-notice');

    function showToast(message) {
        if (!toastNotice) return;
        toastNotice.textContent = message;
        toastNotice.classList.add('show');
        setTimeout(() => {
            toastNotice.classList.remove('show');
        }, 2500);
    }

    document.querySelectorAll('.bibtex-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const bibBox = document.getElementById(targetId);
            if (bibBox) {
                bibBox.classList.toggle('open');
            }
        });
    });

    document.querySelectorAll('.copy-bibtex-btn').forEach(copyBtn => {
        copyBtn.addEventListener('click', () => {
            const targetId = copyBtn.getAttribute('data-code-target');
            const codeEl = document.getElementById(targetId);
            if (codeEl) {
                navigator.clipboard.writeText(codeEl.textContent.trim()).then(() => {
                    showToast('BibTeX citation copied to clipboard!');
                }).catch(() => {
                    showToast('Failed to copy citation.');
                });
            }
        });
    });

    // ==========================================================================
    // 4. Dark / Light Theme Toggle
    // ==========================================================================
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    const themeText = themeBtn ? themeBtn.querySelector('.theme-text') : null;

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.setAttribute('data-theme', 'light');
            if (themeIcon) {
                themeIcon.className = 'ph ph-moon';
            }
            if (themeText) {
                themeText.textContent = 'Dark Mode';
            }
            localStorage.setItem('theme', 'light');
        } else {
            document.body.removeAttribute('data-theme');
            if (themeIcon) {
                themeIcon.className = 'ph ph-sun';
            }
            if (themeText) {
                themeText.textContent = 'Light Mode';
            }
            localStorage.setItem('theme', 'dark');
        }
    }

    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        applyTheme('light');
    } else {
        applyTheme('dark');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            if (currentTheme === 'light') {
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
        });
    }

    // ==========================================================================
    // 5. Lightweight Space Canvas Particle Animation
    // ==========================================================================
    const canvas = document.getElementById('space-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const numStars = 65;
        const stars = [];

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.15 + 0.05
            });
        }

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            const isLight = document.body.getAttribute('data-theme') === 'light';
            const starColor = isLight ? '0, 42, 98' : '223, 134, 0';

            stars.forEach(star => {
                star.y -= star.speed;
                if (star.y < 0) {
                    star.y = height;
                    star.x = Math.random() * width;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${starColor}, ${star.alpha})`;
                ctx.fill();
            });

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }
});
