document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Mobile Menu Toggle
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Animate hamburger lines
      const spans = menuToggle.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ==========================================
  // 2. Sticky Navbar scroll styling
  // ==========================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 3. Project Filter Logic
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from other buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Hide project card container smoothly
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // matches the transition timing
        }
      });
    });
  });

  // ==========================================
  // 4. Statistics Animation (Count Up)
  // ==========================================
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-num');
  let animated = false;

  const countUp = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      let count = 0;
      const speed = 40; // uniform count speed
      const increment = Math.max(1, Math.ceil(target / speed));

      const updateCount = () => {
        count += increment;
        if (count >= target) {
          stat.innerText = target + (target === 50 ? '+' : '');
        } else {
          stat.innerText = count;
          setTimeout(updateCount, 30);
        }
      };
      updateCount();
    });
  };

  // Intersection Observer for Stats
  if ('IntersectionObserver' in window && statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          countUp();
          animated = true;
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  } else {
    setTimeout(countUp, 1000);
  }

  // ==========================================
  // 5. Interactive GradePulse GPA Calculator
  // ==========================================
  const courseListTbody = document.getElementById('course-list-tbody');
  const btnAddCourse = document.getElementById('btn-add-course');
  const termGpaVal = document.getElementById('term-gpa-val');
  const gpaFeedbackText = document.getElementById('gpa-feedback-text');

  // Recalculates term GPA
  const calculateGPA = () => {
    const rows = courseListTbody.querySelectorAll('tr');
    let totalPoints = 0;
    let totalCredits = 0;

    rows.forEach(row => {
      const creditsInput = row.querySelector('.input-credits');
      const gradeSelect = row.querySelector('.select-grade');

      if (creditsInput && gradeSelect) {
        const credits = parseFloat(creditsInput.value) || 0;
        const gradeValue = parseFloat(gradeSelect.value) || 0;

        totalPoints += (credits * gradeValue);
        totalCredits += credits;
      }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0.00;
    termGpaVal.innerText = gpa.toFixed(2);

    // Update smart insight feedback text
    if (totalCredits === 0) {
      gpaFeedbackText.innerText = "Add your classes to compute your potential GPA for the term.";
    } else if (gpa >= 3.8) {
      gpaFeedbackText.innerText = "Outstanding! Keeping this up places you on the Dean's List.";
    } else if (gpa >= 3.0) {
      gpaFeedbackText.innerText = "Great job! A solid standing to unlock internship options and peer tutoring roles.";
    } else if (gpa >= 2.0) {
      gpaFeedbackText.innerText = "Good work, but look out for courses where you can score a bit higher next time!";
    } else {
      gpaFeedbackText.innerText = "Keep pushing! Make sure to take advantage of peer tutoring reviews.";
    }
  };

  // Attaches event listeners to inputs in a row
  const attachRowListeners = (row) => {
    const inputs = row.querySelectorAll('.input-credits, .select-grade');
    inputs.forEach(input => {
      input.addEventListener('change', calculateGPA);
      input.addEventListener('input', calculateGPA);
    });

    const deleteBtn = row.querySelector('.btn-delete-row');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        row.remove();
        calculateGPA();
      });
    }
  };

  // Listeners for initial rows
  if (courseListTbody) {
    courseListTbody.querySelectorAll('tr').forEach(attachRowListeners);
  }

  // Add course row logic
  if (btnAddCourse && courseListTbody) {
    btnAddCourse.addEventListener('click', () => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><input type="text" placeholder="Class Name (e.g., CS 320)" class="input-class-name"></td>
        <td><input type="number" value="3" min="1" max="5" class="input-credits"></td>
        <td>
          <select class="select-grade">
            <option value="4.0">A (4.0)</option>
            <option value="3.5">B+ (3.5)</option>
            <option value="3.0">B (3.0)</option>
            <option value="2.5">C+ (2.5)</option>
            <option value="2.0">C (2.0)</option>
            <option value="0.0">F (0.0)</option>
          </select>
        </td>
        <td><button class="btn-delete-row" aria-label="Delete course">×</button></td>
      `;
      courseListTbody.appendChild(newRow);
      attachRowListeners(newRow);
      calculateGPA();
    });
  }

  // Trigger initial calculation
  if (courseListTbody) {
    calculateGPA();
  }

  // ==========================================
  // 6. Copy Phone Number to Clipboard
  // ==========================================
  const btnCopyDiscord = document.getElementById('btn-copy-discord');
  const discordUsername = document.getElementById('discord-username');
  const copyTooltip = document.getElementById('copy-tooltip');

  if (btnCopyDiscord && discordUsername && copyTooltip) {
    btnCopyDiscord.addEventListener('click', (e) => {
      e.preventDefault();
      
      const usernameText = discordUsername.textContent.trim();
      
      navigator.clipboard.writeText(usernameText).then(() => {
        // Show tooltip
        copyTooltip.classList.add('show');
        
        // Hide tooltip after 2 seconds
        setTimeout(() => {
          copyTooltip.classList.remove('show');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }

  // ==========================================
  // 7. Smooth Scroll for "Try It Live Below" Link
  // ==========================================
  const scrollToWidgetLink = document.querySelector('.scroll-to-widget');
  if (scrollToWidgetLink) {
    scrollToWidgetLink.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = scrollToWidgetLink.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ==========================================
  // 8. Scroll Reveal Animations
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

});
