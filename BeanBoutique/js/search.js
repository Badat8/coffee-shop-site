document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('coffeeSearch');
  if (!searchInput) return;

  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const cards = [...document.querySelectorAll('.product-card')];

  let activeFilter = 'all';

  const applyFilter = () => {
    const q = searchInput.value.trim().toLowerCase();

    cards.forEach((card) => {
      const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
      const matchesText = !q || name.includes(q);
      const category = card.dataset.category || '';
      const matchesCategory = activeFilter === 'all' || category === activeFilter;
      const shouldShow = matchesText && matchesCategory;
      card.style.display = shouldShow ? '' : 'none';
    });
  };

  searchInput.addEventListener('input', applyFilter);

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      filterButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
      applyFilter();
    });
  });
});
