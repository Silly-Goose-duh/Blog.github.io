// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const panelsTrack = document.getElementById('panelsTrack');
    const storyDetails = document.getElementById('storyDetails');
    const storyTitle = document.getElementById('storyTitle');
    const storyDate = document.getElementById('storyDate');
    const storyText = document.getElementById('storyText');
    const readMoreBtn = document.getElementById('readMoreBtn');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const viewStoriesBtn = document.getElementById('viewStoriesBtn');

    // Scroll handling for panels
    let scrollPosition = 0;
    let isScrolling = false;
    const scrollStep = 250;
    let activePanel = null;

    // Panels functionality
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let startTime = 0;
    let currentX = 0;

    // Sample blog posts data
    const blogPosts = [
        {
            title: "Lost in Literature",
            date: "March 15, 2024",
            preview: "Exploring the depths of classic novels and their impact on modern thinking...",
            image: "images/blog1.jpg",
            filename: "lost-in-literature.html",
            icon: "fas fa-book"
        },
        {
            title: "The Art of Overthinking",
            date: "March 5, 2024",
            preview: "Finding beauty in the chaos of an overactive mind...",
            image: "images/blog3.jpg",
            filename: "art-of-overthinking.html",
            icon: "fas fa-brain"
        },
        {
            title: "Dreams & Reality",
            date: "February 28, 2024",
            preview: "Where do our dreams end and reality begin?",
            image: "images/blog4.jpg",
            filename: "dreams-and-reality.html",
            icon: "fas fa-moon"
        },
        {
            title: "Poetry in Motion",
            date: "February 20, 2024",
            preview: "Finding rhythm in everyday moments...",
            image: "images/blog5.jpg",
            filename: "poetry-in-motion.html",
            icon: "fas fa-feather-alt"
        }
    ];

    function updatePanelsPosition() {
        const panelWidth = 400; // Width of each panel
        const gap = 32; // Gap between panels
        const maxScroll = -(panelsTrack.scrollWidth - panelsTrack.clientWidth);

        // Add boundaries to prevent over-scrolling
        currentTranslate = Math.max(maxScroll, Math.min(0, currentTranslate));
        prevTranslate = currentTranslate;

        // Apply transform with hardware acceleration
        panelsTrack.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
        requestAnimationFrame(updatePanelScaling);
    }

    function updatePanelScaling() {
        const panels = panelsTrack.querySelectorAll('.panel');
        const containerRect = document.querySelector('.panels-container').getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;

        panels.forEach(panel => {
            const rect = panel.getBoundingClientRect();
            const panelCenterX = rect.left + rect.width / 2;
            const distanceFromCenter = Math.abs(centerX - panelCenterX);
            const maxDistance = containerRect.width / 2;
            
            // Calculate scale based on distance from center
            const minScale = 0.85;
            const maxScale = 1;
            const scale = maxScale - (distanceFromCenter / maxDistance) * (maxScale - minScale);
            
            // Apply the scale transformation
            panel.style.transform = `scale(${Math.max(minScale, Math.min(maxScale, scale))})`;
            
            // Update active state
            if (distanceFromCenter < panel.offsetWidth / 3) {
                panel.classList.add('active');
                activePanel = panel;
            } else {
                panel.classList.remove('active');
            }
            
            // Update z-index based on distance from center
            panel.style.zIndex = Math.round(1000 - distanceFromCenter);
        });
    }

    // Smooth scroll animation with improved easing
    function smoothScroll(targetPosition) {
        if (isScrolling) return;
        isScrolling = true;
        
        const startPosition = scrollPosition;
        const distance = targetPosition - startPosition;
        const duration = 500;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Improved easing function for smoother motion
            const easeProgress = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            scrollPosition = startPosition + (distance * easeProgress);
            updatePanelsPosition();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isScrolling = false;
            }
        }

        requestAnimationFrame(animate);
    }

    // Handle wheel event
    document.querySelector('.panels-container').addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        const scrollStep = 400 + 32; // panel width + gap
        
        currentTranslate += delta > 0 ? -scrollStep : scrollStep;
        prevTranslate = currentTranslate;
        
        updatePanelsPosition();
    }, { passive: false });

    // Function to create a panel element
    function createPanel(blogData, index) {
        const panel = document.createElement('div');
        panel.className = 'panel';
        panel.setAttribute('data-story', index);
        
        panel.innerHTML = `
            <div class="panel-image">
                <div class="image-placeholder">
                    <i class="${blogData.icon || 'fas fa-image'}"></i>
                </div>
            </div>
            <div class="panel-content">
                <h3>${blogData.title}</h3>
                <span class="date">${blogData.date}</span>
                <p class="preview">${blogData.preview}</p>
                <a href="${blogData.filename ? 'blog-pages/' + blogData.filename : '#'}" class="view-blog-btn">
                    ${blogData.filename ? 'View Blog' : 'Read More'}
                </a>
            </div>
        `;

        // Make the entire panel clickable if it has a filename
        if (blogData.filename) {
            panel.addEventListener('click', (e) => {
                if (!e.target.classList.contains('view-blog-btn')) {
                    window.location.href = `blog-pages/${blogData.filename}`;
                }
            });
        }

        return panel;
    }

    // Function to create static panels
    function createStaticPanels() {
        // Clear existing panels
        panelsTrack.innerHTML = '';
        
        // Create single set of panels
        blogPosts.forEach((post, index) => {
            const panel = createPanel(post, index);
            panelsTrack.appendChild(panel);
        });

        // Set initial position
        currentTranslate = 0;
        prevTranslate = 0;
        setSliderPosition();
        
        // Initial update of panel scaling
        updatePanelScaling();
    }

    // Function to load blog posts
    async function loadBlogPosts() {
        try {
            const response = await fetch('blog-pages/posts.json');
            const data = await response.json();
            const posts = data.posts;
            
            // Sort posts by date (newest first)
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Clear existing panels
            panelsTrack.innerHTML = '';
            
            // Create and append panels
            posts.forEach((post, index) => {
                const panel = createPanel(post, index);
                panelsTrack.appendChild(panel);
            });
            
            // Set initial position
            currentTranslate = 0;
            prevTranslate = 0;
            setSliderPosition();
            
            // Initial update of panel scaling
            updatePanelScaling();
        } catch (error) {
            console.error('Error loading blog posts:', error);
            // Fallback to static panels if loading fails
            createStaticPanels();
        }
    }

    // Mobile menu handling
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
        }
    });

    // Smooth scroll for View Stories button
    if (viewStoriesBtn) {
        viewStoriesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const activePanel = document.querySelector('.panel.active');
            if (activePanel) {
                // Show modal or navigate to full story
                const storyModal = document.getElementById('storyModal');
                const modalBody = document.getElementById('modalBody');
                const storyTitle = activePanel.querySelector('h3').textContent;
                const storyPreview = activePanel.querySelector('.preview').textContent;
                
                modalBody.innerHTML = `
                    <h3>${storyTitle}</h3>
                    <p>${storyPreview}</p>
                    <p>Full story content coming soon...</p>
                `;
                
                storyModal.style.display = 'flex';
            }
        });
    }

    // Modal close functionality
    const closeModal = document.querySelector('.close-modal');
    const modal = document.getElementById('storyModal');
    
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    function setSliderPosition() {
        panelsTrack.style.transform = `translateX(${currentTranslate}px)`;
    }

    function showStoryModal(post) {
        const modal = document.getElementById('storyModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <h3>${post.title}</h3>
            <p class="date">${post.date}</p>
            <p>${post.preview}</p>
            <p>Full story content coming soon...</p>
        `;
        
        modal.style.display = 'flex';
    }

    // Improved touch handling
    function touchStart(event) {
        startTime = Date.now();
        startPos = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
        currentX = startPos;
        isDragging = true;
        
        // Cancel any ongoing animations
        if (animationID) {
            cancelAnimationFrame(animationID);
        }
        
        animationID = requestAnimationFrame(animation);
        panelsTrack.style.cursor = 'grabbing';
    }

    function touchMove(event) {
        if (isDragging) {
            event.preventDefault();
            const currentPosition = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
            currentX = currentPosition;
            
            const diff = currentPosition - startPos;
            currentTranslate = prevTranslate + diff;
            
            setSliderPosition();
            updatePanelsPosition();
        }
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        panelsTrack.style.cursor = 'grab';
        
        const duration = Date.now() - startTime;
        const velocity = (currentX - startPos) / duration;
        const panelWidth = 400 + 32; // panel width + gap
        const momentum = Math.abs(velocity) > 0.5;
        
        if (momentum) {
            // Add momentum scrolling
            const direction = velocity > 0 ? 1 : -1;
            const speed = Math.min(Math.abs(velocity) * 2, 3);
            currentTranslate += direction * panelWidth * speed;
        }
        
        // Snap to nearest panel
        currentTranslate = Math.round(currentTranslate / panelWidth) * panelWidth;
        
        // Ensure we don't scroll beyond boundaries
        const maxScroll = -(panelsTrack.scrollWidth - panelsTrack.clientWidth);
        currentTranslate = Math.max(maxScroll, Math.min(0, currentTranslate));
        
        prevTranslate = currentTranslate;
        updatePanelsPosition();
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    // Initialize panels
    if (panelsTrack) {
        // Try to load dynamic posts first
        loadBlogPosts().catch(() => {
            // Fallback to static panels if loading fails
            createStaticPanels();
        });
        
        // Add event listeners
        panelsTrack.addEventListener('touchstart', touchStart, { passive: true });
        panelsTrack.addEventListener('touchmove', touchMove, { passive: true });
        panelsTrack.addEventListener('touchend', touchEnd);
        
        // Mouse events
        panelsTrack.addEventListener('mousedown', touchStart);
        panelsTrack.addEventListener('mousemove', touchMove);
        panelsTrack.addEventListener('mouseup', touchEnd);
        panelsTrack.addEventListener('mouseleave', touchEnd);
    }

    // Wave animation
    function startWaveAnimation() {
        const header = document.querySelector('header');
        const heroImage = document.querySelector('.hero-image');
        const waveEffect = document.querySelector('.wave-effect');
        
        // Reset wave animation
        waveEffect.style.animation = 'none';
        waveEffect.offsetHeight; // Trigger reflow
        waveEffect.style.animation = null;
        
        // Add permanent glow effect to profile picture
        heroImage.classList.add('glow');
    }

    // Trigger wave animation on page load
    setTimeout(startWaveAnimation, 1000);
});