document.addEventListener("DOMContentLoaded", () => {
  // toggle sidebar
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

  // tabs
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

  // Toggle filter
  // Функция для обработки клика по кнопке .filter-toggle
  document.querySelectorAll(".btn.filter-toggle").forEach((button) => {
    button.addEventListener("click", (e) => {
      const parent = button.parentElement;

      // Проверяем, если родитель уже открыт, то закрываем его
      if (parent.classList.contains("open")) {
        parent.classList.remove("open");
      } else {
        // Сначала удаляем класс 'open' у всех других элементов
        document.querySelectorAll(".btn.filter-toggle").forEach((btn) => {
          btn.parentElement.classList.remove("open");
        });

        // Добавляем класс 'open' только для текущего элемента
        parent.classList.add("open");
      }

      // Блокируем событие клика для предотвращения распространения
      e.stopPropagation();
    });
  });

  // Закрытие всех открытых элементов при клике вне
  document.addEventListener("click", () => {
    document.querySelectorAll(".btn.filter-toggle").forEach((button) => {
      button.parentElement.classList.remove("open");
    });
  });

  // Для предотвращения закрытия при клике внутри родительского элемента
  document.querySelectorAll(".sorting").forEach((container) => {
    container.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  // Helper function
  function markInputAsChanged(input) {
    if (input.value !== input.dataset.initialValue) {
      input.dataset.changed = "true";
    } else {
      input.dataset.changed = "false";
    }
  }

  // Initialize slider
  function initializeSlider(sliderId, container) {
    const slider = document.getElementById(sliderId);
    const minPrice = container.querySelector(".price-min");
    const maxPrice = container.querySelector(".price-max");

    noUiSlider.create(slider, {
      start: [0, 100],
      connect: true,
      range: {
        min: 0,
        max: 100,
      },
      format: {
        to: (value) => Math.round(value),
        from: (value) => Number(value),
      },
    });

    [minPrice, maxPrice].forEach((input) => {
      input.dataset.initialValue = input.value || "";
      input.dataset.changed = "false";
    });

    slider.noUiSlider.on("update", (values) => {
      minPrice.value = values[0];
      maxPrice.value = values[1];
      markInputAsChanged(minPrice);
      markInputAsChanged(maxPrice);
    });

    minPrice.addEventListener("change", () => {
      slider.noUiSlider.set([minPrice.value, null]);
      minPrice.classList.add("changed-input");
      markInputAsChanged(minPrice);
    });

    maxPrice.addEventListener("change", () => {
      slider.noUiSlider.set([null, maxPrice.value]);
      markInputAsChanged(maxPrice);
    });

    return slider;
  }

  // Update filter count
  function updateFilterCount() {
    let count = 0;
    firstLoadPage = false;

    filterContainer
      .querySelectorAll(".filter__price")
      .forEach((priceContainer) => {
        const minInput = priceContainer.querySelector(".price-min");
        const maxInput = priceContainer.querySelector(".price-max");
        if (
          (minInput && minInput.dataset.changed === "true") ||
          (maxInput && maxInput.dataset.changed === "true")
        ) {
          count++;
        }
      });

    filterContainer
      .querySelectorAll('input[type="checkbox"]:checked')
      .forEach(() => {
        count++;
      });

    const checkedRadio = filterContainer.querySelector(
      'input[type="radio"]:checked'
    );
    if (checkedRadio && !checkedRadio.defaultChecked) {
      count++;
    }

    const filterCountElement = document.querySelector(".filtercount");
    if (filterCountElement) {
      if (count > 0) {
        filterCountElement.textContent = count;
        filterCountElement.classList.add("visible");
      } else {
        filterCountElement.textContent = "";
        filterCountElement.classList.remove("visible");
      }
    }
  }

  // Initialize filter container
  const filterContainer = document.querySelector(".filter-container");

  // Initialize sliders
  const slider = initializeSlider(
    "price-range",
    document.querySelector(".filter__column:nth-child(1) .filter__price")
  );
  const slider2 = initializeSlider(
    "price-range-2",
    document.querySelector(".filter__column:nth-child(2) .filter__price")
  );

  // Set initial radio button
  const radioButtons = filterContainer.querySelectorAll('input[type="radio"]');
  if (radioButtons.length > 0) {
    radioButtons[0].checked = true;
  }

  // Add event listeners to inputs for counting
  filterContainer
    .querySelectorAll(".price-min, .price-max")
    .forEach((input) => {
      input.dataset.initialValue = input.value || "";
      input.dataset.changed = "false";

      input.addEventListener("change", () => {
        if (input.value !== input.dataset.initialValue) {
          input.dataset.changed = "true";
        } else {
          input.dataset.changed = "false";
        }
        updateFilterCount();
      });
    });

  filterContainer
    .querySelectorAll('input[type="checkbox"], input[type="radio"]')
    .forEach((input) => {
      input.addEventListener("change", updateFilterCount);
    });

  slider.noUiSlider.on("change", updateFilterCount);
  slider2.noUiSlider.on("change", updateFilterCount);

  // Initialize the filter count
  updateFilterCount();

  // Reset filters
  document.querySelector(".reset-filter").addEventListener("click", () => {
    filterContainer
      .querySelectorAll(".price-min, .price-max")
      .forEach((input) => {
        input.value = "";
        input.dataset.changed = "false";
      });

    filterContainer
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    filterContainer.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.checked = false;
    });

    if (radioButtons.length > 0) {
      radioButtons[0].checked = true;
    }

    slider.noUiSlider.set([0, 100]);
    slider2.noUiSlider.set([0, 100]);

    updateFilterCount();
    console.log("Фильтры сброшены");
  });



// organizations
  document.addEventListener('click', function (event) {
    if (event.target.closest('.toggle-panel')) {
      const parentTr = event.target.closest('.tr');
      if (parentTr) {
        parentTr.classList.toggle('active');
      }
    }
  });

});
