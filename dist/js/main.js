$(document).ready(function () {
  // toggle sidebar
  const updatePinnedClass = () => {
    const $pageWrapper = $(".page-wrapper");

    if ($(window).width() < 1580) {
      $pageWrapper.addClass("pinned");
    } else {
      $pageWrapper.removeClass("pinned");
    }
  };

  updatePinnedClass();
  $(window).resize(updatePinnedClass);

  // tabs
  $(".tab-link").on("click", function () {
    const targetTab = $(this).data("tab");

    $(".tab-link").removeClass("active");
    $(".tab-content").removeClass("active");

    $(this).addClass("active");
    $(`.tab-content[data-id="${targetTab}"]`).addClass("active");
  });

  const $toggleButton = $(".toggle-sidebar");
  const $pageWrapper = $(".page-wrapper");

  $toggleButton.on("click", function () {
    $pageWrapper.toggleClass("pinned");
  });

  // Toggle filter
  $(".btn.filter-toggle").on("click", function (e) {
    const $parent = $(this).parent();

    // Проверяем, если родитель уже открыт, то закрываем его
    if ($parent.hasClass("open")) {
      $parent.removeClass("open");
    } else {
      // Сначала удаляем класс 'open' у всех других элементов
      $(".btn.filter-toggle").parent().removeClass("open");

      // Добавляем класс 'open' только для текущего элемента
      $parent.addClass("open");
    }

    // Блокируем событие клика для предотвращения распространения
    e.stopPropagation();
  });

  // Закрытие всех открытых элементов при клике вне
  $(document).on("click", function () {
    $(".btn.filter-toggle").parent().removeClass("open");
  });

  // Для предотвращения закрытия при клике внутри родительского элемента
  $(".sorting").on("click", function (e) {
    e.stopPropagation();
  });

  // Helper function
  function markInputAsChanged(input) {
    if (input.value !== input.dataset.initialValue) {
      input.dataset.changed = "true";
    } else {
      input.dataset.changed = "false";
    }
  }

  if ($(".sorting").length) {
    // Initialize slider
    function initializeSlider(sliderId, container) {
      const $slider = $("#" + sliderId);
      const $minPrice = container.find(".price-min");
      const $maxPrice = container.find(".price-max");

      noUiSlider.create($slider[0], {
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

      $minPrice.add($maxPrice).each(function () {
        this.dataset.initialValue = this.value || "";
        this.dataset.changed = "false";
      });

      $slider[0].noUiSlider.on("update", (values) => {
        $minPrice.val(values[0]);
        $maxPrice.val(values[1]);
        markInputAsChanged($minPrice[0]);
        markInputAsChanged($maxPrice[0]);
      });

      $minPrice.on("change", function () {
        $slider[0].noUiSlider.set([$minPrice.val(), null]);
        $minPrice.addClass("changed-input");
        markInputAsChanged(this);
      });

      $maxPrice.on("change", function () {
        $slider[0].noUiSlider.set([null, $maxPrice.val()]);
        markInputAsChanged(this);
      });

      return $slider;
    }

    // Update filter count
    function updateFilterCount() {
      let count = 0;
      firstLoadPage = false;
      
      $(".filter__price").each(function () {
        
        const $priceContainer = $(this);
        const $minInput = $priceContainer.find(".price-min");
        const $maxInput = $priceContainer.find(".price-max");
        console.log($minInput)
        if (
          ($minInput.length && $minInput.attr("data-changed") === "true") ||
          ($maxInput.length && $maxInput.attr("data-changed") === "true")
        ) {          
          count++;
        }
      });

      $(".filter-container")
        .find('input[type="checkbox"]:checked')
        .each(function () {
          count++;
        });

      const checkedRadio = $(".filter-container").find(
        'input[type="radio"]:checked'
      );
      if (checkedRadio.length && !checkedRadio[0].defaultChecked) {
        count++;
      }

      const $filterCountElement = $(".filtercount");
      if ($filterCountElement.length) {
        if (count > 0) {
          $filterCountElement.text(count).addClass("visible");
        } else {
          $filterCountElement.text("").removeClass("visible");
        }
      }
    }

    // Initialize filter container
    const $filterContainer = $(".filter-container");

    // Initialize sliders
    const $slider = initializeSlider(
      "price-range",
      $(".filter__column:nth-child(1) .filter__price")
    );
    const $slider2 = initializeSlider(
      "price-range-2",
      $(".filter__column:nth-child(2) .filter__price")
    );

    // Set initial radio button
    const $radioButtons = $filterContainer.find('input[type="radio"]');
    if ($radioButtons.length > 0) {
      $radioButtons[0].checked = true;
    }

    // Add event listeners to inputs for counting
    $filterContainer.find(".price-min, .price-max").each(function () {
      this.dataset.initialValue = this.value || "";
      this.dataset.changed = "false";

      $(this).on("change", function () {
        if (this.value !== this.dataset.initialValue) {
          this.dataset.changed = "true";
        } else {
          this.dataset.changed = "false";
        }
        updateFilterCount();
      });
    });

    $filterContainer
      .find('input[type="checkbox"], input[type="radio"]')
      .on("change", updateFilterCount);

    $slider[0].noUiSlider.on("change", updateFilterCount);
    $slider2[0].noUiSlider.on("change", updateFilterCount);

    // Initialize the filter count
    updateFilterCount();

    // Reset filters
    $(".reset-filter").on("click", function () {
      $filterContainer.find(".price-min, .price-max").each(function () {
        this.value = "";
        this.dataset.changed = "false";
      });

      $filterContainer.find('input[type="checkbox"]').prop("checked", false);

      $filterContainer.find('input[type="radio"]').prop("checked", false);

      if ($radioButtons.length > 0) {
        $radioButtons[0].checked = true;
      }

      $slider[0].noUiSlider.set([0, 100]);
      $slider2[0].noUiSlider.set([0, 100]);

      updateFilterCount();
      console.log("Фильтры сброшены");
    });
  }
});

// organizations
$(document).on("click", function (event) {
  if ($(event.target).closest(".toggle-panel").length) {
    const $parentTr = $(event.target).closest(".tr");
    if ($parentTr.length) {
      $parentTr.toggleClass("active");
    }
  }
});

// finance
$(document).on("click", function (event) {
  const $deleteButton = $(event.target).closest(".delete");
  if ($deleteButton.length && $deleteButton.closest(".finance").length) {
    const $parentTr = $deleteButton.closest(".tr");
    if ($parentTr.length) {
      $parentTr.toggleClass("active");
    }
  }
});

// toggle password
$(document).ready(function () {
  $(".field-input.password").each(function () {
    const $passwordField = $(this);
    const $passwordInput = $passwordField.find(".password-input");
    const $showIcon = $passwordField.find(".toggle-icon.show");
    const $hideIcon = $passwordField.find(".toggle-icon.hide");

    const togglePasswordVisibility = () => {
      if ($passwordInput.attr("type") === "password") {
        $passwordInput.attr("type", "text");
        $showIcon.hide();
        $hideIcon.show();
      } else {
        $passwordInput.attr("type", "password");
        $showIcon.show();
        $hideIcon.hide();
      }
    };

    $showIcon.on("click", togglePasswordVisibility);
    $hideIcon.on("click", togglePasswordVisibility);
  });
});


$(document).ready(function () {
  $('[data-popup="sendmail"]').on('click', function () {
    const popupId = $(this).data('popup');
    const popup = $('[data-id="' + popupId + '"]');
    popup.addClass('active');
  });
  $('.close-popup').on('click', function () {
    $(this).closest('.popup').removeClass('active')
  })
});


$(document).ready(function () {
  $('.select').select2({
    placeholder: "Выбранная позиция",
    minimumResultsForSearch: -1,
    dropdownParent: $('.dropdown-container')
  });

  $('.slimScroll').slimscroll({
    distance: '5px',
    height: '100%',
    alwaysVisible: false,
    color: '#FFFFFF33'    
  }); 

  $('table').slimscroll({
    // axis: 'x',
    width: '1480px',
    railVisible: true,
  });
});

$(document).on('select2:open', function () {
  $('.select2-results__options').slimscroll({
    height: '85px', 
    alwaysVisible: true,
    color: '#FFFFFF33',
    railVisible: true,
    railColor: '#FFFFFF1A'
  });
});

