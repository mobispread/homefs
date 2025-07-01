
// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Navigation functionality
class Navigation {
    constructor() {
        this.header = document.getElementById('header');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupSmoothScroll();
    }
    
    setupScrollEffect() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class
            if (scrollTop > 100) {
                this.header.style.background = 'rgba(15, 15, 15, 0.98)';
                this.header.style.backdropFilter = 'blur(30px)';
            } else {
                this.header.style.background = 'rgba(15, 15, 15, 0.95)';
                this.header.style.backdropFilter = 'blur(20px)';
            }
            
            // Hide/show navbar on scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    setupMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
            
            // Animate hamburger
            const spans = this.hamburger.querySelectorAll('span');
            if (this.hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
                
                const spans = this.hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    if (correspondingLink) {
                        correspondingLink.classList.add('active');
                    }
                }
            });
        });
    }
    
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu
                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
                
                const spans = this.hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// Image Modal
class ImageModal {
    constructor() {
        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalClose = document.querySelector('.modal-close');
        
        this.init();
    }
    
    init() {
        this.setupCloseEvents();
    }
    
    open(imageSrc) {
        this.modalImage.src = imageSrc;
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Animate in
        requestAnimationFrame(() => {
            this.modal.style.opacity = '1';
        });
    }
    
    close() {
        this.modal.style.opacity = '0';
        document.body.style.overflow = '';
        
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300);
    }
    
    setupCloseEvents() {
        this.modalClose.addEventListener('click', () => this.close());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }
}

// Contact Form
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const interest = formData.get('interest');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !phone || !message) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Create WhatsApp message
        const whatsappMessage = `Hello! I'm interested in Chandy's Tall County apartment.%0A%0AName: ${name}%0AEmail: ${email}%0APhone: ${phone}%0AInterest: ${interest}%0AMessage: ${message}`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=+15612719502&text=${whatsappMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        this.showNotification('Redirecting to WhatsApp...', 'success');
        
        // Reset form
        this.form.reset();
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-family: var(--font-primary);
            ${type === 'success' ? 'background: linear-gradient(135deg, #10b981, #059669);' : 'background: linear-gradient(135deg, #ef4444, #dc2626);'}
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.feature-card, .amenity-card, .gallery-item, .contact-card, .info-item');
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, options);
        
        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Parallax effect for hero
class ParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.init();
    }
    
    init() {
        if (this.hero && window.innerWidth > 768) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.2;
                
                const heroVideo = this.hero.querySelector('.hero-video');
                if (heroVideo) {
                    heroVideo.style.transform = `translateY(${parallax}px)`;
                }
            });
        }
    }
}

// Enhanced hover effects with mobile support
class HoverEffects {
    constructor() {
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.init();
    }
    
    init() {
        if (!this.isTouchDevice) {
            this.setupHoverEffects();
        } else {
            this.setupTouchEffects();
        }
    }
    
    setupHoverEffects() {
        // Card hover effects for non-touch devices
        const cards = document.querySelectorAll('.feature-card, .amenity-card, .contact-card, .info-item');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Gallery item effects
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    setupTouchEffects() {
        // Touch-friendly effects for mobile devices
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
            
            button.addEventListener('touchcancel', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
        // Gallery items always show overlay on touch devices
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            const overlay = item.querySelector('.gallery-overlay');
            if (overlay) {
                overlay.style.transform = 'translateY(0)';
                overlay.style.opacity = '0.9';
            }
        });
        
        // Plan overlay always visible on touch devices
        const planImage = document.querySelector('.plan-image');
        if (planImage) {
            const planOverlay = planImage.querySelector('.plan-overlay');
            if (planOverlay) {
                planOverlay.style.opacity = '1';
            }
        }
        
        // About image overlay always visible on touch devices
        const aboutImage = document.querySelector('.about-image');
        if (aboutImage) {
            const imageOverlay = aboutImage.querySelector('.image-overlay');
            if (imageOverlay) {
                imageOverlay.style.opacity = '1';
            }
        }
    }
}

// Global functions for HTML onclick events
function openModal(imageSrc) {
    if (window.imageModal) {
        window.imageModal.open(imageSrc);
    }
}

// Page loading effect
class PageLoader {
    constructor() {
        this.init();
    }
    
    init() {
        // Add smooth reveal on page load
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            
            // Animate elements in sequence
            const elements = document.querySelectorAll('.hero-info > *');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    }
}

// Mobile viewport handler
class MobileViewport {
    constructor() {
        this.init();
    }
    
    init() {
        // Set viewport meta tag for proper mobile scaling
        this.setViewport();
        
        // Handle orientation changes
        this.handleOrientationChange();
        
        // Prevent zoom on double tap for specific elements
        this.preventDoubleTabZoom();
        
        // Handle safe area for devices with notches
        this.handleSafeArea();
    }
    
    setViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    }
    
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // Delay to allow the orientation change to complete
            setTimeout(() => {
                window.scrollTo(0, 0);
                
                // Recalculate hero height if needed
                const hero = document.querySelector('.hero');
                if (hero && window.innerHeight < 500) {
                    hero.style.minHeight = '100vh';
                }
            }, 100);
        });
    }
    
    preventDoubleTabZoom() {
        const elements = document.querySelectorAll('.btn, .nav-link, .gallery-btn');
        elements.forEach(element => {
            element.addEventListener('touchend', (e) => {
                e.preventDefault();
                element.click();
            });
        });
    }
    
    handleSafeArea() {
        // Add CSS custom properties for safe area
        const root = document.documentElement;
        root.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
        root.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
        root.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
        root.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
    }
}

// Touch gesture handler
class TouchHandler {
    constructor() {
        this.init();
    }
    
    init() {
        // Improve scroll performance on mobile
        this.optimizeScrolling();
        
        // Handle touch gestures for gallery
        this.setupGalleryGestures();
        
        // Improve tap performance
        this.optimizeTapping();
    }
    
    optimizeScrolling() {
        // Use passive event listeners for better performance
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
        
        // Prevent overscroll on body
        document.body.addEventListener('touchmove', (e) => {
            if (e.target === document.body) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    setupGalleryGestures() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            let touchStartTime = 0;
            
            item.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
            });
            
            item.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                
                // If touch duration is less than 200ms, treat as tap
                if (touchDuration < 200) {
                    const img = item.querySelector('img');
                    if (img && window.imageModal) {
                        window.imageModal.open(img.src);
                    }
                }
            });
        });
    }
    
    optimizeTapping() {
        // Remove 300ms tap delay on mobile
        const fastClickElements = document.querySelectorAll('.btn, .nav-link, .gallery-btn, .whatsapp-btn');
        fastClickElements.forEach(element => {
            element.style.touchAction = 'manipulation';
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile-specific components first
    const mobileViewport = new MobileViewport();
    const touchHandler = new TouchHandler();
    
    // Initialize components
    const navigation = new Navigation();
    window.imageModal = new ImageModal();
    const contactForm = new ContactForm();
    const scrollAnimations = new ScrollAnimations();
    const parallax = new ParallaxEffect();
    const hoverEffects = new HoverEffects();
    const pageLoader = new PageLoader();
    
    // Form enhancements
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Smooth scroll for all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Performance optimizations
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Add custom cursor effect for interactive elements
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Handle form validation
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#333333';
        }
    });
    
    return isValid;
};

// Add loading states
const addLoadingState = (button) => {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
};

// Initialize theme
document.documentElement.style.setProperty('--primary-color', '#c9a961');
document.documentElement.style.setProperty('--dark-bg', '#0f0f0f');
