document.addEventListener('DOMContentLoaded', function() {
    if (typeof travelData === 'undefined') {
        console.error('travelData not found!');
        return;
    }
    
    let currentDestinationIndex = -1;
    
    function generateContent() {
        const sectionsContainer = document.getElementById('sections-container');
        const navLinksContainer = document.getElementById('nav-links');
        const landingNavLinksContainer = document.getElementById('landing-nav-links');
        
        if (!sectionsContainer || !navLinksContainer || !landingNavLinksContainer) {
            return;
        }
        
        sectionsContainer.innerHTML = '';
        navLinksContainer.innerHTML = '';
        landingNavLinksContainer.innerHTML = '';
        
        travelData.forEach((destination, index) => {
            const sectionHTML = `
                <section id="${destination.id}" class="section h-screen relative">
                    <div class="bg-image" style="background-image: url('${destination.backgroundImage}');"></div>
                    <div class="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
                </section>
            `;
            
            sectionsContainer.insertAdjacentHTML('beforeend', sectionHTML);
            
            const navLink = document.createElement('a');
            navLink.href = `#${destination.id}`;
            navLink.className = 'nav-link';
            navLink.textContent = destination.title;
            navLinksContainer.appendChild(navLink);
            
            const landingNavLink = document.createElement('a');
            landingNavLink.href = `#${destination.id}`;
            landingNavLink.className = 'nav-link';
            landingNavLink.textContent = destination.title;
            landingNavLinksContainer.appendChild(landingNavLink);
        });
        
        updateCardContent(0, true);

        setTimeout(() => {
            initializeInteractions();
            initializeObserver();
            initializeVanillaParallax();
            initializeJsSnapping();
            initializeNavbarScroll();
        }, 100);
    }
    
    function updateCardContent(destinationIndex, isInitialLoad = false) {
        if (destinationIndex < 0 || destinationIndex >= travelData.length) return;
        if (currentDestinationIndex === destinationIndex) return;
        
        const destination = travelData[destinationIndex];
        currentDestinationIndex = destinationIndex;

        if (isInitialLoad) {
            document.getElementById('card-title').textContent = destination.title;
            document.getElementById('card-location').textContent = destination.location;
            document.getElementById('card-location').className = `text-base md:text-lg font-semibold ${destination.locationColor}`;
            document.getElementById('card-description').textContent = destination.description;
            document.getElementById('card-price').textContent = destination.price;

            const mobileBgImage = document.getElementById('mobile-bg-image');
            if (mobileBgImage) {
                mobileBgImage.style.backgroundImage = `url('${destination.backgroundImage}')`;
            }

            const tagsContainer = document.getElementById('card-tags');
            tagsContainer.innerHTML = destination.tags.map(tag => 
                `<span class="tag px-3 py-1 rounded-full text-xs md:text-sm font-medium"># ${tag}</span>`
            ).join('');
        } else {
            animateCardContent(destination);
        }
    }
    
    function animateCardContent(destination) {
        const elements = [
            '#card-title',
            '#card-location',
            '#card-description',
            '#card-tags',
            '#card-price',
            '#card-button'
        ];
        
        anime.timeline({
            easing: 'easeOutExpo',
        })
        .add({
            targets: elements,
            opacity: [1, 0],
            translateY: [0, -20],
            duration: 200,
            delay: anime.stagger(25),
            complete: () => {
                document.getElementById('card-title').textContent = destination.title;
                document.getElementById('card-location').textContent = destination.location;
                document.getElementById('card-location').className = `text-base md:text-lg font-semibold ${destination.locationColor}`;
                document.getElementById('card-description').textContent = destination.description;
                document.getElementById('card-price').textContent = destination.price;

                const mobileBgImage = document.getElementById('mobile-bg-image');
                if (mobileBgImage) {
                    mobileBgImage.style.backgroundImage = `url('${destination.backgroundImage}')`;
                }
                
                const tagsContainer = document.getElementById('card-tags');
                tagsContainer.innerHTML = destination.tags.map(tag => 
                    `<span class="tag px-3 py-1 rounded-full text-xs md:text-sm font-medium"># ${tag}</span>`
                ).join('');
            }
        })
        .add({
            targets: elements,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 300,
            delay: anime.stagger(30)
        });
    }
    
    function initializeJsSnapping() {
        let scrollTimeout;
        let isNavigating = false;

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                isNavigating = true;
                setTimeout(() => { isNavigating = false; }, 1500);
            });
        });

        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            if (isNavigating) return;

            scrollTimeout = setTimeout(() => {
                const sections = document.querySelectorAll('.section');
                let closestSection = null;
                let smallestDistance = Infinity;

                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const distance = Math.abs(rect.top);

                    if (distance < smallestDistance) {
                        smallestDistance = distance;
                        closestSection = section;
                    }
                });

                if (closestSection) {
                    isNavigating = true;
                    closestSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => { isNavigating = false; }, 1500);
                }
            }, 150);
        }, { passive: true });
    }
    
    function initializeVanillaParallax() {
        const bgImages = document.querySelectorAll('.bg-image');
        let ticking = false;
        
        function handleScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    bgImages.forEach(bg => {
                        const section = bg.parentElement;
                        const rect = section.getBoundingClientRect();
                        
                        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                            const speed = 0.3;
                            const yPos = -rect.top * speed;
                            bg.style.backgroundPositionY = `calc(50% + ${yPos}px)`;
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    function initializeObserver() {
        const observerOptions = {
            threshold: 0.6,
            rootMargin: '0px'
        };
        
        const cardContainer = document.querySelector('.fixed-card-container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    if (sectionId !== 'landing') {
                        cardContainer.classList.add('visible');
                        const destinationIndex = travelData.findIndex(dest => dest.id === sectionId);
                        if (destinationIndex !== -1) {
                            updateCardContent(destinationIndex);
                            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                            if (activeLink) activeLink.classList.add('active');
                        }
                    } else {
                        cardContainer.classList.remove('visible');
                    }
                }
            });
        }, observerOptions);
        
        observer.observe(document.querySelector('#landing'));
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }
    
    function initializeInteractions() {
        
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    document.querySelectorAll('.dropdown-content').forEach(content => {
                        content.classList.remove('show');
                    });
                }
            }
        });
        
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const menuIcon = dropdown.querySelector('.menu-icon');
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            
            if (menuIcon && dropdownContent) {
                menuIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    document.querySelectorAll('.dropdown-content').forEach(content => {
                        if (content !== dropdownContent) {
                            content.classList.remove('show');
                        }
                    });
                    
                    dropdownContent.classList.toggle('show');
                });
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    content.classList.remove('show');
                });
            }
        });
    }
    
    function initializeNavbarScroll() {
        const navbar = document.querySelector('.floating-navbar');
        let lastScrollY = window.scrollY;
        
        function handleNavbarScroll() {
            const currentScrollY = window.scrollY;
            const landingSection = document.querySelector('#landing');
            const landingHeight = landingSection ? landingSection.offsetHeight : 0;
            if (currentScrollY > landingHeight * 0.3) {
                navbar.classList.add('visible');
            } else {
                navbar.classList.remove('visible');
            }
            
            lastScrollY = currentScrollY;
        }
        
        window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    }
    
    generateContent();
});

$.easing.easeInOutCubic = function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
};
