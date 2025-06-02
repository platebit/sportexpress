       
        function createParticles() {
            const container = document.getElementById('particles');
            const particleCount = 10; 
            
            
            const fragment = document.createDocumentFragment();
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                const size = Math.random() * 150 + 50;
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                const delay = Math.random() * 5;
                const duration = Math.random() * 10 + 10;
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                particle.style.animationDelay = `${delay}s`;
                particle.style.animationDuration = `${duration}s`;
                
                fragment.appendChild(particle);
            }
            
            container.appendChild(fragment);
        }
              
        function setupSlider() {
            const heroSlider = document.querySelector('.hero-slider');
            const slides = heroSlider.querySelectorAll('.slides-container .slide');
            const dotsContainer = heroSlider.querySelector('.slider-dots');
            const prevArrow = heroSlider.querySelector('.arrow.prev');
            const nextArrow = heroSlider.querySelector('.arrow.next');
            let currentSlide = 0;
            let sliderInterval;
            let isAnimating = false;
            let isInitialized = false;

            function initializeSlider() {
                if (isInitialized) return;
                
                // Create dots
                if (dotsContainer) {
                    dotsContainer.innerHTML = ''; // Clear existing dots
                    // Create dots only for visible slides
                    slides.forEach((slide, index) => {
                        const dot = document.createElement('button');
                        dot.classList.add('dot');
                        if (index === 0) dot.classList.add('active');
                        dot.addEventListener('click', () => goToSlide(index));
                        dotsContainer.appendChild(dot);
                    });
                }

                // Reset slides
                slides.forEach((slide, index) => {
                    slide.classList.remove('active');
                    if (index === 0) slide.classList.add('active');
                });

                isInitialized = true;
            }

            function goToSlide(index) {
                if (isAnimating) return;
                isAnimating = true;

                slides[currentSlide].classList.remove('active');
                const dots = dotsContainer.querySelectorAll('button');
                if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
                
                currentSlide = index;
                
                slides[currentSlide].classList.add('active');
                if (dots[currentSlide]) dots[currentSlide].classList.add('active');

                setTimeout(() => {
                    isAnimating = false;
                }, 500);
            }

            function nextSlide() {
                if (isAnimating) return;
                goToSlide((currentSlide + 1) % slides.length);
            }

            function prevSlide() {
                if (isAnimating) return;
                goToSlide((currentSlide - 1 + slides.length) % slides.length);
            }

            function startSlider() {
                if (!isInitialized) {
                    initializeSlider();
                }
                
                if (sliderInterval) clearInterval(sliderInterval);
                sliderInterval = setInterval(() => {
                    if (!document.hidden && !isAnimating) {
                        nextSlide();
                    }
                }, 7000);
            }

            function stopSlider() {
                if (sliderInterval) {
                    clearInterval(sliderInterval);
                    sliderInterval = null;
                }
            }

            // Event listeners with debounce
            let clickTimeout;
            if (nextArrow) {
                nextArrow.addEventListener('click', () => {
                    if (clickTimeout) return;
                    clickTimeout = setTimeout(() => {
                        nextSlide();
                        clickTimeout = null;
                    }, 300);
                });
            }

            if (prevArrow) {
                prevArrow.addEventListener('click', () => {
                    if (clickTimeout) return;
                    clickTimeout = setTimeout(() => {
                        prevSlide();
                        clickTimeout = null;
                    }, 300);
                });
            }

            // Initialize immediately
            initializeSlider();
            startSlider();

            // Add cleanup on page unload
            window.addEventListener('beforeunload', stopSlider);

            // Handle navigation links
            const navLinks = document.querySelectorAll('.vertical-nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const targetId = link.getAttribute('href').substring(1);
                    if (targetId === 'hero') {
                        setTimeout(() => {
                            initializeSlider();
                            startSlider();
                        }, 100);
                    } else {
                        stopSlider();
                    }
                });
            });

            // Handle visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopSlider();
                } else {
                    startSlider();
                }
            });

            // Handle scroll on mobile with throttling
            let scrollTimeout;
            if (window.innerWidth <= 992) {
                window.addEventListener('scroll', () => {
                    if (scrollTimeout) return;
                    
                    scrollTimeout = setTimeout(() => {
                        const heroSection = document.getElementById('hero');
                        if (!heroSection) return;
                        
                        const rect = heroSection.getBoundingClientRect();
                        const isVisible = (rect.top >= 0 && rect.bottom <= window.innerHeight);
                        
                        if (isVisible) {
                            initializeSlider();
                            startSlider();
                        } else {
                            stopSlider();
                        }
                        
                        scrollTimeout = null;
                    }, 100);
                }, { passive: true });
            }

            // Cleanup function
            return () => {
                stopSlider();
                if (nextArrow) nextArrow.removeEventListener('click', nextSlide);
                if (prevArrow) prevArrow.removeEventListener('click', prevSlide);
            };
        }
              
        function setupScrollEffect() {
            const header = document.getElementById('header');
            let lastScrollTop = 0;
            
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                lastScrollTop = scrollTop;
            });
        }
              
        function setupSectionSwitching() {
            const verticalNavLinks = document.querySelectorAll('.vertical-nav a');
            const headerNavLinks = document.querySelectorAll('nav ul li a');
            const sections = document.querySelectorAll('section, .hero-slider');
            let currentSectionIndex = 0;
            const sectionsArray = Array.from(sections);
            let isAnimating = false;
            let isMobile = window.innerWidth <= 992;

            // Initialize first section and slider
            sectionsArray.forEach(section => section.classList.remove('active'));
            sectionsArray[0].classList.add('active');
            verticalNavLinks.forEach(link => link.classList.remove('active'));
            headerNavLinks.forEach(link => link.classList.remove('active'));
            if (verticalNavLinks[0]) verticalNavLinks[0].classList.add('active');
            if (headerNavLinks[0]) headerNavLinks[0].classList.add('active');

            function activateSection(sectionId) {
                if (isAnimating) return;

                const targetIndex = sectionsArray.findIndex(section => section.id === sectionId);
                if (targetIndex === -1 || targetIndex === currentSectionIndex) return;

                currentSectionIndex = targetIndex;
                updateActiveNav();

                isAnimating = true;

                const currentSection = sectionsArray.find(section => section.classList.contains('active'));
                const newSection = sectionsArray[targetIndex];

                if (currentSection) currentSection.classList.remove('active');

                if (isMobile) {
                    const targetSection = document.getElementById(sectionId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 60,
                            behavior: 'smooth'
                        });
                        setTimeout(() => {
                            targetSection.classList.add('active');
                            if (sectionId === 'sportgeschaeft') {
                                const slider = targetSection.querySelector('.section-slider');
                                if (slider) {
                                    setupSectionSlider();
                                }
                            }
                            isAnimating = false;
                        }, 600);
                    }
                } else {
                    if (sectionId === 'hero') {
                        const heroSlider = document.querySelector('.hero-slider');
                        if (heroSlider) {
                            heroSlider.classList.add('active');
                            setTimeout(() => {
                                setupSlider();
                                isAnimating = false;
                            }, 100);
                        }
                    } else {
                        newSection.classList.add('active');
                        if (sectionId === 'sportgeschaeft') {
                            const slider = newSection.querySelector('.section-slider');
                            if (slider) {
                                setupSectionSlider();
                            }
                        }
                        setTimeout(() => {
                            isAnimating = false;
                        }, 1200);
                    }
                }
            }

            // Event listeners for navigation
            verticalNavLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const sectionId = this.getAttribute('href').substring(1);
                    activateSection(sectionId);
                });
            });

            headerNavLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const sectionId = this.getAttribute('href').substring(1);
                    activateSection(sectionId);
                });
            });

            // Handle wheel events only on desktop
            if (!isMobile) {
                window.addEventListener('wheel', function(e) {
                    e.preventDefault();
                    if (isAnimating) return;
                    
                    const direction = e.deltaY > 0 ? 1 : -1;
                    const nextIndex = currentSectionIndex + direction;
                    
                    if (nextIndex >= 0 && nextIndex < sectionsArray.length) {
                        activateSection(sectionsArray[nextIndex].id);
                    }
                }, { passive: false });
            }

            // Handle keyboard navigation only on desktop
            if (!isMobile) {
                window.addEventListener('keydown', function(e) {
                    if (isAnimating) return;
                    
                    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                        e.preventDefault();
                        if (currentSectionIndex < sectionsArray.length - 1) {
                            activateSection(sectionsArray[currentSectionIndex + 1].id);
                        }
                    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                        e.preventDefault();
                        if (currentSectionIndex > 0) {
                            activateSection(sectionsArray[currentSectionIndex - 1].id);
                        }
                    }
                });
            }

            function updateActiveNav() {
                const activeSection = sectionsArray[currentSectionIndex];
                verticalNavLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').substring(1) === activeSection.id);
                });
                headerNavLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').substring(1) === activeSection.id);
                });
            }

            // Handle mobile scroll spy
            if (isMobile) {
                window.addEventListener('scroll', function() {
                    const sections = document.querySelectorAll('section, .hero-slider');
                    const navLinks = document.querySelectorAll('.vertical-nav a');
                    let current = '';
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.clientHeight;
                        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                            current = section.getAttribute('id');
                        }
                    });
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').substring(1) === current) {
                            link.classList.add('active');
                        }
                    });
                });
            }

            // Handle resize events
            window.addEventListener('resize', function() {
                const newIsMobile = window.innerWidth <= 992;
                if (newIsMobile !== isMobile) {
                    isMobile = newIsMobile;
                    // Reset scroll behavior
                    if (isMobile) {
                        document.body.style.overflow = 'auto';
                        document.documentElement.style.overflow = 'auto';
                    } else {
                        document.body.style.overflow = 'hidden';
                        document.documentElement.style.overflow = 'hidden';
                        // Reset sections state
                        sectionsArray.forEach(section => section.classList.remove('active'));
                        sectionsArray[currentSectionIndex].classList.add('active');
                    }
                }
            });
        }
              
        function setupTouchNavigation() {
            
            if (window.innerWidth <= 992) {
                return;
            }
            
            let touchStartY = 0;
            let touchEndY = 0;
            const minSwipeDistance = 50;
            
            document.addEventListener('touchstart', function(e) {
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });
            
            document.addEventListener('touchend', function(e) {
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const distance = touchStartY - touchEndY;
                
                if (Math.abs(distance) < minSwipeDistance) return;
                
                const navLinks = document.querySelectorAll('.vertical-nav a');
                const sections = document.querySelectorAll('section, .hero-slider');
                const sectionsArray = Array.from(sections);
                
                
                let currentIndex = 0;
                sectionsArray.forEach((section, index) => {
                    if (section.classList.contains('active')) {
                        currentIndex = index;
                    }
                });
                
                if (distance > 0) {                    
                    if (currentIndex < sectionsArray.length - 1) {
                        navLinks[currentIndex + 1].click();
                    }
                } else {                    
                    if (currentIndex > 0) {
                        navLinks[currentIndex - 1].click();
                    }
                }
            }
        }
              
        function setupFooter() {
            const footer = document.getElementById('footer');
            const footerToggle = document.querySelector('.footer-toggle');
            
            if (!footer || !footerToggle) return;
            
            let isFooterOpen = false;
            
            // Add passive event listener for better performance
            footerToggle.addEventListener('click', function(e) {
                e.preventDefault();
                isFooterOpen = !isFooterOpen;
                if (isFooterOpen) {
                    footer.style.transform = 'translateY(0)';
                    document.body.style.overflow = 'hidden';
                    // Add class for better state management
                    footer.classList.add('open');
                } else {
                    footer.style.transform = 'translateY(100%)';
                    document.body.style.overflow = '';
                    footer.classList.remove('open');
                }
            }, { passive: false });
            
            // Close footer when clicking outside
            document.addEventListener('click', function(e) {
                if (isFooterOpen && !footer.contains(e.target) && e.target !== footerToggle) {
                    isFooterOpen = false;
                    footer.style.transform = 'translateY(100%)';
                    document.body.style.overflow = '';
                    footer.classList.remove('open');
                }
            }, { passive: true });
            
            // Close footer on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && isFooterOpen) {
                    isFooterOpen = false;
                    footer.style.transform = 'translateY(100%)';
                    document.body.style.overflow = '';
                    footer.classList.remove('open');
                }
            }, { passive: true });

            // Handle touch events for mobile
            let touchStartY = 0;
            let touchEndY = 0;
            
            footer.addEventListener('touchstart', function(e) {
                touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            footer.addEventListener('touchmove', function(e) {
                if (!isFooterOpen) return;
                touchEndY = e.touches[0].clientY;
                const diff = touchStartY - touchEndY;
                
                // If swiping down more than 50px, close the footer
                if (diff < -50) {
                    isFooterOpen = false;
                    footer.style.transform = 'translateY(100%)';
                    document.body.style.overflow = '';
                    footer.classList.remove('open');
                }
            }, { passive: true });
        }
              
        function setupMobileMenu() {
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            const nav = document.querySelector('nav');
            const topContacts = document.querySelector('.top-contacts');
            
            if (!menuToggle || !nav) return;
            
            menuToggle.addEventListener('click', function() {
                menuToggle.classList.toggle('open');
                nav.classList.toggle('open');
                if (topContacts) {
                    topContacts.classList.toggle('open');
                }
            });            
            
            const menuLinks = document.querySelectorAll('nav ul li a');
            menuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    menuToggle.classList.remove('open');
                    nav.classList.remove('open');
                    if (topContacts) {
                        topContacts.classList.remove('open');
                    }
                });
            });
        }
              
        function setupMobileScrollSpy() {
            if (window.innerWidth <= 992) {
                const sections = document.querySelectorAll('section, .hero-slider');
                const navLinks = document.querySelectorAll('.vertical-nav a');
                
                window.addEventListener('scroll', function() {
                    let current = '';
                    
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.clientHeight;
                        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                            current = section.getAttribute('id');
                        }
                    });
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').substring(1) === current) {
                            link.classList.add('active');
                        }
                    });
                });
            }
        }
              
        function setupScrollBlockHover() {
            
            if (window.innerWidth <= 992) return;

            const scrollBlocks = document.querySelectorAll('.scroll-block');
            
            scrollBlocks.forEach(block => {
                let scrollInterval;
                let isScrolling = false;
                let returnInterval;
                
                block.addEventListener('mouseenter', () => {                    
                    clearInterval(returnInterval);                    

                    if (block.scrollHeight > block.clientHeight) {
                        const scrollSpeed = 2; 
                        isScrolling = true;
                        
                        scrollInterval = setInterval(() => {                            
                            if (block.scrollTop + block.clientHeight >= block.scrollHeight) {
                                clearInterval(scrollInterval);
                                isScrolling = false;
                            } else {                                
                                block.scrollTop += scrollSpeed;
                            }
                        }, 20);
                    }
                });
                
                block.addEventListener('mouseleave', () => {
                    clearInterval(scrollInterval);
                    isScrolling = false;
                    
                    
                    const returnSpeed = 2; 
                    returnInterval = setInterval(() => {
                        if (block.scrollTop <= 0) {
                            clearInterval(returnInterval);
                        } else {
                            block.scrollTop -= returnSpeed;
                        }
                    }, 20); 
                });
            });
        }
              
        function setupButtonPosition() {
            const sections = document.querySelectorAll('section');
            
            sections.forEach(section => {
                const contentBox = section.querySelector('.content-box');
                if (!contentBox) return;
                
                const contentImage = contentBox.querySelector('.content-image');
                const contentText = contentBox.querySelector('.content-text');
                const button = contentText.querySelector('.btn');
                
                if (!button) return;                
                
                const firstChild = contentBox.firstElementChild;
                
                if (firstChild === contentText) {                    
                    button.style.marginLeft = 'auto';
                    button.style.marginRight = '0';
                } else {                    
                    button.style.marginLeft = '0';
                    button.style.marginRight = 'auto';
                }
                
                button.style.display = 'block';
                button.style.width = 'fit-content';
            });
        }
              
        function setupSectionSlider() {
            console.log('Setting up section slider...');
            const slider = document.querySelector('.section-slider');
            if (!slider) {
                console.log('Slider not found!');
                return;
            }
            console.log('Slider found:', slider);

            // Check if slider is already initialized
            if (slider.dataset.initialized === 'true') {
                console.log('Slider already initialized');
                return;
            }

            const slides = slider.querySelectorAll('.slide');
            console.log('Slides found:', slides.length);
            
            const dotsContainer = slider.querySelector('.slider-dots');
            const prevBtn = slider.querySelector('.slider-arrow.prev');
            const nextBtn = slider.querySelector('.slider-arrow.next');
            let currentSlide = 0;
            let slideInterval;

            // Create dots
            dotsContainer.innerHTML = ''; // Clear existing dots
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => showSlide(index));
                dotsContainer.appendChild(dot);
            });

            const dots = dotsContainer.querySelectorAll('button');
            console.log('Dots created:', dots.length);

            function showSlide(index) {
                console.log('Showing slide:', index);
                slides.forEach(slide => slide.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                slides[index].classList.add('active');
                dots[index].classList.add('active');
                currentSlide = index;
            }

            function nextSlide() {
                let next = currentSlide + 1;
                if (next >= slides.length) next = 0;
                showSlide(next);
            }

            function prevSlide() {
                let prev = currentSlide - 1;
                if (prev < 0) prev = slides.length - 1;
                showSlide(prev);
            }

            function startAutoSlide() {
                stopAutoSlide();
                slideInterval = setInterval(nextSlide, 5000);
            }

            function stopAutoSlide() {
                if (slideInterval) {
                    clearInterval(slideInterval);
                }
            }

            // Event listeners
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    startAutoSlide();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    startAutoSlide();
                });
            }

            // Touch events for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoSlide();
            });

            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoSlide();
            });

            function handleSwipe() {
                const swipeThreshold = 50;
                if (touchEndX < touchStartX - swipeThreshold) {
                    nextSlide();
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    prevSlide();
                }
            }

            // Initialize
            showSlide(0);
            startAutoSlide();
            
            // Mark slider as initialized
            slider.dataset.initialized = 'true';
            console.log('Slider initialized successfully');

            // Pause on hover
            slider.addEventListener('mouseenter', stopAutoSlide);
            slider.addEventListener('mouseleave', startAutoSlide);

            // Check if slider is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startAutoSlide();
                    } else {
                        stopAutoSlide();
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(slider);
        }

        function setupFooterModal() {
            const modalLinks = document.querySelectorAll('.footer-modal-link');
            const modal = document.getElementById('footerModal');
            const modalContent = document.getElementById('footerModalContent');
            const closeBtn = modal.querySelector('.modal-close');

            modalLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const type = this.dataset.modalType;
                    if (!type) return;
                    modal.classList.add('show');
                    modalContent.innerHTML = '<div style="padding:2em;text-align:center;">Lade...</div>';
                    fetch(`modals/${type}.html`)
                        .then(res => res.ok ? res.text() : Promise.reject('Nicht gefunden'))
                        .then(html => { modalContent.innerHTML = html; })
                        .catch(() => { modalContent.innerHTML = '<div style="padding:2em;text-align:center;color:red;">Inhalt nicht gefunden.</div>'; });
                });

                // Handle scroll events for footer modals
                if (modal.id === 'footerModal') {
                    const modalContent = document.getElementById('footerModalContent');
                    if (modalContent) {
                        modalContent.addEventListener('wheel', function(e) {
                            e.stopPropagation();
                        }, { passive: false });
                    }
                }

            });

            closeBtn.addEventListener('click', () => modal.classList.remove('show'));
            modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
        }
              
        document.addEventListener('DOMContentLoaded', () => {
            
            setTimeout(createParticles, 100);
            
            setupSlider();
            setupScrollEffect();
            setupSectionSwitching();
            setupTouchNavigation();
            setupFooter();
            setupMobileMenu();
            setupMobileScrollSpy();
            setupScrollBlockHover();
            setupButtonPosition();
            setupSectionSlider();
            setupFooterModal();
            
            let resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    // Update mobile menu state
                    const nav = document.querySelector('nav');
                    const menuToggle = document.querySelector('.mobile-menu-toggle');
                    if (window.innerWidth > 992 && nav && menuToggle) {
                        nav.classList.remove('open');
                        menuToggle.classList.remove('open');
                    }
                    
                    // Update footer state
                    const footer = document.getElementById('footer');
                    if (footer) {
                        footer.style.transform = '';
                        document.body.style.overflow = '';
                        footer.classList.remove('open');
                    }

                    // Reinitialize section slider if sportgeschaeft section is active
                    const sportgeschaeftSection = document.getElementById('sportgeschaeft');
                    if (sportgeschaeftSection && sportgeschaeftSection.classList.contains('active')) {
                        const slider = sportgeschaeftSection.querySelector('.section-slider');
                        if (slider) {
                            // Reset initialization flag
                            slider.dataset.initialized = 'false';
                            setupSectionSlider();
                        }
                    }
                }, 250);
            }, { passive: true });

		const modal = document.getElementById('popup-modal');
      		const close = modal.querySelector('.modal-close');

      		// Modal nach 3 Sekunden öffnen
      		setTimeout(() => modal.classList.add('show'), 3000);

      		// Schließen per × oder Klick außerhalb
      		close.addEventListener('click', () => modal.classList.remove('show'));
      		modal.addEventListener('click', e => {
        		if (e.target === modal) modal.classList.remove('show');
      		});

            const yearEl = document.getElementById('year');
            if (yearEl) yearEl.textContent = new Date().getFullYear();      

        });


window.addEventListener('resize', setupButtonPosition);
