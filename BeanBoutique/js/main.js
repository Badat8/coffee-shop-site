document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.navbar');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const modal = document.getElementById('discount-modal');
  const discountForm = document.getElementById('discount-form');

  if (modal && discountForm) {
    const hasVisited = sessionStorage.getItem('visited');

    if (!hasVisited) {
      window.setTimeout(() => {
        modal.classList.add('is-visible');
        modal.setAttribute('aria-hidden', 'false');
      }, 2000);
    }

    const closeModal = () => {
      modal.classList.remove('is-visible');
      modal.setAttribute('aria-hidden', 'true');
      sessionStorage.setItem('visited', 'true');
    };

    modal.addEventListener('click', (event) => {
      if (event.target.matches('[data-close-modal="true"]')) {
        closeModal();
      }
    });

    discountForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const emailInput = document.getElementById('discount-email');
      if (emailInput && emailInput.value.trim()) {
        closeModal();
        alert('Welcome offer saved. Check your inbox for your 15% discount code.');
      }
    });
  }

  const carouselSlides = [...document.querySelectorAll('.slide')];
  if (carouselSlides.length) {
    let currentIndex = 0;

    const showSlide = (index) => {
      currentIndex = (index + carouselSlides.length) % carouselSlides.length;
      carouselSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === currentIndex);
      });
    };

    const prevBtn = document.querySelector('.carousel-button.prev');
    const nextBtn = document.querySelector('.carousel-button.next');

    prevBtn?.addEventListener('click', () => showSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => showSlide(currentIndex + 1));
    window.setInterval(() => showSlide(currentIndex + 1), 4000);
  }

  const cartButtons = document.querySelectorAll('.add-to-cart');
  if (cartButtons.length) {
    const getCart = () => {
      try {
        return JSON.parse(localStorage.getItem('beanBoutiqueCart') || '[]');
      } catch (error) {
        return [];
      }
    };

    const saveCart = (cart) => {
      localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
    };

    const addToCart = (product) => {
      const cart = getCart();
      const existingIndex = cart.findIndex((item) => item.id === product.id);

      if (existingIndex >= 0) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      saveCart(cart);
      alert(`${product.name} added to cart.`);
    };

    cartButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const product = {
          id: button.dataset.id,
          name: button.dataset.name,
          price: Number(button.dataset.price),
          category: button.dataset.category
        };

        addToCart(product);
      });
    });
  }

  const form = document.getElementById('registration-form');
  if (form) {
    const showMessage = (message, isError = false) => {
      const messageBox = document.getElementById('form-message');
      if (messageBox) {
        messageBox.textContent = message;
        messageBox.style.color = isError ? '#a23b2a' : '#386b4c';
      }
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email'),
        eventSelect: document.getElementById('eventSelect')
      };

      let valid = true;

      Object.entries(fields).forEach(([key, field]) => {
        const feedback = document.querySelector(`[data-feedback-for="${key}"]`);
        if (!field) return;

        if (!field.value.trim()) {
          if (feedback) feedback.textContent = 'This field is required.';
          valid = false;
        } else if (key === 'email' && !field.value.includes('@')) {
          if (feedback) feedback.textContent = 'Please enter a valid email address.';
          valid = false;
        } else {
          if (feedback) feedback.textContent = '';
        }
      });

      if (!valid) {
        showMessage('Please complete all required fields correctly.', true);
        return;
      }

      showMessage('Registration submitted successfully. We look forward to seeing you!');
      form.reset();
    });
  }

  const cartBody = document.getElementById('cart-items-body');
  const subtotalEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const shippingEl = document.getElementById('shipping');
  const totalEl = document.getElementById('total');
  const shippingStatus = document.getElementById('shipping-status');

  if (cartBody) {
    const formatMoney = (value) => `MK${Number(value).toLocaleString('en-MW')}`;

    const getCart = () => {
      try {
        return JSON.parse(localStorage.getItem('beanBoutiqueCart') || '[]');
      } catch (error) {
        return [];
      }
    };

    const renderCart = () => {
      const cart = getCart();
      cartBody.innerHTML = '';

      if (!cart.length) {
        cartBody.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
      } else {
        cart.forEach((item, index) => {
          const row = document.createElement('tr');
          const subtotal = item.price * item.quantity;

          row.innerHTML = `
            <td>${item.name}</td>
            <td>${formatMoney(item.price)}</td>
            <td>
              <div class="qty-controls">
                <button type="button" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">-</button>
                <span>${item.quantity}</span>
                <button type="button" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
              </div>
            </td>
            <td>${formatMoney(subtotal)}</td>
            <td><button type="button" class="remove-item" data-index="${index}">Remove</button></td>
          `;
          cartBody.appendChild(row);
        });
      }

      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.15;
      const freeShippingThreshold = 30000;
      const shipping = subtotal >= freeShippingThreshold ? 0 : 2500;
      const total = subtotal + tax + shipping;

      subtotalEl.textContent = formatMoney(subtotal);
      taxEl.textContent = formatMoney(tax);
      shippingEl.textContent = shipping === 0 ? 'Free' : formatMoney(shipping);
      totalEl.textContent = formatMoney(total);

      if (shipping === 0) {
        shippingStatus.textContent = 'Free shipping unlocked.';
      } else {
        const remaining = freeShippingThreshold - subtotal;
        shippingStatus.textContent = remaining > 0 ? `Add ${formatMoney(remaining)} for free shipping.` : 'Free shipping unlocked.';
      }
    };

    cartBody.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;

      const cart = getCart();
      const index = Number(button.dataset.index);
      const action = button.dataset.action;

      if (button.classList.contains('remove-item')) {
        cart.splice(index, 1);
        localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
        renderCart();
        return;
      }

      if (action === 'increase') {
        cart[index].quantity += 1;
      }

      if (action === 'decrease') {
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
      }

      localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
      renderCart();
    });

    document.querySelector('.checkout-btn')?.addEventListener('click', () => {
      alert('Prototype mode: Online checkout will be activated soon');
    });

    renderCart();
  }

  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        alert('Thanks for joining our newsletter.');
        newsletterForm.reset();
      }
    });
  }
});
