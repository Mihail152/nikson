document.addEventListener("DOMContentLoaded", () => {
  if (!navigator.userAgent.match('Macintosh')) {
      const elements = document.querySelectorAll('.slimScroll');
      const slimScrollInstances = [];

      elements.forEach((element) => {
          const slimInstance = new slimScroll(element, {
              'wrapperClass': 'scroll-wrapper unselectable mac',
              'scrollBarContainerClass': 'scrollBarContainer',
              'scrollBarContainerSpecialClass': 'animate',
              'scrollBarClass': 'scroll',
              'keepFocus': true
          });
          slimScrollInstances.push(slimInstance);
      });

      window.onresize = () => {
          slimScrollInstances.forEach((instance) => {
              instance.resetValues();
          });
      };
  } else {
      document.write("For Mac users, this custom slimscroll styles will not be applied");
  }

  const updatePinnedClass = () => {
      const pageWrapper = document.querySelector(".page-wrapper");

      if (window.innerWidth < 1580) {
          pageWrapper.classList.add("pinned");
      } else {
          pageWrapper.classList.remove("pinned");
      }
  };

  updatePinnedClass();
  window.addEventListener("resize", updatePinnedClass);

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
