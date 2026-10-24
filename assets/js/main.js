/* ==========================================================================
   Kaizen Built-On Systems - Interactive JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('show');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('show') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('show');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Navbar Shadow on Scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Smooth Scroll for Nav Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (navLinks) {
          navLinks.classList.remove('show');
          if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
        
        const headerOffset = window.innerWidth <= 768 ? 68 : 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. Testimonials Carousel / Slider
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dots = document.querySelectorAll('.slider-dots .dot');

  let currentSlide = 0;

  function updateCarousel() {
    if (!testimonialCards.length) return;
    
    // For responsive displays (mobile vs desktop)
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    testimonialCards.forEach((card, index) => {
      if (isMobile) {
        card.style.display = (index === currentSlide) ? 'flex' : 'none';
      } else if (isTablet) {
        const isVisible = index >= currentSlide && index < currentSlide + 2;
        card.style.display = isVisible ? 'flex' : 'none';
      } else {
        card.style.display = 'flex'; // show all 4 on desktop
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide > 0) ? currentSlide - 1 : dots.length - 1;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide < dots.length - 1) ? currentSlide + 1 : 0;
      updateCarousel();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateCarousel();
    });
  });

  // Touch swipe support for testimonials on mobile
  const testimonialsGrid = document.querySelector('.testimonials-grid');
  if (testimonialsGrid) {
    let tStartX = 0;
    let tStartY = 0;
    let tEndX = 0;
    let tEndY = 0;

    testimonialsGrid.addEventListener('touchstart', (e) => {
      tStartX = e.changedTouches[0].screenX;
      tStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    testimonialsGrid.addEventListener('touchend', (e) => {
      tEndX = e.changedTouches[0].screenX;
      tEndY = e.changedTouches[0].screenY;
      const diffX = tEndX - tStartX;
      const diffY = tEndY - tStartY;

      // Ensure horizontal swipe is more significant than vertical scroll
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) {
          // Swipe left -> Next
          currentSlide = (currentSlide < dots.length - 1) ? currentSlide + 1 : 0;
        } else {
          // Swipe right -> Prev
          currentSlide = (currentSlide > 0) ? currentSlide - 1 : dots.length - 1;
        }
        updateCarousel();
      }
    }, { passive: true });
  }

  // Toggle Extra Industries on Mobile/Desktop
  const viewAllIndustriesBtn = document.getElementById('viewAllIndustriesBtn');
  const extraIndustry = document.querySelector('.extra-industry');
  if (viewAllIndustriesBtn && extraIndustry) {
    viewAllIndustriesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = extraIndustry.style.display === 'none' || extraIndustry.style.display === '';
      if (isHidden) {
        extraIndustry.style.display = 'flex';
        viewAllIndustriesBtn.textContent = 'Show Less \u2191';
      } else {
        extraIndustry.style.display = 'none';
        viewAllIndustriesBtn.innerHTML = 'View All Industries &rarr;';
      }
    });
  }

  window.addEventListener('resize', updateCarousel);
  updateCarousel();

  // 5. Contact Form Handling (2-Step Multi-Step Form)
  const discoveryForm = document.getElementById('discoveryForm');
  const formStep1 = document.getElementById('formStep1');
  const formStep2 = document.getElementById('formStep2');
  const nextStepBtn = document.getElementById('nextStepBtn');
  const prevStepBtn = document.getElementById('prevStepBtn');
  const stepPill1 = document.getElementById('stepPill1');
  const stepPill2 = document.getElementById('stepPill2');
  const stepConnector = document.getElementById('stepConnector');

  function validateStep1() {
    if (!formStep1) return false;
    const inputs = formStep1.querySelectorAll('input, select');
    for (let input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        input.focus();
        return false;
      }
    }
    return true;
  }

  function goToStep(step) {
    if (step === 2) {
      if (!validateStep1()) return;
      formStep1.classList.remove('active');
      formStep2.classList.add('active');

      if (stepPill1) {
        stepPill1.classList.remove('active');
        stepPill1.classList.add('completed');
        const c1 = stepPill1.querySelector('.step-circle');
        if (c1) c1.innerHTML = '&#10003;';
      }
      if (stepConnector) stepConnector.classList.add('active');
      if (stepPill2) {
        stepPill2.classList.add('active');
        stepPill2.classList.remove('completed');
      }
    } else if (step === 1) {
      if (formStep2) formStep2.classList.remove('active');
      if (formStep1) formStep1.classList.add('active');

      if (stepPill1) {
        stepPill1.classList.add('active');
        stepPill1.classList.remove('completed');
        const c1 = stepPill1.querySelector('.step-circle');
        if (c1) c1.textContent = '1';
      }
      if (stepConnector) stepConnector.classList.remove('active');
      if (stepPill2) {
        stepPill2.classList.remove('active');
        stepPill2.classList.remove('completed');
      }
    }
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      goToStep(2);
    });
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
      goToStep(1);
    });
  }

  if (stepPill1) {
    stepPill1.addEventListener('click', () => {
      goToStep(1);
    });
  }

  if (stepPill2) {
    stepPill2.addEventListener('click', () => {
      goToStep(2);
    });
  }

  // Expose step navigation globally for mail.js
  window.goToFormStep = goToStep;
  window.validateFormStep1 = validateStep1;

  // 6. Active Navigation Link Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  // 7. Service Pillars Scroll-Driven Showcase (Cards Change on Scroll)
  const servicePillarsSection = document.getElementById('what-we-do');
  const deckCards = document.querySelectorAll('.deck-card');
  const stepperDots = document.querySelectorAll('.stepper-dot');
  const stepperProgress = document.getElementById('stepperProgress');
  const pillarNavItems = document.querySelectorAll('.pillar-nav-item');

  if (servicePillarsSection && deckCards.length > 0) {
    let currentPillar = 0;
    const totalPillars = deckCards.length;
    let isClickScrolling = false;
    let clickScrollTimer = null;

    function updatePillarDisplay(index) {
      currentPillar = Math.max(0, Math.min(index, totalPillars - 1));

      // 1. Update Cards
      deckCards.forEach((card, idx) => {
        card.classList.toggle('active', idx === currentPillar);
      });

      // 2. Update Stepper Dots
      stepperDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentPillar);
      });
    }

    function onScrollPillars() {
      if (isClickScrolling) return;

      const rect = servicePillarsSection.getBoundingClientRect();
      const navbarHeight = window.innerWidth <= 768 ? 68 : 80;

      const totalScrollable = servicePillarsSection.offsetHeight - (window.innerHeight - navbarHeight);
      if (totalScrollable <= 0) return;

      // Scrolled distance within the pinned section
      const scrolled = -(rect.top - navbarHeight);
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      // Update stepper line progress smoothly (vertical line)
      if (stepperProgress) {
        stepperProgress.style.width = '100%';
        stepperProgress.style.height = `${progress * 100}%`;
      }

      // Determine active card based on scroll progress
      const targetIndex = Math.min(totalPillars - 1, Math.floor(progress * totalPillars));
      if (targetIndex !== currentPillar) {
        updatePillarDisplay(targetIndex);
      }
    }

    window.addEventListener('scroll', onScrollPillars, { passive: true });

    // Smooth scroll to specific card when clicking stepper dots
    function scrollToPillar(idx) {
      updatePillarDisplay(idx);

      const navbarHeight = window.innerWidth <= 768 ? 68 : 80;
      const totalScrollable = servicePillarsSection.offsetHeight - (window.innerHeight - navbarHeight);
      const sectionTop = servicePillarsSection.offsetTop;
      
      // Target segment for that pillar
      const segmentSize = totalScrollable / totalPillars;
      const targetScroll = sectionTop - navbarHeight + (idx * segmentSize) + (segmentSize * 0.2);

      isClickScrolling = true;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });

      clearTimeout(clickScrollTimer);
      clickScrollTimer = setTimeout(() => {
        isClickScrolling = false;
      }, 750);
    }

    // Attach click events to stepper dots
    stepperDots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToPillar(idx);
      });
    });

    // Touch swipe support for mobile
    const cardsDeckWrapper = document.getElementById('pillarsDeckWrapper');
    if (cardsDeckWrapper) {
      let touchStartX = 0;
      let touchEndX = 0;

      cardsDeckWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      cardsDeckWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 40;
        if (touchEndX < touchStartX - threshold) {
          // Swipe left -> Next
          scrollToPillar(Math.min(totalPillars - 1, currentPillar + 1));
        } else if (touchEndX > touchStartX + threshold) {
          // Swipe right -> Prev
          scrollToPillar(Math.max(0, currentPillar - 1));
        }
      }, { passive: true });
    }

    // Handle resize
    window.addEventListener('resize', () => {
      onScrollPillars();
    });

    // Initial setup
    updatePillarDisplay(0);
    onScrollPillars();
  }

  // 8. Animated Number Increment Counter
  const counterElements = document.querySelectorAll('.counter');

  if (counterElements.length > 0) {
    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const duration = parseInt(el.getAttribute('data-duration') || '1600', 10);
      const isInteger = Number.isInteger(target);
      const startTime = performance.now();

      // Smooth cubic-out easing curve for natural, polished deceleration
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentVal = easedProgress * target;

        if (isInteger) {
          el.textContent = Math.round(currentVal).toLocaleString();
        } else {
          el.textContent = currentVal.toFixed(1);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = isInteger ? target.toLocaleString() : target.toFixed(1);
          el.classList.add('bump');
        }
      };

      requestAnimationFrame(updateCount);
    };

    // Use IntersectionObserver to trigger counting when element scrolls into view
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const isHero = entry.target.closest('.hero-stats-row');
          const delay = isHero ? 350 : 100;

          setTimeout(() => {
            animateCounter(entry.target);
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -20px 0px'
    });

    counterElements.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  // 9. Bottom-to-Top Section Arrival Scroll Animations
  document.body.classList.add('reveal-animations-active');

  const revealSections = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealSections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          entry.target.addEventListener('transitionend', () => {
            entry.target.classList.add('reveal-done');
          }, { once: true });
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      // If section is already visible or near top on load/refresh, reveal smoothly
      if (rect.top < window.innerHeight - 30) {
        setTimeout(() => {
          section.classList.add('is-revealed');
        }, 80);
      } else {
        sectionObserver.observe(section);
      }
    });
  } else {
    revealSections.forEach(section => section.classList.add('is-revealed'));
  }
});

