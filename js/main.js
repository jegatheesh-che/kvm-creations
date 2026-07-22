/* ================================================
   KVM Creations — main.js
   GSAP + Lenis + vanilla scroll reveal + cursor
   ================================================ */

// --- Lenis smooth scroll (Standard Configuration) ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.8
});

// --- GSAP ScrollTrigger sync ---
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

// Body smooth load class
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
});

// -----------------------------------------------
// NAV: scroll state
// -----------------------------------------------
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Active link
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav__link, .nav__mobile .nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === path || (path === '' && href === 'index.html') || path.includes(href.replace('.html', '')))) {
      link.classList.add('active');
    }
  });
}

// -----------------------------------------------
// MOBILE MENU
// -----------------------------------------------
const burger = document.querySelector('.nav__burger');
const mobileMenu = document.querySelector('.nav__mobile');
const mobileLinks = document.querySelectorAll('.nav__mobile .nav__link');
const mobileSocials = document.querySelectorAll('.nav__mobile-social a');

if (burger && mobileMenu) {
  // Setup GSAP timeline
  const tl = gsap.timeline({ paused: true, reversed: true });
  
  tl.to(mobileMenu, {
    opacity: 1,
    duration: 0.5,
    ease: "power2.inOut",
    onStart: () => {
      mobileMenu.style.pointerEvents = "all";
      document.body.style.overflow = "hidden";
    },
    onReverseComplete: () => {
      mobileMenu.style.pointerEvents = "none";
      document.body.style.overflow = "";
    }
  })
  .fromTo(mobileLinks, 
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
    "-=0.2"
  )
  .fromTo(mobileSocials,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
    "-=0.6"
  );

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    if (tl.reversed()) {
      tl.play();
    } else {
      tl.reverse();
    }
  });

  mobileMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      tl.reverse();
    });
  });
}

// -----------------------------------------------
// CUSTOM CURSOR (desktop fine pointer)
// -----------------------------------------------
if (window.matchMedia('(pointer: fine)').matches) {
  const ring = document.querySelector('.cursor__ring');
  const dot  = document.querySelector('.cursor__dot');
  if (ring && dot) {
    let mx = 0, my = 0;
    let rx = 0, ry = 0;
    let isHovered = false;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    });

    function animateRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      const scale = isHovered ? 'scale(1.8)' : 'scale(1)';
      ring.style.transform = `translate3d(${rx - 14}px, ${ry - 14}px, 0) ${scale}`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .gallery-card, .collage-item, .filter-btn').forEach(el => {
      el.addEventListener('mouseenter', () => isHovered = true);
      el.addEventListener('mouseleave', () => isHovered = false);
    });
  }
}

// -----------------------------------------------
// SCROLL REVEAL (IntersectionObserver)
// -----------------------------------------------
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
}


// -----------------------------------------------
// STORY THUMBNAILS
// -----------------------------------------------
document.querySelectorAll('.story-item').forEach(item => {
  const mainImg = item.querySelector('.story-item__image-main');
  const thumbs  = item.querySelectorAll('.story-item__thumb');
  if (!mainImg || !thumbs.length) return;
  thumbs[0].classList.add('active');
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const newSrc = thumb.dataset.full || thumb.src;
      gsap.to(mainImg, { opacity: 0, duration: 0.3, onComplete: () => {
        mainImg.src = newSrc;
        gsap.to(mainImg, { opacity: 1, duration: 0.4 });
      }});
    });
  });
});

// -----------------------------------------------
// INITIAL ENTRANCE LOGIC
// -----------------------------------------------
function startWebsiteEntrance() {
  // Fade in body on load
  gsap.from('body', { opacity: 0, duration: 0.5, ease: 'power2.out' });


  // Hero title entrance if present (for other pages)
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    gsap.from(heroTitle, { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.3 });
  }
}

// Start immediately on load
startWebsiteEntrance();

// Page nav links with GSAP fade
document.querySelectorAll('.nav__link[href]').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
    e.preventDefault();
    gsap.to('body', {
      opacity: 0, duration: 0.35, ease: 'power2.in',
      onComplete: () => { window.location.href = href; }
    });
  });
});

// --- SHINY HOVER WRAPPER ---
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img:not(.nav__logo-img, .cursor__img, .home-about__logo, .video-badge img, .round-badge img)').forEach(el => {
    const wrapper = document.createElement('div');
    wrapper.className = 'shiny-wrapper';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  });
});

// --- ROUND BADGE IMAGE CROSSFADE ---
document.addEventListener('DOMContentLoaded', () => {
  const badgeImages = document.querySelectorAll('.round-badge .fade-img');
  if(badgeImages.length > 0) {
    let currentIdx = 0;
    setInterval(() => {
      badgeImages[currentIdx].classList.remove('active');
      currentIdx = (currentIdx + 1) % badgeImages.length;
      badgeImages[currentIdx].classList.add('active');
    }, 2500);
  }
});

// --- FOOTER QUOTE ROTATION ---
document.addEventListener('DOMContentLoaded', () => {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const quoteBox = document.querySelector('.footer__quote');
  
  if (quoteText && quoteAuthor && quoteBox) {
    const quotes = [
      { text: '"I think... if it is true that there are as many minds as there are heads, then there are as many kinds of love as there are hearts."', author: '— Leo Tolstoy' },
      { text: '"Photography takes an instant out of time, altering life by holding it still."', author: '— Dorothea Lange' },
      { text: '"To me, photography is an art of observation. It’s about finding something interesting in an ordinary place."', author: '— Elliott Erwitt' }
    ];
    
    let currentIdx = 0;
    setInterval(() => {
      quoteBox.classList.add('fade-out');
      
      setTimeout(() => {
        currentIdx = (currentIdx + 1) % quotes.length;
        quoteText.textContent = quotes[currentIdx].text;
        quoteAuthor.textContent = quotes[currentIdx].author;
        quoteBox.classList.remove('fade-out');
      }, 800);
    }, 3500);
  }
});


// Global Preloader Logic
// Global Preloader Logic Removed - Simply trigger entrance
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    
    const heroVid = document.getElementById('hero-reveal-video');
    if (heroVid) {
        heroVid.play().catch(e => console.log('Autoplay prevented:', e));
    }
});

// Entrance triggered automatically by DOMContentLoaded above

// -----------------------------------------------
// HERO VIDEO MUTE TOGGLE
// -----------------------------------------------
const heroVideo = document.getElementById('hero-reveal-video');
const muteBtn = document.getElementById('hero-mute-btn');

if (heroVideo && muteBtn) {
    muteBtn.addEventListener('click', () => {
        const iconMuted = muteBtn.querySelector('.icon-muted');
        const iconUnmuted = muteBtn.querySelector('.icon-unmuted');
        
        if (heroVideo.muted) {
            heroVideo.muted = false;
            if (iconMuted) iconMuted.style.display = 'none';
            if (iconUnmuted) iconUnmuted.style.display = 'block';
            muteBtn.setAttribute('aria-label', 'Mute video');
        } else {
            heroVideo.muted = true;
            if (iconMuted) iconMuted.style.display = 'block';
            if (iconUnmuted) iconUnmuted.style.display = 'none';
            muteBtn.setAttribute('aria-label', 'Unmute video');
        }
    });
}


// -----------------------------------------------
// ABOUT SECTION - VOGUE REVEAL
// -----------------------------------------------
const vogueWrap = document.querySelector('.vogue-wrap');
if (vogueWrap) {
  const mask = vogueWrap.querySelector('.vogue-mask');
  const img = vogueWrap.querySelector('.vogue-parallax img');

  // 1. The Mask Reveal
  gsap.to(mask, {
    scaleY: 0,
    transformOrigin: 'top',
    ease: 'power3.inOut',
    duration: 1.5,
    scrollTrigger: {
      trigger: vogueWrap,
      start: 'top 80%'
    }
  });

  // 2. The Image Parallax
  gsap.fromTo(img, 
    { yPercent: -10 },
    {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: vogueWrap,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );
}

// -----------------------------------------------
// GALLERY PAGE FILTERING & LIGHTBOX MODAL
// -----------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-masonry .gallery-card');
  
  if (filterBtns.length > 0 && galleryCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        galleryCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'block';
            gsap.to(card, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: 'power2.out'
            });
          } else {
            gsap.to(card, {
              opacity: 0,
              scale: 0.85,
              duration: 0.3,
              ease: 'power2.in',
              onComplete: () => { card.style.display = 'none'; }
            });
          }
        });
      });
    });
  }

  // LIGHTBOX MODAL LOGIC
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxSub = lightbox.querySelector('.lightbox-sub');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox-nav--next');
    
    let activeCardsArray = [];
    let currentIndex = 0;
    
    function updateLightboxContent(idx) {
      if (idx < 0 || idx >= activeCardsArray.length) return;
      currentIndex = idx;
      const card = activeCardsArray[currentIndex];
      const rawCat = card.getAttribute('data-category') || 'Portfolio';
      const cat = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
      const title = card.getAttribute('data-title') || img?.alt || 'KVM Showcase';
      
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = title;
      }
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxSub) lightboxSub.textContent = cat;
    }

    function openLightbox(card) {
      const visibleCards = Array.from(document.querySelectorAll('.gallery-masonry .gallery-card')).filter(
        c => window.getComputedStyle(c).display !== 'none'
      );
      activeCardsArray = visibleCards.length > 0 ? visibleCards : Array.from(document.querySelectorAll('.gallery-masonry .gallery-card'));
      
      currentIndex = activeCardsArray.indexOf(card);
      if (currentIndex === -1) currentIndex = 0;
      
      updateLightboxContent(currentIndex);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.gallery-card, .collage-item').forEach(card => {
      card.addEventListener('click', () => openLightbox(card));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevIdx = (currentIndex - 1 + activeCardsArray.length) % activeCardsArray.length;
        updateLightboxContent(prevIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextIdx = (currentIndex + 1) % activeCardsArray.length;
        updateLightboxContent(nextIdx);
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
  }
});

// -----------------------------------------------
// LUXURY EDITORIAL SPLIT ANIMATIONS (002-LUXURY-EDITORIAL-SPLIT)
// -----------------------------------------------
if (document.querySelector('.hero__layout')) {
  window.addEventListener('DOMContentLoaded', () => {
    const editorialTl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // 1. Reveal image via clip-path
    editorialTl.fromTo('.hero__image-wrapper', 
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 }
    );

    // 2. Line-by-line staggered title reveal
    editorialTl.fromTo('.hero__title',
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
      "-=0.7"
    );

    // 3. Staggered reveal of eyebrow, description, and CTA
    editorialTl.fromTo(['.hero__eyebrow', '.hero__desc', '.hero__cta'],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 },
      "-=0.6"
    );
  });
}

// -----------------------------------------------
// CLICK TO COPY CONTACT INTERACTIVITY
// -----------------------------------------------
document.querySelectorAll('.js-copy-card').forEach(card => {
  card.addEventListener('click', () => {
    const textToCopy = card.getAttribute('data-copy');
    const typeLabel = card.getAttribute('data-type') || 'Contact';
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        const toast = document.getElementById('copyToast');
        if (toast) {
          toast.textContent = `Copied ${typeLabel} to Clipboard!`;
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2500);
        }
      }).catch(() => {
        const toast = document.getElementById('copyToast');
        if (toast) {
          toast.textContent = `${textToCopy}`;
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2500);
        }
      });
    }
  });
});

// -----------------------------------------------
// MOBILE APP BOTTOM DOCK SCROLL LOGIC
// -----------------------------------------------
let lastScrollYVal = window.scrollY;
const bottomNavEl = document.getElementById('mobileBottomNav');
if (bottomNavEl) {
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 120 && currentScrollY > lastScrollYVal + 10) {
      bottomNavEl.classList.add('nav-hidden');
    } else {
      bottomNavEl.classList.remove('nav-hidden');
    }
    lastScrollYVal = currentScrollY;
  }, { passive: true });
}

