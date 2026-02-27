// script.js
// Gallery images array
const images = [
  { src: 'img01.webp', caption: 'Group class at Nugegoda' },
  { src: 'img01.webp', caption: 'Literature discussion' },
  { src: 'img01.webp', caption: 'Online session' }
];

let currentImageIndex = 0;
let imageInterval = null;
let tabAutoInterval = null;
let galleryActive = false;

// DOM elements
const carouselImg = document.getElementById('carouselImage');
const dotsContainer = document.getElementById('carouselDots');
const tabs = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.modal-close');

// Initialize gallery dots
function initDots() {
  dotsContainer.innerHTML = '';
  images.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === currentImageIndex) dot.classList.add('active');
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      setImageIndex(i);
    });
    dotsContainer.appendChild(dot);
  });
}

// Set image by index
function setImageIndex(index) {
  currentImageIndex = index;
  carouselImg.src = images[index].src;
  carouselImg.alt = images[index].caption;
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// Next image (for auto rotation)
function nextImage() {
  const next = (currentImageIndex + 1) % images.length;
  setImageIndex(next);
  // If we wrapped around to first image, switch tab back to info after a short delay
  if (next === 0 && galleryActive) {
    // Wait a moment to show the first image again, then switch
    setTimeout(() => {
      if (galleryActive) {
        activateTab(0); // switch to info tab
      }
    }, 500);
  }
}

// Start image rotation (only if gallery tab active)
function startImageRotation() {
  if (imageInterval) clearInterval(imageInterval);
  if (galleryActive) {
    imageInterval = setInterval(nextImage, 4000);
  }
}

function stopImageRotation() {
  if (imageInterval) {
    clearInterval(imageInterval);
    imageInterval = null;
  }
}

// Tab activation
function activateTab(index) {
  tabs.forEach((t, i) => t.classList.toggle('active', i === index));
  panels.forEach((p, i) => p.classList.toggle('active', i === index));
  
  // Update gallery active state and image rotation
  galleryActive = (index === 1); // gallery tab index 1
  if (galleryActive) {
    startImageRotation();
  } else {
    stopImageRotation();
    // Reset image index to first when leaving gallery
    currentImageIndex = 0;
    setImageIndex(0);
  }
}

// Next tab for auto rotation
function nextTab() {
  const next = (currentTabIndex + 1) % tabs.length;
  activateTab(next);
  currentTabIndex = next;
}

// Start main tab auto-rotation
function startTabAutoRotate() {
  if (tabAutoInterval) clearInterval(tabAutoInterval);
  tabAutoInterval = setInterval(nextTab, 6000);
}

// Track current tab index
let currentTabIndex = 0;

// Observe carousel block to start auto-rotate when visible
const carouselBlock = document.querySelector('.carousel-block');
if (carouselBlock) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTabAutoRotate();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(carouselBlock);
}

// Manual tab click
tabs.forEach((tab, idx) => {
  tab.addEventListener('click', () => {
    clearInterval(tabAutoInterval);
    activateTab(idx);
    currentTabIndex = idx;
    // Restart auto-rotate after a delay
    setTimeout(() => {
      startTabAutoRotate();
    }, 5000);
  });
});

// Initialize gallery
initDots();
setImageIndex(0);

// Modal functions
function openModal(src) {
  modalImg.src = src;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  modalImg.src = '';
  document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    modalImg.src = '';
    document.body.style.overflow = 'auto';
  }
});

// Typewriter for WhatsApp bubble
const bubble = document.getElementById('chatBubble');
const typeSpan = document.getElementById('typewriterSpan');
const msg = 'Enroll now...';
let i = 0;
let deleting = false;

function typewriter() {
  if (!deleting && i <= msg.length) {
    typeSpan.textContent = msg.substring(0, i);
    i++;
    if (i > msg.length) {
      deleting = true;
      setTimeout(typewriter, 2000);
      return;
    }
  } else if (deleting && i >= 0) {
    typeSpan.textContent = msg.substring(0, i);
    i--;
    if (i < 0) {
      deleting = false;
      i = 0;
      setTimeout(typewriter, 400);
      return;
    }
  }
  setTimeout(typewriter, deleting ? 70 : 120);
}

setTimeout(() => {
  bubble.classList.add('visible');
  setTimeout(typewriter, 400);
}, 800);

// Image error fallback
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    if (!this.dataset.fallback && this.src && !this.src.includes('placeholder')) {
      this.dataset.fallback = 'true';
      this.src = 'https://via.placeholder.com/400/9f7aea/ffffff?text=AKH';
    }
  });
});

// Make carousel image clickable for modal
carouselImg.addEventListener('click', () => openModal(carouselImg.src));

