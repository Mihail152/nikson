function updatePinnedClass() {
  const pageWrapper = document.querySelector(".page-wrapper");

  if (window.innerWidth < 1280) {
    pageWrapper.classList.add("pinned");
  } else {
    pageWrapper.classList.remove("pinned");
  }
}

document.addEventListener("DOMContentLoaded", updatePinnedClass);
window.addEventListener("resize", updatePinnedClass);



document.addEventListener("DOMContentLoaded", () => {
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");

  tabLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetTab = link.getAttribute("data-tab");

      tabLinks.forEach((tab) => tab.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      link.classList.add("active");
      document
        .querySelector(`.tab-content[data-id="${targetTab}"]`)
        .classList.add("active");
    });
  });

  const toggleButton = document.querySelector(".toggle-sidebar");
  const pageWrapper = document.querySelector(".page-wrapper");

  toggleButton.addEventListener("click", () => {
    pageWrapper.classList.toggle("pinned");
  });
});
