// Consolidated and cleaned-up script
document.addEventListener('DOMContentLoaded', () => {
    // --- Infinite scroll setup (if present) ---
    const scrollContent = document.querySelector('.scroll-items');
    if (scrollContent) {
        // Duplicate items to create a seamless loop
        scrollContent.innerHTML = scrollContent.innerHTML + scrollContent.innerHTML;

        // Restart animation on end (keeps it smooth)
        scrollContent.addEventListener('animationend', () => {
            scrollContent.style.animation = 'none';
            // force reflow
            // eslint-disable-next-line no-unused-expressions
            scrollContent.offsetHeight;
            scrollContent.style.animation = null;
        });

        // Adjust scroll speed based on width
        const updateScrollSpeed = () => {
            const width = window.innerWidth;
            const base = 45; // seconds
            const factor = Math.max(0.5, Math.min(1.5, width / 1000));
            scrollContent.style.animationDuration = `${base * factor}s`;
        };
        window.addEventListener('resize', updateScrollSpeed);
        updateScrollSpeed();
    }

    // --- Flipbook (single image view) ---
    const images = [
        'images/cd/1.PNG', 'images/cd/2.PNG', 'images/cd/3.PNG', 'images/cd/4.PNG',
        'images/cd/5.PNG', 'images/cd/6.PNG', 'images/cd/7.PNG', 'images/cd/8.PNG',
        'images/cd/9.PNG', 'images/cd/10.PNG', 'images/cd/11.PNG', 'images/cd/132.PNG',
        'images/cd/Capture.PNG'
    ];

    const pageImgLeft = document.getElementById('page-img-left');
    const pageImgRight = document.getElementById('page-img-right');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const flipbookPages = document.getElementById('flipbook-pages');
    const flipbookTitle = document.getElementById('flipbook-title');
    const flipbookDesc = document.getElementById('flipbook-desc');

    // If required elements don't exist, stop gracefully
    if (!pageImgLeft || !prevBtn || !nextBtn || !flipbookPages) return;

    // Hide the right image so flipbook shows only one image at a time
    if (pageImgRight) pageImgRight.style.display = 'none';

    let currentIndex = 0;

    // Metadata for each image (title + description). Keep order in sync with `images` array.
    const metadata = [
        { title: 'SlowDive — When the Sun Hits', desc: "Shoegaze classic in Mac's collection. Beautiful textures and dreamy vocals." },
        { title: 'CD: 2', desc: 'An eclectic pick — approachable and melodic.' },
        { title: 'CD: 3', desc: 'Indie favorite — crunchy guitars and memorable hooks.' },
        { title: 'CD: 4', desc: 'A deep cut with a cult following.' },
        { title: 'CD: 5', desc: 'Lo-fi gem collected in person.' },
        { title: 'CD: 6', desc: 'A great record for rainy evenings.' },
        { title: 'CD: 7', desc: 'Rare find from a local shop.' },
        { title: 'CD: 8', desc: 'Bright, energetic pop punk vibes.' },
        { title: 'CD: 9', desc: 'Melancholic and memorable tracks.' },
        { title: 'CD: 10', desc: 'A favorite for road trips.' },
        { title: 'CD: 11', desc: 'An influential album from the scene.' },
        { title: 'CD: 12', desc: 'Unique packaging and great liner notes.' },
        { title: 'CD: Capture', desc: 'A standout piece from the collection.' }
    ];

    // Create page buttons (one per image)
    const pageButtons = images.map((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'page-btn';
        btn.textContent = (i + 1);
        btn.addEventListener('click', () => animateFlip('jump', i));
        flipbookPages.appendChild(btn);
        return btn;
    });

    function updateActiveButton() {
        pageButtons.forEach((b, i) => b.classList.toggle('active', i === currentIndex));
    }

    function updatePage() {
        // fallback image on error
        pageImgLeft.onerror = () => { pageImgLeft.src = 'images/oops.png'; };
        pageImgLeft.src = images[currentIndex] || 'images/oops.png';
        updateActiveButton();
        // Update info panel if present
        if (flipbookTitle && flipbookDesc) {
            const meta = metadata[currentIndex] || { title: '', desc: '' };
            flipbookTitle.textContent = meta.title;
            flipbookDesc.textContent = meta.desc;
        }
    }

    function animateFlip(direction, target = null) {
        pageImgLeft.classList.remove('flip-in', 'flip-out');

        if (direction === 'next' || direction === 'jump') {
            pageImgLeft.classList.add('flip-out');
        } else if (direction === 'prev') {
            pageImgLeft.classList.add('flip-in');
        }

        setTimeout(() => {
            if (direction === 'jump' && typeof target === 'number') {
                currentIndex = target;
            } else if (direction === 'next') {
                currentIndex = Math.min(images.length - 1, currentIndex + 1);
            } else if (direction === 'prev') {
                currentIndex = Math.max(0, currentIndex - 1);
            }
            updatePage();
            pageImgLeft.classList.remove('flip-in', 'flip-out');
        }, 450);
    }

    prevBtn.addEventListener('click', () => animateFlip('prev'));
    nextBtn.addEventListener('click', () => animateFlip('next'));

    // Initialize
    updatePage();
});
