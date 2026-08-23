document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Section Navigation (Single Page App logic)
    // ----------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    // Function to show a specific section
    function showSection(sectionId) {
        // Remove active class from all sections and hide them
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Add active class to target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update active state on nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Smooth scroll to top when changing section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Add click events to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only prevent default if it's an internal link
            const target = link.getAttribute('href');
            if (target.startsWith('#')) {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                showSection(sectionId);
                
                // Update URL hash without jumping
                history.pushState(null, null, `#${sectionId}`);
            }
        });
    });

    // Handle initial load based on URL hash
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        if (document.getElementById(sectionId)) {
            showSection(sectionId);
        }
    }

    // ----------------------------------------------------
    // Theme Toggling (Dark/Light Mode)
    // ----------------------------------------------------
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = themeBtn.querySelector('i');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.body.setAttribute('data-theme', 'light');
        themeIcon.classList.replace('ph-sun', 'ph-moon');
    } else {
        document.body.removeAttribute('data-theme'); // default is dark
        themeIcon.classList.replace('ph-moon', 'ph-sun');
    }

    // Toggle theme on button click
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        
        if (currentTheme === 'light') {
            // Switch to Dark
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('ph-moon', 'ph-sun');
        } else {
            // Switch to Light
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('ph-sun', 'ph-moon');
        }
    });
});
