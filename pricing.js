/*
  Tumbakaar Studios - Interactive Pricing Page JS
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- Level 1: Primary Category Tabs ---
    const mainTabBtns = document.querySelectorAll('.pricing-tab-btn');
    const categoryContents = document.querySelectorAll('.pricing-category-content');

    mainTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            mainTabBtns.forEach(b => b.classList.remove('active'));
            categoryContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Find matching category content block
            const category = btn.getAttribute('data-category');
            const targetContent = document.getElementById(`cat-${category}`);
            
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Trigger sub-animations manually for any cards inside the newly active view
                const activeSubContent = targetContent.querySelector('.pricing-sub-content.active');
                if (activeSubContent) {
                    const cards = activeSubContent.querySelectorAll('.pricing-card');
                    cards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    });

    // --- Level 2: Secondary Sub-division Switchers ---
    const subToggleBtns = document.querySelectorAll('.pricing-sub-btn');

    subToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parentToggle = btn.closest('.pricing-sub-toggle');
            const siblingBtns = parentToggle.querySelectorAll('.pricing-sub-btn');
            
            // Remove active state from siblings
            siblingBtns.forEach(b => b.classList.remove('active'));
            
            // Add active state to clicked button
            btn.classList.add('active');

            // Hide all sub-contents in the current active category
            const activeCategory = btn.closest('.pricing-category-content');
            const subContents = activeCategory.querySelectorAll('.pricing-sub-content');
            subContents.forEach(c => c.classList.remove('active'));

            // Show matching sub-division content block
            const subId = btn.getAttribute('data-sub');
            const targetSub = document.getElementById(`sub-${subId}`);
            
            if (targetSub) {
                targetSub.classList.add('active');
                
                // Animate entry of cards
                const cards = targetSub.querySelectorAll('.pricing-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    });

    // Initialize animations for first visible tab on load
    const activeCards = document.querySelectorAll('.pricing-category-content.active .pricing-sub-content.active .pricing-card');
    activeCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // --- Auto-Select Category based on URL Query Parameters ---
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const targetBtn = document.querySelector(`.pricing-tab-btn[data-category="${categoryParam}"]`);
        if (targetBtn) {
            // Instantly click target category button
            targetBtn.click();
        }
    }

    // --- Scroll Animations (Booking Notes / Disclaimer) ---
    const animatedElements = document.querySelectorAll('.scroll-animate');
    if (animatedElements.length > 0) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        animatedElements.forEach(el => scrollObserver.observe(el));
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
