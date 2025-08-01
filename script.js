document.addEventListener('DOMContentLoaded', function() {
    // --- Hamburger menu functionality ---
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('open');
        nav.classList.toggle('open');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('open');
            nav.classList.remove('open');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('header').offsetHeight;
            
            if (pageYOffset >= (sectionTop - headerHeight - 10)) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href') === `#${current}`) {
                li.classList.add('active');
            }
        });
    });

    // --- Masonry + Infinite Scroll setup ---
    const grid = document.querySelector('.grid');
    if (!grid) return; // Exit if no grid found (safe guard)

    // Initialize Masonry
    const msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-item',
        gutter: 16,
        percentPosition: true,
    });

    // Layout Masonry after initial images loaded
    imagesLoaded(grid, () => {
        msnry.layout();
    });

    // Infinite scroll vars
    let page = 1;
    const maxPages = 5;
    let loading = false;

    function loadMoreItems() {
        if (loading) return;
        if (page >= maxPages) return;

        loading = true;
        page++;

        const newItems = [];

        for (let i = 1; i <= 6; i++) {
            const width = 300 + Math.floor(Math.random() * 150);
            const height = 300 + Math.floor(Math.random() * 200);
            const seed = page * 10 + i;

            const div = document.createElement('div');
            div.classList.add('grid-item');

            const img = document.createElement('img');
            img.src = `https://picsum.photos/${width}/${height}?random=${seed}`;
            img.alt = `Image ${seed}`;

            div.appendChild(img);
            newItems.push(div);
        }

        newItems.forEach(item => grid.appendChild(item));

        imagesLoaded(grid, () => {
            msnry.appended(newItems);
            msnry.layout();
            loading = false;
        });
    }

    // Scroll listener for infinite scroll
    window.addEventListener('scroll', () => {
        if (loading) return;

        if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 300)) {
            loadMoreItems();
        }
    });
});
