// script.js
// Gallery images
const images = [
  { src: 'img01.webp', caption: 'Group class at Nugegoda' },
  { src: 'img02.webp', caption: 'Literature discussion' },
  { src: 'img03.webp', caption: 'Online session' }
];

const grid = document.getElementById('imageGrid');
if (grid) {
  grid.innerHTML = images.map((img, i) => `
    <div class="image-item" data-index="${i}">
      <img src="${img.src}" alt="${img.caption}" loading="lazy" onerror="this.src='https://via.placeholder.com/300/9f7aea/ffffff?text=Image+${i+1}'">
      <div class="image-caption"><i class="fas fa-expand"></i> ${img.caption}</div>
    </div>
  `).join('');
}

// Modal
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.modal-close');

document.body.addEventListener('click', (e) => {
  const item = e.target.closest('.image-item');
  if (item) {
    const idx = item.dataset.index;
    if (idx !== undefined && images[idx]) {
      modalImg.src = images[idx].src;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }
});

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

// Carousel tabs
const tabs = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');
let currentIndex = 0;
let autoInterval;

function activateTab(index) {
  tabs.forEach((t, i) => t.classList.toggle('active', i === index));
  panels.forEach((p, i) => p.classList.toggle('active', i === index));
  currentIndex = index;
}

function nextTab() {
  const next = (currentIndex + 1) % tabs.length;
  activateTab(next);
}

function startAutoRotate() {
  if (autoInterval) clearInterval(autoInterval);
  autoInterval = setInterval(nextTab, 6000);
}

const carousel = document.querySelector('.carousel-block');
if (carousel) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAutoRotate();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(carousel);
}

tabs.forEach((tab, idx) => {
  tab.addEventListener('click', () => {
    clearInterval(autoInterval);
    activateTab(idx);
    setTimeout(() => {
      startAutoRotate();
    }, 5000);
  });
});

activateTab(0);

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
    if (!this.dataset.fallback) {
      this.dataset.fallback = 'true';
      this.src = 'https://via.placeholder.com/400/9f7aea/ffffff?text=AKH';
    }
  });
});