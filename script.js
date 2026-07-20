// ============================================================
// script.js — small, plain JavaScript enhancements.
// No frameworks beyond Bootstrap's bundled JS (used for the
// navbar collapse behavior it ships with). Everything below is
// hand-written vanilla JS, kept intentionally simple.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Mobile nav toggle ----
  var toggle = document.querySelector('.nav-toggle');
  var tabs = document.querySelector('.tabs');
  if (toggle && tabs) {
    toggle.addEventListener('click', function () {
      tabs.classList.toggle('open');
    });
  }

  // ---- Highlight the active tab based on current page ----
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.tabs li').forEach(function (li) {
    var link = li.querySelector('a');
    if (link && link.getAttribute('href') === current) {
      li.classList.add('active');
    }
  });

  // ---- Back to top button ----
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Contact form: validate, then submit to Formspree ----
  // See the comment above the <form> tag in contact.html for how
  // to set your real Formspree endpoint. Until that's set, the
  // fetch below will fail and the visitor will see an error message
  // (which is expected — it just means the form isn't wired up yet).
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');
      var feedback = document.getElementById('formFeedback');

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var isValid =
        name.value.trim().length > 1 &&
        emailPattern.test(email.value.trim()) &&
        message.value.trim().length > 5;

      feedback.classList.remove('ok', 'err');

      if (!isValid) {
        feedback.textContent = 'Please fill in your name, a valid email, and a short message.';
        feedback.classList.add('err');
        return;
      }

      // Don't attempt the network call until the endpoint has been
      // filled in — avoids a confusing failed request during setup.
      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        feedback.textContent = 'Form looks good! Once you connect it to Formspree (see the comment near the form in contact.html), messages will actually send.';
        feedback.classList.add('ok');
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            feedback.textContent = 'Thanks — your message has been sent!';
            feedback.classList.add('ok');
            form.reset();
          } else {
            feedback.textContent = 'Something went wrong sending your message. Please try again or email directly.';
            feedback.classList.add('err');
          }
        })
        .catch(function () {
          feedback.textContent = 'Could not send right now — check your connection and try again.';
          feedback.classList.add('err');
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; }
        });
    });
  }

});
