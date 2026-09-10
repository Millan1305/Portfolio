/* =========================================================
   MILLAN KUMAR — IT INFRASTRUCTURE PORTFOLIO
   Main JavaScript
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       ELEMENT REFERENCES
       ===================================================== */

    const body = document.body;
    const header = document.querySelector(".site-header");

    const menuToggle = document.querySelector(".menu-toggle");
    const navWrapper = document.querySelector(".nav-wrapper");
    const navLinks = document.querySelectorAll(".nav-link");

    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    const revealElements = document.querySelectorAll(".reveal");

    const backToTop = document.querySelector(".back-to-top");

    const contactForm = document.querySelector(".contact-form");

    const loader = document.querySelector(".page-loader");

    const currentYear = document.querySelector("#current-year");


    /* =====================================================
       PAGE LOADER
       ===================================================== */

    function hideLoader() {
        if (!loader) return;

        loader.classList.add("hidden");

        // Remove loader completely after transition
        setTimeout(() => {
            if (loader) {
                loader.style.display = "none";
            }
        }, 700);
    }

    // Hide loader after page resources finish loading
    window.addEventListener("load", hideLoader);

    // Safety fallback
    // Prevents "Initializing portfolio..." from staying forever
    setTimeout(hideLoader, 1800);


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    if (menuToggle && navWrapper) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navWrapper.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            // Prevent background scrolling on mobile
            if (isOpen) {
                body.classList.add("menu-open");
            } else {
                body.classList.remove("menu-open");
            }
        });


        // Close menu when navigation link is clicked
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {

                navWrapper.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                body.classList.remove("menu-open");
            });
        });


        // Close menu with Escape key
        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {

                navWrapper.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                body.classList.remove("menu-open");
            }
        });
    }


    /* =====================================================
       HEADER SCROLL EFFECT
       ===================================================== */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    /* =====================================================
       SMOOTH SCROLLING
       ===================================================== */

    navLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetID = link.getAttribute("href");

            // Only process internal section links
            if (!targetID || !targetID.startsWith("#")) {
                return;
            }

            const target = document.querySelector(targetID);

            if (!target) return;

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            // Update URL without jumping
            history.pushState(null, "", targetID);
        });
    });


    /* =====================================================
       ACTIVE NAVIGATION LINK
       ===================================================== */

    const sections = document.querySelectorAll("main section[id]");

    if (sections.length && navLinks.length) {

        const sectionObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        const currentID = entry.target.getAttribute("id");

                        navLinks.forEach((link) => {

                            const href = link.getAttribute("href");

                            if (href === `#${currentID}`) {
                                link.classList.add("active");
                            } else {
                                link.classList.remove("active");
                            }

                        });
                    }
                });

            },
            {
                root: null,
                rootMargin: "-35% 0px -55% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    /* =====================================================
       PROJECT FILTER
       ===================================================== */

    if (filterButtons.length && projectCards.length) {

        filterButtons.forEach((button) => {

            button.addEventListener("click", () => {

                const selectedFilter =
                    button.getAttribute("data-filter");

                // Active filter button
                filterButtons.forEach((btn) => {
                    btn.classList.remove("active");
                });

                button.classList.add("active");


                // Filter project cards
                projectCards.forEach((card) => {

                    const category =
                        card.getAttribute("data-category");

                    const shouldShow =
                        selectedFilter === "all" ||
                        category === selectedFilter;

                    if (shouldShow) {

                        card.classList.remove("hidden");

                        // Small animation reset
                        card.style.animation = "none";

                        // Force browser reflow
                        void card.offsetWidth;

                        card.style.animation =
                            "fadeInUp 0.45s ease forwards";

                    } else {

                        card.classList.add("hidden");
                    }
                });

            });
        });
    }


    /* =====================================================
       SCROLL REVEAL ANIMATION
       ===================================================== */

    if (revealElements.length) {

        // Respect user's reduced motion preference
        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        if (reducedMotion) {

            revealElements.forEach((element) => {
                element.classList.add("revealed");
            });

        } else {

            const revealObserver = new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("revealed");

                            // Stop observing after revealing
                            observer.unobserve(entry.target);
                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -50px 0px"
                }
            );


            revealElements.forEach((element) => {
                revealObserver.observe(element);
            });
        }
    }


    /* =====================================================
       BACK TO TOP BUTTON
       ===================================================== */

    function updateBackToTop() {

        if (!backToTop) return;

        if (window.scrollY > 500) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();


    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });
    }


    /* =====================================================
       CONTACT FORM VALIDATION
       ===================================================== */

    if (contactForm) {

        const nameInput =
            contactForm.querySelector("#name");

        const emailInput =
            contactForm.querySelector("#email");

        const subjectInput =
            contactForm.querySelector("#subject");

        const messageInput =
            contactForm.querySelector("#message");

        const submitButton =
            contactForm.querySelector(".form-submit");


        function showError(input, message) {

            if (!input) return;

            input.classList.add("invalid");

            const errorElement =
                input.parentElement.querySelector(".form-error");

            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add("show");
            }
        }


        function clearError(input) {

            if (!input) return;

            input.classList.remove("invalid");

            const errorElement =
                input.parentElement.querySelector(".form-error");

            if (errorElement) {
                errorElement.textContent = "";
                errorElement.classList.remove("show");
            }
        }


        function validateEmail(email) {

            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }


        function validateField(input, fieldName) {

            if (!input) return true;

            const value = input.value.trim();

            clearError(input);


            if (!value) {

                showError(
                    input,
                    `${fieldName} is required.`
                );

                return false;
            }


            if (
                input.id === "email" &&
                !validateEmail(value)
            ) {

                showError(
                    input,
                    "Please enter a valid email address."
                );

                return false;
            }


            if (
                input.id === "message" &&
                value.length < 10
            ) {

                showError(
                    input,
                    "Message should contain at least 10 characters."
                );

                return false;
            }


            return true;
        }


        // Real-time validation
        [
            nameInput,
            emailInput,
            subjectInput,
            messageInput
        ].forEach((input) => {

            if (!input) return;

            input.addEventListener("blur", () => {

                let fieldName = "Field";

                if (input.id === "name") {
                    fieldName = "Name";
                }

                if (input.id === "email") {
                    fieldName = "Email";
                }

                if (input.id === "subject") {
                    fieldName = "Subject";
                }

                if (input.id === "message") {
                    fieldName = "Message";
                }

                validateField(input, fieldName);
            });


            input.addEventListener("input", () => {
                clearError(input);
            });
        });


        contactForm.addEventListener("submit", (event) => {

            event.preventDefault();


            const nameValid =
                validateField(nameInput, "Name");

            const emailValid =
                validateField(emailInput, "Email");

            const subjectValid =
                validateField(subjectInput, "Subject");

            const messageValid =
                validateField(messageInput, "Message");


            if (
                !nameValid ||
                !emailValid ||
                !subjectValid ||
                !messageValid
            ) {

                const firstInvalid =
                    contactForm.querySelector(".invalid");

                if (firstInvalid) {
                    firstInvalid.focus();
                }

                return;
            }


            /*
             * This portfolio currently has no backend.
             *
             * Therefore we do not pretend that the message
             * has actually been sent to an email server.
             */

            let successMessage =
                contactForm.querySelector(".form-success");


            if (!successMessage) {

                successMessage =
                    document.createElement("div");

                successMessage.className =
                    "form-success";

                contactForm.appendChild(
                    successMessage
                );
            }


            successMessage.textContent =
                "Message validated successfully. Connect this form to your backend or email service to receive messages.";


            successMessage.style.display = "block";


            // Reset form after successful validation
            contactForm.reset();


            // Remove success message after 6 seconds
            setTimeout(() => {

                if (successMessage) {
                    successMessage.style.display = "none";
                }

            }, 6000);
        });
    }


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       EXTERNAL LINKS
       ===================================================== */

    const externalLinks =
        document.querySelectorAll(
            'a[href^="http://"], a[href^="https://"]'
        );

    externalLinks.forEach((link) => {

        // Don't modify links that already specify a target
        if (!link.hasAttribute("target")) {

            link.setAttribute(
                "target",
                "_blank"
            );
        }


        // Security best practice
        const existingRel =
            link.getAttribute("rel") || "";

        if (!existingRel.includes("noopener")) {

            link.setAttribute(
                "rel",
                `${existingRel} noopener noreferrer`.trim()
            );
        }
    });


    /* =====================================================
       KEYBOARD ACCESSIBILITY
       ===================================================== */

    document.addEventListener("keydown", (event) => {

        // Close mobile navigation with Escape
        if (
            event.key === "Escape" &&
            navWrapper &&
            navWrapper.classList.contains("open")
        ) {

            navWrapper.classList.remove("open");

            if (menuToggle) {
                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

            body.classList.remove("menu-open");
        }
    });


    /* =====================================================
       RESIZE HANDLER
       ===================================================== */

    window.addEventListener("resize", () => {

        // Close mobile menu when switching to desktop
        if (
            window.innerWidth >= 1024 &&
            navWrapper
        ) {

            navWrapper.classList.remove("open");

            body.classList.remove("menu-open");

            if (menuToggle) {

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }
    });


    /* =====================================================
       INITIALIZATION COMPLETE
       ===================================================== */

    console.log(
        "%cPortfolio initialized successfully.",
        "font-weight: bold;"
    );

});