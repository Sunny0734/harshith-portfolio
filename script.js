document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // Mobile Hamburger Menu Navigation Toggle
    // ----------------------------------------------------
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    const toggleMenu = () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    };

    const closeMenu = () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    };

    hamburger.addEventListener("click", toggleMenu);
    
    // Close mobile menu when a navigation item is clicked
    navLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    const backToTopBtn = document.getElementById("backToTop");

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // ----------------------------------------------------
    // Dark & Light Theme Toggle Logic
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById("theme-toggle");
    const body = document.body;

    // Load initial theme choice from local storage or set default user behavior
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme) {
        body.setAttribute("data-theme", savedTheme);
    } else if (systemPrefersDark) {
        body.setAttribute("data-theme", "dark");
    } else {
        body.setAttribute("data-theme", "light");
    }

    // Toggle logic event listener
    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });

    // Update theme icon on page load
    const updateThemeIcon = () => {
        const currentTheme = body.getAttribute("data-theme");
        const sunIcon = document.querySelector(".icon-sun");
        const moonIcon = document.querySelector(".icon-moon");
        
        if (currentTheme === "dark") {
            if (sunIcon) sunIcon.style.display = "block";
            if (moonIcon) moonIcon.style.display = "none";
        } else {
            if (sunIcon) sunIcon.style.display = "none";
            if (moonIcon) moonIcon.style.display = "block";
        }
    };
    updateThemeIcon();
    themeToggleBtn.addEventListener("click", updateThemeIcon);

    // ----------------------------------------------------
    // Intersection Observer (Scroll Animation)
    // ----------------------------------------------------
    const reveals = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
        const observerOptions = {
            root: null, // default to viewport
            threshold: 0.15, // trigger event when 15% of section is visible
            rootMargin: "0px 0px -50px 0px" // offset bottom bounding box
        };

        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    // Unobserve element once active animation is rendered
                    observerInstance.unobserve(entry.target);
                }
            });
        }, observerOptions);

        reveals.forEach(revealElement => {
            observer.observe(revealElement);
        });
    };

    // Initialize our observer scroll transition logic
    revealOnScroll();

    // ---------------------------------------------------
    // Smooth Scroll Enhancement
    // ---------------------------------------------------
    // Add active state to navigation links on scroll
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let current = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach(item => {
            item.classList.remove("active");
            if (item.getAttribute("href") === `#${current}`) {
                item.classList.add("active");
                item.style.color = "var(--accent-color)";
            } else {
                item.style.color = "";
            }
        });

        if (backToTopBtn) {
            if (window.pageYOffset > 420) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Parallax effect on hero image on mouse move
    const heroImage = document.querySelector(".hero-image");
    if (heroImage) {
        const isDesktopHoverSupported = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        if (isDesktopHoverSupported) {
            document.addEventListener("mousemove", (e) => {
                const rect = heroImage.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const x = (e.clientX - rect.left - rect.width / 2) * 0.05;
                    const y = (e.clientY - rect.top - rect.height / 2) * 0.05;
                    heroImage.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
                }
            });

            // Reset on mouse leave
            heroImage.addEventListener("mouseleave", () => {
                heroImage.style.transform = "scale(1.08)";
            });
        } else {
            // On mobile: no transform, keep it stable
            heroImage.style.transform = "none";
        }
    }

    // Resume download handler - triggers PDF download from Google Docs
    const downloadResumeLink = document.getElementById('downloadResumeLink');
    if (downloadResumeLink) {
        downloadResumeLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Use Google Docs export API to download as PDF
            const docId = '10vkm7USZkGOel05UI43o9VcGPnqhB6p6fg2Z_pmyUPw';
            const pdfUrl = `https://docs.google.com/document/d/${docId}/export?format=pdf`;
            
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'Harshith_Reddy_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});