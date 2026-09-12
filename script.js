/* ================== DYNAMIC FOOTER YEAR ================== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ================== MOBILE NAVIGATION TOGGLE ================== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
if (navToggle && navbar) {
  navToggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ================== ACTIVE NAV HIGHLIGHTING ================== */
(function setupNavHighlight() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  // Subpage matching (e.g. analystworkflow.html)
  navLinks.forEach(link => {
    const rawHref = link.getAttribute('href') || '';
    if (rawHref.startsWith('#')) return; // handled by scroll spy below
    const linkPath = rawHref.split('/').pop().split('#')[0] || 'index.html';
    if (linkPath === currentPath && currentPath !== 'index.html') {
      link.classList.add('active');
    }
  });

  // Scroll spy on index.html
  const sectionNavMap = {
    'hero': 'hero',
    'about': 'about',
    'skills': 'skills',
    'projects': 'projects',
    'other-projects': 'projects',
    'why-me': 'about',
    'contact': 'contact'
  };

  const trackedSections = document.querySelectorAll('main section[id], .hero[id]');
  const spyLinks = document.querySelectorAll('.nav-link[data-section]');

  if (!trackedSections.length || !spyLinks.length) return;

  function updateActiveNav() {
    const scrollPos = window.scrollY + 130; // 72px navbar height + margin buffer
    let activeId = 'hero';

    trackedSections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        activeId = section.id;
      }
    });

    // Check if bottom of page is reached
    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 50) {
      activeId = 'contact';
    }

    const mappedTarget = sectionNavMap[activeId] || activeId;

    spyLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === mappedTarget);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('load', updateActiveNav);
})();

/* ================== CHART.JS INITIALIZATIONS ================== */
if (window.Chart) {
  Chart.defaults.color = '#8D95B3';
  Chart.defaults.font.family = "'Inter', sans-serif";
}
const gridColor = '#3B4160';

// Mini gauge donuts
document.querySelectorAll('.gauge').forEach(canvas => {
  const value = Number(canvas.dataset.value) || 0;
  const color = canvas.dataset.color || '#5C85ED';
  new Chart(canvas, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [value, Math.max(0, 100 - value)],
        backgroundColor: [color, '#3B4160'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '78%',
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      animation: { duration: 900 }
    }
  });
});

// Featured Healthcare chart
const healthcareEl = document.getElementById('healthcareChart');
if (healthcareEl) {
  new Chart(healthcareEl, {
    type: 'line',
    data: {
      labels: ['Morning', 'Afternoon', 'Evening', 'Night', 'Weekend ICU', 'Emergency'],
      datasets: [
        { label: 'Required staff', data: [42, 38, 40, 30, 22, 26], borderColor: '#5C85ED', backgroundColor: 'rgba(92,133,237,0.15)', fill: true, tension: 0.35, pointRadius: 3 },
        { label: 'Actual staffed', data: [37, 36, 31, 21, 15, 19], borderColor: '#F07167', backgroundColor: 'rgba(240,113,103,0.15)', fill: true, tension: 0.35, pointRadius: 3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { boxWidth: 10, boxHeight: 10 } } },
      scales: { x: { grid: { color: gridColor } }, y: { grid: { color: gridColor }, beginAtZero: true } }
    }
  });
}

// Superstore chart
const superstoreEl = document.getElementById('superstoreChart');
if (superstoreEl) {
  const tiers = ['0-10%', '11-20%', '21-30%', '31%+'];
  const margins = [24, 12, -18, -48];
  new Chart(superstoreEl, {
    type: 'bar',
    data: {
      labels: tiers,
      datasets: [{
        label: 'Net margin %',
        data: margins,
        backgroundColor: margins.map(m => m < 0 ? '#F07167' : '#5C85ED'),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, ticks: { callback: v => v + '%' } } }
    }
  });
}

// Zepto chart
const zeptoEl = document.getElementById('zeptoChart');
if (zeptoEl) {
  new Chart(zeptoEl, {
    type: 'doughnut',
    data: {
      labels: ['FMCG', 'Produce', 'Snacks', 'Beverages'],
      datasets: [{
        data: [42, 28, 18, 12],
        backgroundColor: ['#5C85ED', '#B784EB', '#8B5CF6', '#F4A261'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, font: { size: 11 } } } }
    }
  });
}

// Restaurant chart
const restaurantEl = document.getElementById('restaurantChart');
if (restaurantEl) {
  new Chart(restaurantEl, {
    type: 'line',
    data: {
      labels: ['12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
      datasets: [{
        label: 'Orders',
        data: [30, 22, 18, 45, 68, 40],
        borderColor: '#B784EB',
        backgroundColor: 'rgba(183,132,235,0.18)',
        fill: true,
        tension: 0.4,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, beginAtZero: true } }
    }
  });
}

// Subpage charts (only fire if elements exist in DOM)
const revenueByRegionEl = document.getElementById('revenueByRegionChart');
if (revenueByRegionEl) {
  new Chart(revenueByRegionEl, {
    type: 'bar',
    data: {
      labels: ['West', 'East', 'Central', 'South'],
      datasets: [{ label: 'Revenue ($)', data: [725000, 678000, 501000, 391000], backgroundColor: '#5C85ED', borderRadius: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, ticks: { callback: v => '$' + (v / 1000) + 'k' } } }
    }
  });
}

const missingValuesEl = document.getElementById('missingValuesChart');
if (missingValuesEl) {
  new Chart(missingValuesEl, {
    type: 'bar',
    data: {
      labels: ['Staff ID', 'Shift Type', 'Overtime Hrs', 'Absence Flag', 'Department'],
      datasets: [
        { label: 'Before cleaning', data: [4, 12, 21, 9, 3], backgroundColor: '#F07167', borderRadius: 6 },
        { label: 'After cleaning', data: [0, 0, 0, 0, 0], backgroundColor: '#5C85ED', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { boxWidth: 10, boxHeight: 10 } } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, title: { display: true, text: 'Missing values (%)' } } }
    }
  });
}

/* ================== GSAP ANIMATIONS ================== */
(function () {
  if (!window.gsap) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  const heroTargets = ['.status-badge', '.hero-heading', '.hero-sub', '.hero-actions', '.hero-frame'];
  const heroEls = heroTargets.map(sel => document.querySelector(sel)).filter(Boolean);
  if (heroEls.length) {
    gsap.set(heroEls, { opacity: 0, y: 28 });
    gsap.to(heroEls, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      stagger: 0.12, delay: 0.1
    });
  }

  document.querySelectorAll('.section-heading, .page-hero h1, .page-hero p, .breadcrumb').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 24, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  const groupSelectors = ['.skill-hub-grid', '.skills-grid', '.case-grid', '.feature-grid', '.stat-row'];
  groupSelectors.forEach(groupSel => {
    document.querySelectorAll(groupSel).forEach(group => {
      const items = Array.from(group.children);
      if (!items.length) return;
      gsap.from(items, {
        opacity: 0, y: 30, duration: 0.6, ease: 'power2.out', stagger: 0.1,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true }
      });
    });
  });

  document.querySelectorAll('.case-featured, .chart-block, .contact-grid, .about-grid').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 32, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
})();

/* ================== CONTACT FORM HANDLER ================== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const statusEl = document.getElementById('formStatus');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const endpoint = contactForm.dataset.sheetEndpoint;
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    if (!endpoint || endpoint.startsWith('PASTE_')) {
      statusEl.textContent = "Form is not connected yet — please email directly.";
      statusEl.className = 'form-status error';
      return;
    }

    const formData = new URLSearchParams(new FormData(contactForm));

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      statusEl.textContent = 'Thanks — your message has been sent!';
      statusEl.className = 'form-status success';
      contactForm.reset();
    } catch (err) {
      statusEl.textContent = 'Something went wrong — please email directly instead.';
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
}
