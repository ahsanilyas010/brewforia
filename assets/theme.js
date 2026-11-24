/* Brewforia theme scripts. Vanilla JS web components, no build step. */

const formatCount = (cart) => {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = cart.item_count;
  });
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.description || data.message || 'Request failed');
  return data;
};

/* Mobile menu overlay (NavBar.jsx) */
class MobileMenu extends HTMLElement {
  connectedCallback() {
    this.panel = this.querySelector('[data-menu-panel]');
    this.openers = document.querySelectorAll('[data-menu-open]');
    this.openers.forEach((button) => button.addEventListener('click', () => this.toggle(true)));
    this.querySelectorAll('[data-menu-close]').forEach((el) => el.addEventListener('click', () => this.toggle(false)));
    this.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.toggle(false);
    });
  }

  toggle(open) {
    this.panel.classList.toggle('is-open', open);
    this.openers.forEach((button) => button.setAttribute('aria-expanded', String(open)));
    if (open) this.querySelector('a, button')?.focus();
    else this.openers[0]?.focus();
  }
}

/* Search bar toggle: on collection pages the icon opens the filter bar (SearchBar.jsx) */
class SearchToggle extends HTMLElement {
  connectedCallback() {
    this.link = this.querySelector('a');
    this.bar = document.querySelector('[data-search-bar]');
    if (!this.bar) return;
    this.link.addEventListener('click', (event) => {
      event.preventDefault();
      const open = this.bar.hasAttribute('hidden');
      this.bar.toggleAttribute('hidden', !open);
      this.link.setAttribute('aria-expanded', String(open));
      if (open) this.bar.querySelector('input')?.focus();
    });
    this.bar.querySelector('[data-search-close]')?.addEventListener('click', () => {
      this.bar.setAttribute('hidden', '');
      this.link.setAttribute('aria-expanded', 'false');
      this.link.focus();
    });
  }
}

/* Product gallery thumbnails */
class ProductGallery extends HTMLElement {
  connectedCallback() {
    this.thumbs = [...this.querySelectorAll('[data-thumb]')];
    this.slides = [...this.querySelectorAll('[data-slide]')];
    this.thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        this.slides.forEach((slide, i) => slide.toggleAttribute('hidden', i !== index));
        this.thumbs.forEach((t, i) => t.setAttribute('aria-current', String(i === index)));
      });
    });
  }
}

/* Variant picker + add to cart via the Cart AJAX API */
class ProductForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    this.idInput = this.querySelector('[data-variant-id]');
    this.defaultId = this.idInput.value;
    this.submit = this.querySelector('[data-submit]');
    this.hint = this.querySelector('[data-hint]');
    this.price = this.querySelector('[data-price]');
    this.live = this.querySelector('[data-live]');
    this.options = [...this.querySelectorAll('[data-option]')];
    this.options.forEach((button) => button.addEventListener('click', () => this.select(button)));
    this.form.addEventListener('submit', (event) => this.add(event));
  }

  select(button) {
    this.options.forEach((b) => {
      b.setAttribute('aria-pressed', String(b === button));
      b.classList.toggle('option-button--selected', b === button);
    });
    this.idInput.value = button.dataset.variantId;
    this.submit.disabled = button.dataset.available !== 'true';
    this.hint.textContent = this.hint.dataset.ready.replace('__size__', button.dataset.title);
    if (this.price) this.price.textContent = button.dataset.optionPrice;
  }

  reset() {
    this.options.forEach((b) => {
      b.setAttribute('aria-pressed', 'false');
      b.classList.remove('option-button--selected');
    });
    this.idInput.value = this.defaultId;
    this.submit.disabled = !this.defaultId;
    this.hint.textContent = this.hint.dataset.select;
    if (this.price) this.price.textContent = this.price.dataset.from;
  }

  async add(event) {
    event.preventDefault();
    if (!this.idInput.value) return;
    this.submit.disabled = true;
    try {
      await fetchJson('/cart/add.js', {
        method: 'POST',
        body: JSON.stringify({ items: [{ id: Number(this.idInput.value), quantity: 1 }] }),
      });
      const cart = await fetchJson('/cart.js');
      formatCount(cart);
      if (this.live) this.live.textContent = this.live.dataset.added;
      this.reset();
    } catch (error) {
      this.hint.textContent = error.message;
      this.submit.disabled = false;
    }
  }
}

/* Cart page: change quantity or remove, then re-render the section */
class CartItems extends HTMLElement {
  connectedCallback() {
    this.sectionId = this.dataset.sectionId;
    this.bind();
  }

  bind() {
    this.querySelectorAll('[data-qty]').forEach((input) => {
      input.addEventListener('change', () => {
        const value = input.value.trim();
        if (value === '' || value === '0') {
          input.value = input.defaultValue;
          return;
        }
        this.change(Number(input.dataset.line), Number(value));
      });
    });
    this.querySelectorAll('[data-remove]').forEach((button) => {
      button.addEventListener('click', () => this.change(Number(button.dataset.line), 0));
    });
  }

  async change(line, quantity) {
    this.setAttribute('aria-busy', 'true');
    try {
      const cart = await fetchJson('/cart/change.js', { method: 'POST', body: JSON.stringify({ line, quantity }) });
      formatCount(cart);
      const response = await fetch(`${window.location.pathname}?section_id=${this.sectionId}`);
      const html = new DOMParser().parseFromString(await response.text(), 'text/html');
      const fresh = html.querySelector('cart-items');
      if (fresh) {
        this.innerHTML = fresh.innerHTML;
        this.bind();
      }
    } catch (error) {
      const status = this.querySelector('[data-status]');
      if (status) status.textContent = error.message;
    } finally {
      this.removeAttribute('aria-busy');
    }
  }
}

/* Collection: category checkboxes, sort and name filter (Collection.jsx) */
class CollectionFilters extends HTMLElement {
  connectedCallback() {
    this.grid = this.querySelector('[data-grid]');
    this.items = [...this.grid.children];
    this.items.forEach((item, index) => (item.dataset.index = index));
    this.querySelectorAll('input[type="checkbox"]').forEach((box) => box.addEventListener('change', () => this.apply()));
    this.querySelector('[data-sort]')?.addEventListener('change', () => this.apply());
    document.querySelector('[data-search-bar] input')?.addEventListener('input', () => this.apply());
    this.toggle = this.querySelector('[data-filter-toggle]');
    this.panel = this.querySelector('[data-filter-panel]');
    this.toggle?.addEventListener('click', () => {
      const collapsed = this.panel.classList.toggle('is-collapsed');
      this.toggle.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  apply() {
    const categories = [...this.querySelectorAll('input[type="checkbox"]:checked')].map((box) => box.value.toLowerCase());
    const term = (document.querySelector('[data-search-bar] input')?.value || '').trim().toLowerCase();
    const sort = this.querySelector('[data-sort]')?.value;
    const visible = this.items.filter((item) => {
      const matchesCategory = categories.length === 0 || categories.includes(item.dataset.category);
      const matchesTerm = !term || item.dataset.title.includes(term);
      item.toggleAttribute('hidden', !(matchesCategory && matchesTerm));
      return matchesCategory && matchesTerm;
    });
    const sorted = [...this.items].sort((a, b) => {
      if (sort === 'low-high') return Number(a.dataset.price) - Number(b.dataset.price);
      if (sort === 'high-low') return Number(b.dataset.price) - Number(a.dataset.price);
      return Number(a.dataset.index) - Number(b.dataset.index);
    });
    sorted.forEach((item) => this.grid.appendChild(item));
    const empty = this.querySelector('[data-empty]');
    if (empty) empty.toggleAttribute('hidden', visible.length > 0);
  }
}

customElements.define('mobile-menu', MobileMenu);
customElements.define('search-toggle', SearchToggle);
customElements.define('product-gallery', ProductGallery);
customElements.define('product-form', ProductForm);
customElements.define('cart-items', CartItems);
customElements.define('collection-filters', CollectionFilters);
