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
    // Add YouTube video IDs for favorite tracks
    const metadata = [
        { title: 'Slowdive - Souvlaki', desc: "I love Slowdive and was very happy to find this CD in person! My favorite track from this album is 'When the Sun Hits.' Give it a listen.", youtube: 'MKYY0IlTMw4', start: 1 },
        { title: 'Orbiting Human Circus - Quartet Plus Two', desc: 'The Orbiting Human Circus along with The Music Tapes are certainly a unique sound and I love them for it! This was a great find in person after I tried to order it online. My favorite track is "Let’s Face the Music!" If you want to listen to something probably out of your comfort zone, they are for you!', youtube: 'sJe5YGTibfE', start: 1 },
        { title: 'Elliott Smith - Kill Rock Stars (or Self-Titled)', desc: 'Elliott Smith has always been a long-time favorite. Though this isn’t his most popular album, it is a must-listen. Not a single skip in this album. My favorite track is "Clementine."', youtube: '7mUeCIF_EjA', start: 0 },
        { title: 'Elliott Smith - Either/Or', desc: 'Undeniably Elliott Smith’s most popular album and for good reason. If you have heard one of his songs, it’s most likely from this album. My favorite track has to be "Speed Trials," but it’s almost impossible for me to choose a favorite.', youtube: 'UuizNQUOFCI', start: 10 },
        { title: 'Duster - Stratosphere', desc: 'I would say Duster is definitely a band where you have to get familiar with their music. Stratosphere is their most popular album (I also have it on cassette). My favorite track is "Earth Moon Transit."', youtube: 'ffnKqbUgOcA', start: 0 },
        { title: 'Molchat Doma - Etazhi', desc: 'Definitely an album where you have to be in the know to be able to find it. A very worthwhile listen if you want to expand your taste! My favorite track is "Sudno (Boris Ryzhy)."', youtube: 'BZs-Uvjucno', start: 10 },
        { title: 'Nirvana - In Utero', desc: 'I am a MASSIVE Nirvana fan and I don’t think I’ll ever have a 100% favorite album, but this might just be it. This album was one of the first that I ever bought. My favorite track would be "Serve the Servants," the first track on the album!', youtube: 'AqT0mnA5xPs', start: 10 },
        { title: 'GingerBee - Our Skies Smile', desc: 'GingerBee is a smaller band that I somehow found on Spotify and then became mutuals with one of the band members on Instagram. Such a chill, cool band that I want to see in concert hopefully in the future. As an EP, it does have a shorter track list and my favorite track would have to be the title track "Our Skys Smile!"', youtube: 'Adah4iuNCko', start: 0 },
        { title: 'Neutral Milk Hotel - In the Aeroplane Over the Sea', desc: 'I would say this is one of the most incel albums in my collection (besides the Radiohead and Fight Club motion picture score), but it is still a great album if you ignore the somewhat strange messages. My favorite track would be the title track "In the Aeroplane Over the Sea."', youtube: 'r3DqBk9YNXA', start: 0 },
        { title: 'Malice Mizer - Best Songs', desc: 'Malice Mizer is a Japanese band that was active from 1992–2001. They were one of the most popular visual kei bands ever in the scene. As with many bands from that time, there was apparent drama and so on. As much as I want other albums from them, as they are an older band from Japan, they are incredibly hard to find in person or online for a good price. My favorite track that is featured on this collection would be "Au Revoir."', youtube: 'RcQCJfK2n-c', start: 0 },
        { title: 'American Football - American Football (LP2)', desc: 'Not my favorite American Football album, but others are harder to find! My favorite track from this LP would have to be "I Need a Drink (or Two or Three)."', youtube: 'Qmdx2VnMVFU', start: 35 },
        { title: 'Title Fight - Shed', desc: 'Title Fight is a very unassuming band where if you listen to their most popular song, you might be led astray with what you think their other music sounds like. But I must say, off this album my favorite (and it’s popular for a reason) would be "Safe In Your Skin."', youtube: 'F7fl_wO-lHs', start: 0 },
        { title: 'Nirvana - Bleach', desc: 'Yes, yes, another Nirvana album—wrap it up, but listen. Ok, I don’t have a real reason, I just love them. Bleach for some reason is pretty underrated compared to their other albums and I really don’t know why. If I had to guess, it would be because I think it is their most gritty album, but that is what makes it so great. My favorite track would have to be "Love Buzz."', youtube: 'Xm0qjrceeYE', start: 0 }
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
            const meta = metadata[currentIndex] || { title: '', desc: '', youtube: '' };
            flipbookTitle.textContent = meta.title;
            flipbookDesc.textContent = meta.desc;
            // Update YouTube player
            const ytFrame = document.getElementById('flipbook-yt');
            if (ytFrame && meta.youtube) {
                // Use YouTube embed with autoplay, mute (required for autoplay), and start time
                // User can unmute manually after autoplay begins
                const startParam = meta.start ? `&start=${meta.start}` : '';
                const embedUrl = `https://www.youtube.com/embed/${meta.youtube}?autoplay=1&mute=1&controls=1${startParam}`;
                console.log('Loading YouTube video:', embedUrl);
                ytFrame.src = embedUrl;
            } else if (ytFrame) {
                ytFrame.src = '';
            }
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
