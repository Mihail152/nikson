const toggleButton = document.querySelector('.toggle-sidebar');
const pageWrapper = document.querySelector('.page-wrapper');

toggleButton.addEventListener('click', () => {
  pageWrapper.classList.toggle('pinned');
});