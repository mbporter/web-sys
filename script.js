document.addEventListener('DOMContentLoaded', function() {
    const scrollContent = document.querySelector('.scroll-items');

    // Clone the items to create a seamless loop
    const items = scrollContent.innerHTML;
    scrollContent.innerHTML = items + items;

    // Function to restart animation when it ends
    function restartAnimation() {
        scrollContent.style.animation = 'none';
        scrollContent.offsetHeight; // Trigger reflow
        scrollContent.style.animation = null;
    }

    // Listen for animation end and restart
    scrollContent.addEventListener('animationend', restartAnimation);

    // Optional: Adjust scroll speed based on screen width
    function updateScrollSpeed() {
        const width = window.innerWidth;
        const baseSpeed = 45; // Base animation duration in seconds
        const speedFactor = Math.max(0.5, Math.min(1.5, width / 1000));
        scrollContent.style.animationDuration = `${baseSpeed * speedFactor}s`;
    }

    // Update speed on resize
    window.addEventListener('resize', updateScrollSpeed);
    updateScrollSpeed(); // Initial speed set
});