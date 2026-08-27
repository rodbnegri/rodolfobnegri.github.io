/**
 * ============================================================
 * FILE: assets/js/main.js
 * ============================================================
 *
 * WHAT IS JAVASCRIPT?
 * JavaScript (JS) is the BEHAVIOR layer of a webpage.
 * - HTML  = structure (what exists on the page)
 * - CSS   = style     (how it looks)
 * - JS    = behavior  (what happens when you interact with it)
 *
 * JavaScript runs IN THE BROWSER — no server needed.
 * When the browser loads a page, it reads and EXECUTES this file.
 *
 * KEY JAVASCRIPT CONCEPTS USED HERE:
 *
 * 1. VARIABLES (const / let)
 *    Store a value with a name so you can use it later.
 *    const = value cannot be reassigned (use for most things)
 *    let   = value can change (use in loops or when reassigning)
 *    Example: const name = "Rodolfo";
 *
 * 2. FUNCTIONS
 *    Reusable blocks of code. Define once, call many times.
 *    function sayHello() { console.log("Hello!"); }
 *    Arrow function:  const sayHello = () => { ... }
 *
 * 3. document.querySelector()
 *    Finds ONE HTML element matching a CSS selector.
 *    document.querySelector('.nav-link')  → first .nav-link
 *    document.getElementById('theme-btn') → element with id="theme-btn"
 *
 * 4. document.querySelectorAll()
 *    Finds ALL matching elements and returns a NodeList (like an array).
 *
 * 5. addEventListener(event, callback)
 *    Runs code when something happens (a "event") on an element.
 *    Events: 'click', 'mouseover', 'keydown', 'resize', etc.
 *    Example: btn.addEventListener('click', () => { alert('clicked!'); });
 *
 * 6. classList.add / remove / toggle / contains
 *    Manage the CSS classes on an element (this is how JS controls CSS).
 *    element.classList.add('active')      → adds "active" class
 *    element.classList.remove('active')   → removes "active" class
 *    element.classList.toggle('open')     → adds if missing, removes if present
 *    element.classList.contains('active') → returns true/false
 *
 * 7. CANVAS API
 *    <canvas> is an HTML element that JS can draw on pixel by pixel.
 *    Used here to draw the animated star background.
 *
 * 8. requestAnimationFrame(callback)
 *    Tells the browser: "run this function before the next screen repaint."
 *    Creates smooth 60fps animations by calling a function ~60 times/second.
 *
 * WHAT THIS FILE DOES (5 main features):
 * 1. Single-Page Navigation (show/hide sections without page reload)
 * 2. Publication Filter Tabs (filter papers by category)
 * 3. BibTeX Drawer & Copy to Clipboard
 * 4. Dark / Light Theme Toggle (with localStorage memory)
 * 5. Animated Star Canvas Background
 * ============================================================
 */


/**
 * DOMContentLoaded Event
 * ─────────────────────
 * This wraps ALL our code. It waits until the browser has fully
 * parsed the HTML before running any JavaScript.
 *
 * WHY? If JS runs before the HTML is parsed, elements like
 * document.querySelector('.nav-link') would return null because
 * those elements don't exist yet. This event prevents that error.
 *
 * "DOMContentLoaded" fires when the DOM (Document Object Model —
 * the browser's in-memory representation of the HTML) is ready.
 * This is earlier than the "load" event, which waits for images too.
 */
document.addEventListener('DOMContentLoaded', () => {

    // ══════════════════════════════════════════════════════════════════════
    // SECTION 1: SINGLE PAGE APPLICATION (SPA) NAVIGATION
    // ══════════════════════════════════════════════════════════════════════
    /**
     * This website is a "Single Page Application":
     * - There is only ONE HTML file (index.html)
     * - All "pages" are actually <section> elements
     * - Only ONE section is visible at a time (class="active")
     * - Clicking a nav link shows one section and hides the rest
     * - The URL in the browser bar is updated (e.g., /#publications)
     *   so links still work and the back button behaves correctly
     *
     * WHY? No page reload = faster, smoother experience.
     */

    // Grab all nav links (.nav-link elements in the sidebar)
    const navLinks = document.querySelectorAll('.nav-link');
    // Grab all page sections (.content-section elements in main)
    const sections = document.querySelectorAll('.content-section');
    // Grab the sidebar element (we need it to close on mobile)
    const sidebar = document.querySelector('.sidebar');
    // Grab the mobile hamburger button
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

    /**
     * showSection(sectionId)
     * ─────────────────────
     * Makes the section with id=sectionId visible, hides all others,
     * and highlights the matching nav link as "active".
     *
     * @param {string} sectionId - The id attribute of the section to show
     *                             (e.g., "home", "about", "publications")
     */
    function showSection(sectionId) {
        // Step 1: Remove "active" from ALL sections (hide all)
        // .forEach() iterates over every item in a NodeList or Array
        sections.forEach(section => {
            section.classList.remove('active');
            // In CSS: .content-section { display: none; opacity: 0; }
            // Removing "active" hides this section
        });

        // Step 2: Add "active" to the TARGET section (show it)
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            // The "if" guard prevents errors if sectionId doesn't match any element
            targetSection.classList.add('active');
            // In CSS: .content-section.active { display: block; opacity: 1; }
        }

        // Step 3: Update the nav links (highlight the active one)
        navLinks.forEach(link => {
            link.classList.remove('active');  // Clear all first
            // getAttribute() reads an HTML attribute value
            // data-section="home" → link.getAttribute('data-section') returns "home"
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');  // Highlight the matching link
            }
        });

        // Step 4: Scroll the main area back to the top
        // { top: 0, behavior: 'smooth' } = smoothly scroll to y=0
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Step 5: Close mobile sidebar if it was open
        // On desktop, this condition is never true (sidebar doesn't have "open")
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    }

    /**
     * Click listeners for sidebar navigation links
     * ─────────────────────────────────────────────
     * When a nav link is clicked:
     * 1. Prevent the default browser behavior (which would reload the page)
     * 2. Show the corresponding section
     * 3. Update the URL hash (e.g., change URL to /#publications)
     */
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // getAttribute reads the HTML attribute value:
            // <a href="#publications"> → link.getAttribute('href') = "#publications"
            const href = link.getAttribute('href');

            // Only intercept internal links (starting with #)
            // External links (http://...) should navigate normally
            if (href && href.startsWith('#')) {
                e.preventDefault();  // Don't let the browser follow the href normally

                // Read which section to show from data-section attribute
                // <a data-section="publications"> → "publications"
                const sectionId = link.getAttribute('data-section');
                showSection(sectionId);

                // Update the browser URL bar to reflect the new "page"
                // history.pushState(state, title, url) adds a history entry
                // without reloading the page. This makes the back button work.
                history.pushState(null, null, `#${sectionId}`);
                // Template literal: `#${sectionId}` = "#publications" etc.
                // Backticks ` ` = template literals. ${} = interpolation.
            }
        });
    });

    /**
     * Internal page links (CTA buttons with data-jump attribute)
     * ────────────────────────────────────────────────────────────
     * These are the "Explore Publications" / "Satellite Fleet" buttons
     * in the hero section. They have data-jump="publications" instead
     * of data-section, so they need their own handler.
     * <a href="#publications" data-jump="publications">
     */
    document.querySelectorAll('a[data-jump]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSec = btn.getAttribute('data-jump');
            showSection(targetSec);
            history.pushState(null, null, `#${targetSec}`);
        });
    });

    /**
     * Handle URL hash on page load
     * ─────────────────────────────
     * If someone visits https://rodolfobnegri.github.io/#publications,
     * we should jump directly to the publications section.
     *
     * window.location.hash = the "#..." part of the current URL.
     * .substring(1) removes the leading "#" → "publications"
     */
    if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        // Only navigate if the section actually exists on the page
        if (document.getElementById(hashId)) {
            showSection(hashId);
        }
    }

    /**
     * Mobile hamburger menu toggle
     * ─────────────────────────────
     * On mobile, clicking the ☰ button slides the sidebar in/out.
     * CSS controls the animation:
     *   .sidebar          { transform: translateX(-100%); }  ← hidden off-screen
     *   .sidebar.open     { transform: translateX(0); }       ← visible
     */
    if (mobileNavToggle && sidebar) {
        mobileNavToggle.addEventListener('click', () => {
            // toggle() adds "open" if missing, removes it if present
            sidebar.classList.toggle('open');
        });
    }

    /**
     * Close sidebar when clicking outside of it on mobile
     * ─────────────────────────────────────────────────────
     * The 'click' event on 'document' fires for ANY click anywhere.
     * We check: are we on mobile? Is the sidebar open? Was the click
     * outside the sidebar and outside the toggle button?
     * If all yes → close the sidebar.
     */
    document.addEventListener('click', (e) => {
        // window.innerWidth = current browser window width in pixels
        // Only relevant on mobile (1024px or less)
        if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains('open')) {
            // .contains(node) = true if the element has the clicked node as a descendant
            // We DON'T close if the click was INSIDE the sidebar or ON the toggle button
            if (!sidebar.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });


    // ══════════════════════════════════════════════════════════════════════
    // SECTION 2: PUBLICATION FILTER TABS
    // ══════════════════════════════════════════════════════════════════════
    /**
     * The filter buttons (All Works / Journals / Conference / History)
     * show or hide publication cards based on their data-category attribute.
     *
     * HTML structure:
     *   <button class="filter-btn" data-filter="journal">Journals</button>
     *   <article class="pub-card" data-category="journal">...</article>
     *
     * Logic:
     *   - Click a filter button
     *   - Read its data-filter value (e.g., "journal")
     *   - Show pub-cards whose data-category matches
     *   - Hide all others
     */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pubCards = document.querySelectorAll('.pub-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Step 1: Remove "active" highlight from ALL filter buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Step 2: Add "active" to the clicked button
            btn.classList.add('active');

            // Step 3: Read which filter was selected
            const filter = btn.getAttribute('data-filter');

            // Step 4: Loop through all pub-cards and show/hide them
            pubCards.forEach(card => {
                const category = card.getAttribute('data-category');

                // Show the card if:
                // - filter is "all" (show everything)
                // - card's category matches the filter (e.g., both are "journal")
                // - filter is "history" AND the card has data-featured="history"
                //   (some history papers are also journals, so we check a separate attribute)
                if (
                    filter === 'all' ||
                    category === filter ||
                    (filter === 'history' && card.getAttribute('data-featured') === 'history')
                ) {
                    card.style.display = 'flex';  // Show: flex because pub-card uses display:flex
                } else {
                    card.style.display = 'none';  // Hide
                }
                // Note: .style.display = 'none/flex' applies INLINE CSS directly.
                // This overrides the CSS file's .pub-card { display: flex; } rule.
            });
        });
    });


    // ══════════════════════════════════════════════════════════════════════
    // SECTION 3: BIBTEX DRAWER & COPY TO CLIPBOARD
    // ══════════════════════════════════════════════════════════════════════
    /**
     * BibTeX is a citation format used in academic writing (LaTeX).
     * Each paper has a "BibTeX" button that shows/hides a drawer
     * with the citation code, and a "Copy" button to copy it.
     *
     * HTML:
     *   <button class="bibtex-btn" data-target="bib-1">BibTeX</button>
     *   <div id="bib-1" class="bibtex-box">
     *     <button class="copy-bibtex-btn" data-code-target="code-1">Copy</button>
     *     <pre id="code-1">@article{...}</pre>
     *   </div>
     */

    // Find the toast notification element (shown when citation is copied)
    const toastNotice = document.getElementById('toast-notice');

    /**
     * showToast(message)
     * ───────────────────
     * Briefly shows a small notification popup at the bottom-right.
     * Adds "show" class → CSS animates it visible.
     * After 2.5 seconds → removes "show" class → CSS animates it invisible.
     *
     * @param {string} message - Text to display in the toast
     */
    function showToast(message) {
        if (!toastNotice) return;  // Safety check — do nothing if element not found
        toastNotice.textContent = message;  // Set the text content
        toastNotice.classList.add('show');  // Trigger CSS animation (slide up + fade in)

        // setTimeout(callback, ms) = run callback after ms milliseconds
        setTimeout(() => {
            toastNotice.classList.remove('show');  // Fade out after 2.5 seconds
        }, 2500);
    }

    /**
     * BibTeX button click → toggle the bibtex-box drawer open/closed
     * Each .bibtex-btn has a data-target attribute pointing to the drawer's ID.
     */
    document.querySelectorAll('.bibtex-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');  // e.g., "bib-1"
            const bibBox = document.getElementById(targetId);  // Find #bib-1
            if (bibBox) {
                // toggle: if "open" missing → add it (show drawer)
                //         if "open" present → remove it (hide drawer)
                bibBox.classList.toggle('open');
                // In CSS: .bibtex-box { display: none; }
                //         .bibtex-box.open { display: block; animation: fadeIn; }
            }
        });
    });

    /**
     * Copy button click → copy BibTeX code to clipboard
     * Each .copy-bibtex-btn has a data-code-target pointing to a <pre> element's ID.
     * We read its text content and use the browser's Clipboard API to copy it.
     */
    document.querySelectorAll('.copy-bibtex-btn').forEach(copyBtn => {
        copyBtn.addEventListener('click', () => {
            const targetId = copyBtn.getAttribute('data-code-target');  // e.g., "code-1"
            const codeEl = document.getElementById(targetId);           // Find #code-1 (<pre>)

            if (codeEl) {
                // navigator.clipboard.writeText() is an async browser API.
                // It returns a "Promise" — an object representing a future value.
                // .then(callback) runs callback IF the copy succeeds.
                // .catch(callback) runs callback IF the copy fails (e.g., permission denied).
                navigator.clipboard.writeText(codeEl.textContent.trim()).then(() => {
                    showToast('BibTeX citation copied to clipboard!');
                }).catch(() => {
                    showToast('Failed to copy citation.');
                });
                // .trim() removes leading/trailing whitespace from the copied text
            }
        });
    });


    // ══════════════════════════════════════════════════════════════════════
    // SECTION 4: DARK / LIGHT THEME TOGGLE
    // ══════════════════════════════════════════════════════════════════════
    /**
     * The theme toggle button switches between dark and light mode.
     *
     * HOW IT WORKS:
     * - Dark mode (default): <body> has NO data-theme attribute
     *   CSS uses :root variables (dark backgrounds, light text)
     * - Light mode: <body data-theme="light">
     *   CSS [data-theme="light"] overrides the variables with light colors
     *
     * The user's preference is saved to localStorage so it persists
     * between page visits. localStorage is a browser key-value store
     * that survives page reloads.
     *
     * LOGIC:
     * 1. On load: check localStorage → apply saved theme
     * 2. If no saved theme: check OS preference (prefers-color-scheme)
     * 3. On button click: toggle between dark and light
     */

    const themeBtn = document.getElementById('theme-btn');
    // Optional chaining: themeBtn?.querySelector() = only run if themeBtn exists
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    const themeText = themeBtn ? themeBtn.querySelector('.theme-text') : null;

    // localStorage.getItem('theme') returns "light", "dark", or null (never saved before)
    const savedTheme = localStorage.getItem('theme');

    // Check OS-level dark mode preference (set in OS settings)
    // window.matchMedia returns a MediaQueryList object; .matches = boolean
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    /**
     * applyTheme(theme)
     * ──────────────────
     * Applies the given theme to the page by:
     * 1. Setting/removing the data-theme attribute on <body>
     * 2. Updating the button icon (sun ↔ moon)
     * 3. Updating the button label text ("Light Mode" ↔ "Dark Mode")
     * 4. Saving the preference to localStorage
     *
     * @param {string} theme - "light" or "dark"
     */
    function applyTheme(theme) {
        if (theme === 'light') {
            // Add data-theme="light" to body → CSS [data-theme="light"] activates
            document.body.setAttribute('data-theme', 'light');
            if (themeIcon) {
                // Switch icon to moon (you're in light mode, click to go dark)
                themeIcon.className = 'ph ph-moon';
            }
            if (themeText) {
                themeText.textContent = 'Dark Mode';  // Button now offers: "switch to Dark"
            }
            // Save to browser storage so preference persists after page refresh
            localStorage.setItem('theme', 'light');
        } else {
            // Remove data-theme attribute → default (dark) CSS variables activate
            document.body.removeAttribute('data-theme');
            if (themeIcon) {
                // Switch icon to sun (you're in dark mode, click to go light)
                themeIcon.className = 'ph ph-sun';
            }
            if (themeText) {
                themeText.textContent = 'Light Mode';  // Button now offers: "switch to Light"
            }
            localStorage.setItem('theme', 'dark');
        }
    }

    // Apply theme on page load:
    // Use light theme if:
    //   - User previously chose light (savedTheme === 'light'), OR
    //   - No saved preference AND the OS is NOT in dark mode
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        applyTheme('light');
    } else {
        applyTheme('dark');  // Default: dark theme
    }

    // Click listener: toggle theme when the button is clicked
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            // Read the CURRENT theme from the body attribute
            const currentTheme = document.body.getAttribute('data-theme');
            // Switch to the opposite theme
            if (currentTheme === 'light') {
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
        });
    }


    // ══════════════════════════════════════════════════════════════════════
    // SECTION 5: ANIMATED STARFIELD CANVAS
    // ══════════════════════════════════════════════════════════════════════
    /**
     * A canvas animation that draws floating particle stars in the background.
     * Stars slowly drift upward. When a star reaches the top, it reappears
     * at the bottom at a random horizontal position.
     *
     * CANVAS API BASICS:
     * const canvas = document.getElementById('space-canvas');
     * const ctx = canvas.getContext('2d'); → ctx is your "pen/brush"
     *
     * ctx.clearRect(x, y, width, height) → erase a rectangle
     * ctx.beginPath() → start a new shape
     * ctx.arc(x, y, radius, startAngle, endAngle) → draw a circle
     * ctx.fillStyle = 'rgba(r,g,b,a)' → set fill color
     * ctx.fill() → fill the current shape
     *
     * ANIMATION LOOP:
     * requestAnimationFrame(animateCanvas) schedules the next frame.
     * Each frame: clear → update positions → draw → schedule next frame.
     * This creates ~60 frames per second = smooth animation.
     */

    const canvas = document.getElementById('space-canvas');
    if (canvas) {
        // Get the 2D drawing context — this object has all drawing methods
        const ctx = canvas.getContext('2d');

        // Set canvas size to match the browser window
        // These MUST be set on the canvas element itself (not via CSS)
        // because CSS scales the canvas, canvas attributes define resolution
        let width  = canvas.width  = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Configuration: how many stars to draw
        const numStars = 65;

        // Array to store all star objects. Each star has:
        // x, y = position on canvas (in pixels)
        // radius = size of the star (random: 0.5 to 2px)
        // alpha = opacity (random: 0.2 to 1.0)
        // speed = how fast it drifts upward (random: 0.05 to 0.2)
        const stars = [];

        // Create all stars with random initial positions and properties
        for (let i = 0; i < numStars; i++) {
            // Math.random() returns a random decimal between 0 and 1
            // Math.random() * width = random position across full width
            stars.push({
                x:      Math.random() * width,
                y:      Math.random() * height,
                radius: Math.random() * 1.5 + 0.5,  // 0.5 to 2.0 px
                alpha:  Math.random() * 0.8 + 0.2,  // 0.2 to 1.0 (opacity)
                speed:  Math.random() * 0.15 + 0.05 // 0.05 to 0.2 px/frame
            });
        }

        // When the window is resized, update the canvas resolution
        // This prevents stars from being drawn on a "clipped" canvas
        window.addEventListener('resize', () => {
            width  = canvas.width  = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        /**
         * animateCanvas()
         * ────────────────
         * The animation loop. Called ~60 times per second.
         * Each call:
         *   1. Clear the entire canvas
         *   2. Update each star's position
         *   3. Draw each star
         *   4. Schedule the next frame
         */
        function animateCanvas() {
            // 1. Erase everything drawn in the previous frame
            // clearRect(x, y, width, height) — erase a rectangle area
            ctx.clearRect(0, 0, width, height);

            // Determine star color based on current theme:
            // In dark mode:  amber/gold dots
            // In light mode: dark navy dots (very faint due to low opacity in CSS)
            const isLight = document.body.getAttribute('data-theme') === 'light';
            const starColor = isLight ? '0, 42, 98' : '223, 134, 0';
            // These are RGB values (red, green, blue) as strings for use in rgba()

            // 2 & 3. Update each star and draw it
            stars.forEach(star => {
                // Move the star upward by its speed value
                star.y -= star.speed;

                // If the star has drifted above the top of the screen,
                // reset it to the bottom at a new random x position
                if (star.y < 0) {
                    star.y = height;                      // Back to the bottom
                    star.x = Math.random() * width;       // Random horizontal position
                }

                // Draw the star as a filled circle
                ctx.beginPath();
                // arc(centerX, centerY, radius, startAngle, endAngle)
                // Math.PI * 2 = full circle (360 degrees in radians)
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                // Set fill color using the star's individual alpha (opacity)
                ctx.fillStyle = `rgba(${starColor}, ${star.alpha})`;
                ctx.fill();  // Fill the circle with the color
            });

            // 4. Schedule the next frame
            // requestAnimationFrame(fn) tells the browser to call fn before the
            // next screen repaint. This syncs with the monitor's refresh rate.
            requestAnimationFrame(animateCanvas);
        }

        // Start the animation loop
        animateCanvas();
    }

}); // END of DOMContentLoaded
