/* ---- Dynamic Year ---- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- Mobile nav toggle ---- */
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

/* ---- Active nav link: match current page filename ---- */
(function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const rawHref = link.getAttribute('href') || '';

    // Ignore in-page section anchors on index.html (scroll-spy manages them)
    if (rawHref.startsWith('#')) return;

    const linkPath = rawHref.split('/').pop().split('#')[0] || 'index.html';

    // Highlight only if the link belongs strictly to the active page
    if (linkPath === currentPath && (!rawHref.includes('#') || currentPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

/* ---- Scroll-spy for in-page sections (index.html only) ---- */
const spySections = document.querySelectorAll('main .section[id], .hero[id]');
if (spySections.length) {
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { 
    rootMargin: '-20% 0px -70% 0px' 
  });
  spySections.forEach(sec => spyObserver.observe(sec));
}

/* ---- Chart.js defaults ---- */
if (window.Chart) {
  Chart.defaults.color = '#8D95B3';
  Chart.defaults.font.family = "'Inter', sans-serif";
}
const gridColor = '#3B4160';

/* ---- Mini gauge donuts (index + skills) ---- */
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
      plugins: { 
        legend: { display: false }, 
        tooltip: { enabled: false } 
      }, 
      animation: { duration: 900 } 
    }
  });
});

/* ================== INDEX / PROJECT SUMMARY CHARTS ================== */

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
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { boxWidth: 10, boxHeight: 10 } } },
      scales: { x: { grid: { color: gridColor } }, y: { grid: { color: gridColor }, beginAtZero: true } }
    }
  });
}

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
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, ticks: { callback: v => v + '%' } } }
    }
  });
}

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
      responsive: true, maintainAspectRatio: false, cutout: '62%', 
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, font: { size: 11 } } } } 
    }
  });
}

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
        fill: true, tension: 0.4, pointRadius: 3 
      }] 
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, beginAtZero: true } }
    }
  });
}

/* ================== MYSQL PAGE ================== */
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

/* ================== PYTHON PAGE ================== */
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

/* ================== POWER BI PAGE ================== */
const kpiPreviewEl = document.getElementById('kpiPreviewChart');
if (kpiPreviewEl) {
  new Chart(kpiPreviewEl, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{ 
        label: 'Overtime cost ($)', 
        data: [8200, 7600, 9100, 8800, 10200, 11400, 10800, 9600, 9900, 10500, 11800, 12600], 
        borderColor: '#F4A261', 
        backgroundColor: 'rgba(244,162,97,0.15)', 
        fill: true, tension: 0.35, pointRadius: 3 
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, ticks: { callback: v => '$' + (v / 1000) + 'k' } } }
    }
  });
}

/* ================== EXCEL PAGE ================== */
const pivotSummaryEl = document.getElementById('pivotSummaryChart');
if (pivotSummaryEl) {
  new Chart(pivotSummaryEl, {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{ label: 'Units tracked', data: [1120, 1340, 1280, 1510], backgroundColor: '#8B5CF6', borderRadius: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor } } }
    }
  });
}

/* ================== PROJECT DETAIL PAGES ================== */

const hcDetailEl = document.getElementById('healthcareDetailChart');
if (hcDetailEl) {
  new Chart(hcDetailEl, {
    type: 'bar',
    data: {
      labels: ['Morning', 'Afternoon', 'Evening', 'Night', 'Weekend ICU', 'Emergency'],
      datasets: [
        { label: 'Required staff', data: [42, 38, 40, 30, 22, 26], backgroundColor: '#5C85ED', borderRadius: 6 },
        { label: 'Actual staffed', data: [37, 36, 31, 21, 15, 19], backgroundColor: '#F07167', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { boxWidth: 10, boxHeight: 10 } } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, beginAtZero: true } }
    }
  });
}

const overtimeByDeptEl = document.getElementById('overtimeByDeptChart');
if (overtimeByDeptEl) {
  new Chart(overtimeByDeptEl, {
    type: 'bar',
    data: {
      labels: ['Emergency', 'ICU', 'Surgery', 'Pediatrics', 'General Ward'],
      datasets: [{ label: 'Overtime hours / month', data: [312, 268, 190, 134, 98], backgroundColor: '#F4A261', borderRadius: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor } } }
    }
  });
}

const superstoreDetailEl = document.getElementById('superstoreDetailChart');
if (superstoreDetailEl) {
  new Chart(superstoreDetailEl, {
    type: 'bar',
    data: {
      labels: ['0%', '0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50%+'],
      datasets: [{
        label: 'Profit ($)',
        data: [320988, 9029, 91756, -10369, -25448, -22999, -76559],
        backgroundColor: (ctx) => (ctx.raw !== undefined && ctx.raw < 0) ? '#F07167' : '#5C85ED',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, ticks: { callback: v => '$' + (v / 1000) + 'k' } } }
    }
  });
}

const superstoreRegionEl = document.getElementById('superstoreRegionChart');
if (superstoreRegionEl) {
  new Chart(superstoreRegionEl, {
    type: 'bar',
    data: {
      labels: ['West', 'East', 'Central', 'South'],
      datasets: [{ label: 'Avg. discount depth', data: [0.14, 0.18, 0.24, 0.11], backgroundColor: '#B784EB', borderRadius: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, ticks: { callback: v => Math.round(v * 100) + '%' } } }
    }
  });
}

const zeptoDetailEl = document.getElementById('zeptoDetailChart');
if (zeptoDetailEl) {
  new Chart(zeptoDetailEl, {
    type: 'doughnut',
    data: { 
      labels: ['FMCG', 'Produce', 'Snacks', 'Beverages'], 
      datasets: [{ data: [42, 28, 18, 12], backgroundColor: ['#5C85ED', '#B784EB', '#8B5CF6', '#F4A261'], borderWidth: 0 }] 
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '58%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10 } } } }
  });
}

const zeptoStockoutEl = document.getElementById('zeptoStockoutChart');
if (zeptoStockoutEl) {
  new Chart(zeptoStockoutEl, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [{ label: 'Stockout rate (%)', data: [6.2, 7.8, 5.9, 9.1, 8.4, 6.7], borderColor: '#F07167', backgroundColor: 'rgba(240,113,103,0.15)', fill: true, tension: 0.35, pointRadius: 3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, ticks: { callback: v => v + '%' } } }
    }
  });
}

const restaurantDetailEl = document.getElementById('restaurantDetailChart');
if (restaurantDetailEl) {
  new Chart(restaurantDetailEl, {
    type: 'line',
    data: {
      labels: ['12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM'],
      datasets: [{ label: 'Orders', data: [30, 26, 22, 19, 18, 24, 45, 61, 68, 55, 40], borderColor: '#B784EB', backgroundColor: 'rgba(183,132,235,0.18)', fill: true, tension: 0.4, pointRadius: 3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, beginAtZero: true } }
    }
  });
}

const restaurantCategoryEl = document.getElementById('restaurantCategoryChart');
if (restaurantCategoryEl) {
  new Chart(restaurantCategoryEl, {
    type: 'doughnut',
    data: { 
      labels: ['Main course', 'Beverages', 'Appetizers', 'Desserts'], 
      datasets: [{ data: [46, 24, 18, 12], backgroundColor: ['#5C85ED', '#8B5CF6', '#B784EB', '#F4A261'], borderWidth: 0 }] 
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '58%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10 } } } }
  });
}

/* ================== GSAP SCROLL ANIMATIONS ================== */
(function () {
  if (!window.gsap) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance (plays on load)
  const heroTargets = ['.status-badge', '.hero-heading', '.hero-sub', '.hero-actions', '.hero-frame'];
  const heroEls = heroTargets.map(sel => document.querySelector(sel)).filter(Boolean);
  if (heroEls.length) {
    gsap.set(heroEls, { opacity: 0, y: 28 });
    gsap.to(heroEls, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      stagger: 0.12, delay: 0.1
    });
  }

  // Section headings fade in
  document.querySelectorAll('.section-heading, .page-hero h1, .page-hero p, .breadcrumb').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 24, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // Repeating card grids (staggered)
  const groupSelectors = [
    '.skill-hub-grid', '.skills-grid', '.case-grid', '.feature-grid',
    '.stat-row', '.testimonial-grid', '.tool-tags'
  ];
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

  // Featured project, chart cards, about blocks
  document.querySelectorAll('.case-featured, .chart-block, .contact-grid, .about-grid').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 32, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  // Vertical timeline steps (analystworkflow.html)
  document.querySelectorAll('.timeline-step').forEach(el => {
    gsap.from(el, {
      opacity: 0, x: -24, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // Flow steps
  document.querySelectorAll('.flow-step, .flow-arrow').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 16, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true }
    });
  });

  // Refresh positions once images and fonts are loaded
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
})();

/* ================== CONTACT FORM ================== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const statusEl = document.getElementById('formStatus');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const endpoint = contactForm.dataset.sheetEndpoint;
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    if (!endpoint || endpoint.startsWith('PASTE_')) {
      statusEl.textContent = "Form isn't connected yet — email or text me directly using the links above.";
      statusEl.className = 'form-status error';
      return;
    }

    // URL-encoded search params guarantees e.parameter extraction in Google Apps Script
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
      statusEl.textContent = 'Something went wrong — please email or text me directly instead.';
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
}
