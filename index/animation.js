// Get elements
const card = document.getElementById('card');
  
// Flip on hover with GSAP
card.addEventListener('mouseenter', () => {
  gsap.to(card, {
    rotationY: 180,
    duration: 1,
    ease: "power2.inOut"
  });
});

// Reset flip when hover ends
card.addEventListener('mouseleave', () => {
  gsap.to(card, {
    rotationY: 0,
    duration: 1,
    ease: "power2.inOut"
  });
});

// Script to toggle mobile menu

const toggleBtn = document.getElementById('menu-toggle');
const menu = document.getElementById('mobile-menu');

toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});
