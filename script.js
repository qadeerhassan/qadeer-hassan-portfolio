document.addEventListener('DOMContentLoaded', () => {
  // =========================================================
  // 1. DYNAMIC & INTERACTIVE BACKGROUND PARTICLES (CANVAS)
  // =========================================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = {
      x: null,
      y: null,
      radius: 120 // Interaction radius
    };

    // Handle mouse movement
    window.addEventListener('mousemove', (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });

    // Clear mouse position on leave
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Resize canvas dynamically
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }
    window.addEventListener('resize', resizeCanvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle class definition
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      // Draw individual particle
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      // Update particle positions and check bounds
      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Mouse interaction (repelling effect)
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
              this.x += 2;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
              this.x -= 2;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
              this.y += 2;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
              this.y -= 2;
            }
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    // Initialize particle array
    function initParticles() {
      particlesArray = [];
      // Dynamic density based on screen size
      let numberOfParticles = (canvas.width * canvas.height) / 11000;
      if (numberOfParticles > 100) numberOfParticles = 100; // Cap to optimize performance
      
      const particleColor = 'rgba(99, 102, 241, 0.18)'; // Low opacity indigo

      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;

        particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
      }
    }

    // Connect close particles with lines
    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            opacityValue = 1 - (distance / 110);
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacityValue * 0.12})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    initParticles();
    animate();
  }

  // =========================================================
  // 2. NAVBAR SCROLL EFFECT
  // =========================================================
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // =========================================================
  // 3. COLLAPSIBLE MOBILE MENU
  // =========================================================
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinksContainer.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navLinksContainer.classList.contains('active')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });

    // Close menu if user clicks outside of it
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinksContainer.classList.remove('active');
        menuToggle.querySelector('i').className = 'fas fa-bars';
      }
    });

    // Close mobile drawer when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        menuToggle.querySelector('i').className = 'fas fa-bars';
      });
    });
  }

  // =========================================================
  // 4. ACTIVE MENU ITEM ON SCROLL
  // =========================================================
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 140)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // =========================================================
  // 5. ANIMATE SKILLS ON VIEWPORT ENTRY
  // =========================================================
  const skillsSection = document.getElementById('skills');
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  skillBars.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    bar.dataset.targetWidth = targetWidth;
  });

  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          bar.style.width = bar.dataset.targetWidth;
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // =========================================================
  // 6. DYNAMIC PROJECTS FILTERING
  // =========================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // =========================================================
  // 7. CONTACT FORM ASYNC SUBMISSION (AJAX)
  // =========================================================
  const form = document.querySelector('.contact-form-panel form');
  
  if (form) {
    const statusDiv = document.createElement('div');
    statusDiv.style.marginTop = '15px';
    statusDiv.style.padding = '12px';
    statusDiv.style.borderRadius = '8px';
    statusDiv.style.fontSize = '0.95rem';
    statusDiv.style.fontWeight = '500';
    statusDiv.style.display = 'none';
    form.appendChild(statusDiv);

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
      
      statusDiv.style.display = 'none';

      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let jsonRes = await response.json();
        if (response.status == 200) {
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
          statusDiv.style.border = '1px solid rgba(16, 185, 129, 0.3)';
          statusDiv.style.color = '#10b981';
          statusDiv.innerHTML = 'Thank you! Your message has been sent successfully.';
          form.reset();
        } else {
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
          statusDiv.style.border = '1px solid rgba(239, 68, 68, 0.3)';
          statusDiv.style.color = '#ef4444';
          statusDiv.innerHTML = jsonRes.message || 'Something went wrong. Please try again.';
        }
      })
      .catch(error => {
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
        statusDiv.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        statusDiv.style.color = '#ef4444';
        statusDiv.innerHTML = 'Network error. Please check your internet connection.';
      })
      .then(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 5000);
      });
    });
  }
});
