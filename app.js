/* 
  Tumbakaar Studios - Main JS
  Clean, bug-free rewrite
*/

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. NAVBAR SCROLL EFFECT
    // =========================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // =========================================
    // 2. SMOOTH SCROLLING FOR ANCHOR LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // =========================================
    // 3. SCROLL ANIMATIONS
    // (Excludes portfolio items — they are
    //  managed by the filter system above)
    // =========================================
    const animatedElements = document.querySelectorAll(
        '.service-item, .showcase-card, .section-title, .pricing-card, ' +
        '.journey-step, .contact-wrapper, .testimonials-marquee, ' +
        '.teaser-card, .teaser-cta'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(el => scrollObserver.observe(el));

    // =========================================
    // 5. TESTIMONIALS MARQUEE (mouse-speed)
    // =========================================
    const testimonialMarquee = document.querySelector('.testimonials-marquee');
    const testimonialTrack = document.querySelector('.testimonials-track');

    if (testimonialMarquee && testimonialTrack) {
        let isHovered = false;
        let mouseX = window.innerWidth / 2;
        let currentTranslate = 0;
        let speed = -1.2;
        let targetSpeed = -1.2;

        window.addEventListener('mousemove', (e) => { mouseX = e.clientX; }, { passive: true });
        testimonialMarquee.addEventListener('mouseenter', () => { isHovered = true; });
        testimonialMarquee.addEventListener('mouseleave', () => { isHovered = false; targetSpeed = -1.2; });

        function updateMarquee() {
            const halfWidth = testimonialTrack.scrollWidth / 2;
            if (isHovered) {
                const ratio = (mouseX - window.innerWidth / 2) / (window.innerWidth / 2);
                targetSpeed = ratio * 6;
            } else {
                targetSpeed = -1.2;
            }
            speed += (targetSpeed - speed) * 0.1;
            currentTranslate += speed;
            if (currentTranslate <= -halfWidth) currentTranslate += halfWidth;
            else if (currentTranslate >= 0) currentTranslate -= halfWidth;
            testimonialTrack.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(updateMarquee);
        }
        testimonialTrack.style.animation = 'none';
        requestAnimationFrame(updateMarquee);
    }

    // =========================================
    // 4. PORTFOLIO FILTER SYSTEM
    // =========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const loadMoreContainer = document.getElementById('portfolio-load-more-container');
    const btnLoadMore = document.getElementById('btn-load-more');
    let portfolioExpanded = false;

    function applyPortfolioLayout() {
        const activeBtn = document.querySelector('.filter-btn.active');
        const filterValue = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

        if (filterValue === 'all') {
            if (loadMoreContainer) loadMoreContainer.style.display = 'block';

            portfolioItems.forEach((item, index) => {
                if (portfolioExpanded || index < 6) {
                    if (item.style.display === 'none' || item.style.display === '') {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(15px) scale(0.95)';
                        item.style.display = 'block';
                        requestAnimationFrame(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0) scale(1)';
                        });
                    } else {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(15px) scale(0.95)';
                    item.style.display = 'none';
                }
            });

            if (btnLoadMore) {
                btnLoadMore.textContent = portfolioExpanded ? 'SHOW LESS CREATIONS' : 'VIEW ALL CREATIONS';
            }
        } else {
            if (loadMoreContainer) loadMoreContainer.style.display = 'none';

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (category === filterValue) {
                    if (item.style.display === 'none' || item.style.display === '') {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(15px) scale(0.95)';
                        item.style.display = 'block';
                        requestAnimationFrame(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0) scale(1)';
                        });
                    } else {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(15px) scale(0.95)';
                    item.style.display = 'none';
                }
            });
        }
    }

    // Initialize layout
    if (portfolioItems.length > 0) {
        applyPortfolioLayout();
    }

    if (filterBtns.length > 0 && portfolioItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                portfolioExpanded = false;
                applyPortfolioLayout();
            });
        });
    }

    if (btnLoadMore) {
        btnLoadMore.addEventListener('click', () => {
            portfolioExpanded = !portfolioExpanded;
            applyPortfolioLayout();

            // If user collapsed, scroll back up to the top of the portfolio grid to keep focus
            if (!portfolioExpanded) {
                const portfolioSec = document.getElementById('work');
                if (portfolioSec) {
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = portfolioSec.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    }

    // =========================================
    // 6. VIDEO LIGHTBOX MODAL
    // =========================================
    const videoModal = document.getElementById('video-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const modalClose = document.querySelector('.modal-close');
    const modalContent = document.querySelector('.modal-content');

    if (!videoModal || !modalIframe) return;

    function openModal(videoId) {
        // Use standard youtube.com embed with exact required autoplay/mute/loop/controls/playsinline settings
        const origin = window.location.origin || 'http://localhost:8000';
        const embedUrl = 'https://www.youtube.com/embed/' + videoId +
            '?autoplay=1' +
            '&mute=1' +
            '&loop=1' +
            '&playlist=' + videoId +
            '&controls=0' +
            '&playsinline=1' +
            '&rel=0' +
            '&modestbranding=1' +
            '&enablejsapi=1' +
            '&origin=' + origin;
        modalIframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        modalIframe.src = embedUrl;
        videoModal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        videoModal.classList.remove('active');
        modalIframe.src = '';
        document.body.classList.remove('modal-open');
    }

    // Attach click to ALL reel portfolio items
    document.querySelectorAll('.portfolio-item[data-video-id]').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const videoId = item.getAttribute('data-video-id');
            if (videoId) openModal(videoId);
        });
    });

    // Close button
    if (modalClose) {
        modalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }

    // Stop clicks on the video content from closing modal
    if (modalContent) {
        modalContent.addEventListener('click', (e) => e.stopPropagation());
    }

    // Click on backdrop (outside modal-content) closes modal
    videoModal.addEventListener('click', closeModal);

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // =========================================
    // 7. MOBILE MENU TOGGLE
    // =========================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // =========================================
    // 8. CONTACT FORM DYNAMIC PRE-FILLING & DUAL SUBMISSION
    // =========================================
    const contactForm = document.getElementById('contact-form');
    const serviceSelect = document.getElementById('service');
    const packageGroup = document.getElementById('package-group');
    const packageDetailInput = document.getElementById('package-detail');
    const messageTextarea = document.getElementById('message');
    const submitBtn = document.getElementById('form-submit-btn');

    // Parse URL params
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const packageParam = urlParams.get('package');

    if (serviceParam && serviceSelect) {
        serviceSelect.value = serviceParam;
    }

    if (packageParam && packageGroup && packageDetailInput) {
        packageGroup.style.display = 'flex';
        packageDetailInput.value = packageParam;
        
        if (messageTextarea) {
            messageTextarea.value = `I would like to inquire about booking the ${packageParam} package. Let's discuss details!`;
        }
        
        // Scroll to form smoothly after window load/renders
        setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                
                // Focus Name field
                const nameInput = document.getElementById('name');
                if (nameInput) nameInput.focus();
            }
        }, 300);
    }

    // Toggle selected package visibility on manual select change
    if (serviceSelect) {
        serviceSelect.addEventListener('change', () => {
            // If user manually changes dropdown, hide the pre-selected package to avoid confusion
            if (packageGroup) {
                packageGroup.style.display = 'none';
                packageDetailInput.value = '';
            }
        });
    }

    // Handle AJAX dual delivery form submission
    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameVal = document.getElementById('name').value;
            const emailVal = document.getElementById('email').value;
            const serviceVal = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : '';
            const packageVal = packageDetailInput ? packageDetailInput.value : '';
            const messageVal = messageTextarea.value;

            // Change button state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i> Sending Inquiry...';

            // 1. Submit to FormSubmit in background using AJAX
            fetch("https://formsubmit.co/ajax/tumbakaarstudios@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    Name: nameVal,
                    Email: emailVal,
                    Category: serviceVal,
                    "Selected Package": packageVal || "None Selected (Custom Inquire)",
                    Message: messageVal
                })
            })
            .then(response => response.json())
            .then(data => {
                // 2. Redirect to WhatsApp with a beautiful template
                const whatsappBase = "https://wa.me/919304947979";
                const packageLine = packageVal ? `• *Selected Package:* ${packageVal}\n` : '';
                const templateText = `*New Booking Inquiry - Tumbakaar Studios*\n\n` +
                                     `*Client Details:*\n` +
                                     `• *Name:* ${nameVal}\n` +
                                     `• *Email:* ${emailVal}\n\n` +
                                     `*Service Inquired:*\n` +
                                     `• *Category:* ${serviceVal}\n` +
                                     packageLine + `\n` +
                                     `*Brief:*\n` +
                                     `"${messageVal}"`;
                
                const finalUrl = `${whatsappBase}?text=${encodeURIComponent(templateText)}`;

                // Create success message modal or alerts
                alert("Inquiry successfully saved! We are now redirecting you to WhatsApp for instant confirmation.");
                
                // Clear form
                contactForm.reset();
                if (packageGroup) packageGroup.style.display = 'none';

                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Open WhatsApp
                window.open(finalUrl, '_blank');
            })
            .catch(error => {
                console.error("FormSubmit Error:", error);
                alert("Inquiry submitted! Let's instantly direct you to WhatsApp to finalize details with us!");
                
                // Even on error, redirect to WhatsApp so we never lose the lead!
                const whatsappBase = "https://wa.me/919304947979";
                const packageLine = packageVal ? `• *Selected Package:* ${packageVal}\n` : '';
                const templateText = `*New Booking Inquiry - Tumbakaar Studios*\n\n` +
                                     `*Client Details:*\n` +
                                     `• *Name:* ${nameVal}\n` +
                                     `• *Email:* ${emailVal}\n\n` +
                                     `*Service Inquired:*\n` +
                                     `• *Category:* ${serviceVal}\n` +
                                     packageLine + `\n` +
                                     `*Brief:*\n` +
                                     `"${messageVal}"`;
                
                const finalUrl = `${whatsappBase}?text=${encodeURIComponent(templateText)}`;

                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                window.open(finalUrl, '_blank');
            });
        });
    }

    // =========================================
    // 9. COMING SOON TOAST FOR SOCIAL LINKS
    // =========================================
    function showComingSoonToast(event) {
        event.preventDefault();
        
        // Check if toast already exists, otherwise create it
        let toast = document.getElementById('coming-soon-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'coming-soon-toast';
            toast.className = 'toast-notification';
            toast.innerHTML = `<i class="fas fa-info-circle toast-icon"></i> Tumbakaar Studios Social Channels are Coming Soon!`;
            document.body.appendChild(toast);
        }
        
        // Show the toast
        toast.classList.add('show');
        
        // Clear existing timeout if active
        if (window.toastTimeout) {
            clearTimeout(window.toastTimeout);
        }
        
        // Hide after 3 seconds
        window.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Intercept all social links except WhatsApp and Email
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href') || '';
        const ariaLabel = link.getAttribute('aria-label') || '';
        
        // Exclude whatsapp links (wa.me) and email links (mailto:)
        const isWhatsApp = href.includes('wa.me') || href.includes('api.whatsapp.com');
        const isEmail = href.includes('mailto:') || href.includes('tumbakaarstudios@gmail.com');
        
        // Check if it is a social media link (instagram, facebook, youtube, linkedin, or empty social links)
        const isInstagram = href.includes('instagram.com');
        const isFacebook = href.includes('facebook.com');
        const isYouTube = href.includes('youtube.com') && !link.closest('.portfolio-item') && !link.closest('.modal-content'); // Do not block portfolio modal play button triggers
        const isLinkedIn = href.includes('linkedin.com');
        const isPlaceholderSocial = href === '#' && (link.closest('.footer-socials') || ariaLabel.toLowerCase().match(/(instagram|facebook|youtube|linkedin)/));

        if (isInstagram || isFacebook || isYouTube || isLinkedIn || isPlaceholderSocial) {
            link.addEventListener('click', showComingSoonToast);
        }
    });

});
