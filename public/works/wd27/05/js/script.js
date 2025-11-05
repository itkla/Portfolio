document.addEventListener('DOMContentLoaded', function() {
    // couldn't figure out how to do it in-line so im doing it this way
    initializeAnimations();
    initializeScrollAnimations();
    initializeCardInteractions();
    initializeSmoothScroll();
    initializeNavbarScroll();
    initializeEventSearch();
    initializeMobileMenu();
    initializePerformanceOptimizations();
});

import { animate, stagger, utils } from 'animejs';

function initializeAnimations() {
    if (document.querySelector('.hero-title')) {
        animate('.hero-title', {
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 1200,
            ease: 'outExpo',
            delay: 300
        });
        
        animate('.hero-subtitle', {
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 1000,
            ease: 'outExpo',
            delay: 500
        });
        
        animate('.hero-button', {
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 800,
            ease: 'outExpo',
            delay: 700
        });
    }
    
    const eventCards = document.querySelectorAll('.event-card');
    if (eventCards.length > 0) {
        animate(eventCards, {
            translateY: [60, 0],
            opacity: [0, 1],
            duration: 800,
            ease: 'outExpo',
            delay: stagger(200, {start: 800})
        });
    }
    
    if (document.querySelector('.detail-hero')) {
        animate('.detail-hero', {
            scale: [1.1, 1],
            opacity: [0, 1],
            duration: 1000,
            ease: 'outExpo'
        });
    }
}

function initializeScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.classList.contains('fade-on-scroll')) {
                    animate(element, {
                        translateY: [30, 0],
                        opacity: [0, 1],
                        duration: 800,
                        ease: 'outExpo'
                    });
                }
                
                if (element.classList.contains('count-up')) {
                    animateCounter(element);
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-on-scroll, .count-up').forEach(el => {
        observer.observe(el);
    });
    
    const sectionTitles = document.querySelectorAll('h2, h3');
    sectionTitles.forEach(title => {
        observer.observe(title);
        title.classList.add('fade-on-scroll');
    });
}

function initializeCardInteractions() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                animate(card.querySelector('.event-card > div'), {
                    scale: 1.02,
                    translateY: -8,
                    duration: 300,
                    ease: 'outQuart'
                });
                
                const cardImage = card.querySelector('.card-image');
                if (cardImage) {
                    animate(cardImage, {
                        scale: 1.1,
                        duration: 300,
                        ease: 'outQuart'
                    });
                }
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                animate(card.querySelector('.event-card > div'), {
                    scale: 1,
                    translateY: 0,
                    duration: 300,
                    ease: 'outQuart'
                });
                
                const cardImage = card.querySelector('.card-image');
                if (cardImage) {
                    animate(cardImage, {
                        scale: 1,
                        duration: 300,
                        ease: 'outQuart'
                    });
                }
            }
        });
        
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

function createRippleEffect(event, element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    animate(ripple, {
        scale: [0, 2],
        opacity: [1, 0],
        duration: 600,
        ease: 'outExpo',
        complete: () => {
            ripple.remove();
        }
    });
}

function initializeNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let isNavbarVisible = false;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroHeight = window.innerHeight * 0.8; // 80% of vh
        
        if (scrollTop > heroHeight && !isNavbarVisible) {
            navbar.classList.remove('-translate-y-full');
            navbar.classList.add('translate-y-0');
            isNavbarVisible = true;
        } else if (scrollTop <= heroHeight && isNavbarVisible) {
            navbar.classList.remove('translate-y-0');
            navbar.classList.add('-translate-y-full');
            isNavbarVisible = false;
        }
        
        lastScrollTop = scrollTop;
    });
}

function initializeEventSearch() {
    const searchInput = document.getElementById('eventSearch');
    const eventCards = document.querySelectorAll('.event-card');
    
    if (!searchInput || eventCards.length === 0) return;
    
    searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            eventCards.forEach(card => {
                const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
                const description = card.querySelector('p')?.textContent.toLowerCase() || '';
                const location = card.querySelector('.flex div')?.textContent.toLowerCase() || '';
                const hashtag = card.querySelector('span')?.textContent.toLowerCase() || '';
                
                const matchesSearch = title.includes(searchTerm) || 
                                    description.includes(searchTerm) || 
                                    location.includes(searchTerm) || 
                                    hashtag.includes(searchTerm);
                
                if (matchesSearch || searchTerm === '') {
                    card.style.display = 'block';
                    animate(card, {
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        duration: 300,
                        ease: 'outQuart'
                    });
                } else {
                    animate(card, {
                        opacity: [1, 0],
                        scale: [1, 0.9],
                        duration: 200,
                        ease: 'inQuart',
                        complete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                animate([document.documentElement, document.body], {
                    scrollTop: targetPosition,
                    duration: 800,
                    ease: 'inOutQuart'
                });
            }
        });
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count) || 100;
    const counter = { count: 0 };
    
    animate(counter, {
        count: target,
        duration: 2000,
        ease: 'outExpo',
        update: () => {
            element.textContent = Math.floor(counter.count).toLocaleString();
        }
    });
}

function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.contains('active');
            
            if (isOpen) {
                animate(mobileMenu, {
                    translateX: [0, '100%'],
                    duration: 300,
                    ease: 'inQuart',
                    complete: () => {
                        mobileMenu.classList.remove('active');
                    }
                });
            } else {
                mobileMenu.classList.add('active');
                animate(mobileMenu, {
                    translateX: ['100%', 0],
                    duration: 300,
                    ease: 'outQuart'
                });
            }
        });
}

function initializePerformanceOptimizations() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    let ticking = false;
    
    function updateScrollAnimations() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.parallax');
        
        parallax.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollAnimations);
            ticking = true;
        }
    });
}

function animatePageTransition(callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        transform: translateX(-100%);
    `;
    
    document.body.appendChild(overlay);
    
    animate(overlay, {
        translateX: ['-100%', '0%'],
        duration: 400,
        ease: 'inQuart',
        complete: () => {
            if (callback) callback();
            animate(overlay, {
                translateX: ['0%', '100%'],
                duration: 400,
                ease: 'outQuart',
                delay: 100,
                complete: () => {
                    overlay.remove();
                }
            });
        }
    });
}

function adjustThemeColors() {
    const hour = new Date().getHours();
    const root = document.documentElement;
    
    if (hour >= 18 || hour <= 6) {
        root.style.setProperty('--theme-primary', '#4a5568');
        root.style.setProperty('--theme-accent', '#667eea');
    } else if (hour >= 6 && hour <= 12) {
        root.style.setProperty('--theme-primary', '#2d3748');
        root.style.setProperty('--theme-accent', '#ed8936');
    } else {
        root.style.setProperty('--theme-primary', '#1a202c');
        root.style.setProperty('--theme-accent', '#667eea');
    }
}

function handleResponsiveFeatures() {
    const isMobile = window.innerWidth <= 768;
    const eventCards = document.querySelectorAll('.event-card');
    
    if (isMobile) {
        eventCards.forEach(card => {
            card.style.transition = 'transform 0.2s ease';
        });
    } else {
        eventCards.forEach(card => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
        });
    }
}

window.addEventListener('resize', utils.debounce(() => {
    handleResponsiveFeatures();
}, 250));

handleResponsiveFeatures();

window.addEventListener('error', function(e) {
    console.error('JavaScript エラーが発生しました:', e.error);
});

// no longer needed
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.registerServiceWorker('./sw.js');
    });
}

function improveAccessibility() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

improveAccessibility();