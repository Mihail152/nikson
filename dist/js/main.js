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

  const $toggleButton = $(".toggle-sidebar, .menu-burger");
  const $pageWrapper = $(".page-wrapper");

  $toggleButton.on("click", function () {
    $pageWrapper.toggleClass("pinned");
  });

  // Toggle open filter
  $(".btn.filter-toggle").on("click", function (e) {
    const $parent = $(this).parent();
    if ($parent.hasClass("open")) {
      $parent.removeClass("open");
    } else {
      $(".btn.filter-toggle").parent().removeClass("open");
      $parent.addClass("open");
    }
    e.stopPropagation();
  });

  $(document).on("click", function () {
    $(".btn.filter-toggle").parent().removeClass("open");
  });
  $(".sorting").on("click", function (e) {
    e.stopPropagation();
  });

})


$(document).ready(function () {

  // Helper function to mark input as changed
  function markInputAsChanged(input) {
    if (input.value !== input.dataset.initialValue) {
      input.dataset.changed = "true";
    } else {
      input.dataset.changed = "false";
    }
  }

  $(".sorting").each(function (index, element) {
    const $container = $(this);
    const sliderId1 = `price-range-${index}-1`;
    const sliderId2 = `price-range-${index}-2`;

    // Set unique IDs for sliders
    $container
      .find(".filter__column:nth-child(1) .filter__slider .slider")
      .attr("id", sliderId1);
    $container
      .find(".filter__column:nth-child(2) .filter__slider .slider")
      .attr("id", sliderId2);

    // Initialize sliders
    const $slider = initializeSlider(
      sliderId1,
      $container.find(".filter__column:nth-child(1) .filter__price")
    );
    const $slider2 = initializeSlider(
      sliderId2,
      $container.find(".filter__column:nth-child(2) .filter__price")
    );

    // Initialize filter container
    const $filterContainer = $container.find(".filter-container");

    // Initialize radio buttons (if necessary)
    const $radioButtons = $filterContainer.find('input[type="radio"]');

    // Initialize slider function
    function initializeSlider(sliderId, container) {
      const $slider = $("#" + sliderId);
      const $minPrice = container.find(".price-min");
      const $maxPrice = container.find(".price-max");

      // Destroy existing slider if it exists
      if ($slider[0]?.noUiSlider) {
        $slider[0].noUiSlider.destroy();
      }

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

      // Update slider values and mark inputs as changed
      $slider[0].noUiSlider.on("update", (values) => {
        $minPrice.val(values[0]);
        $maxPrice.val(values[1]);
        markInputAsChanged($minPrice[0]);
        markInputAsChanged($maxPrice[0]);
      });

      // Handle changes in price min input
      $minPrice.on("change", function () {
        $slider[0].noUiSlider.set([$minPrice.val(), null]);
        markInputAsChanged(this);
      });

      // Handle changes in price max input
      $maxPrice.on("change", function () {
        $slider[0].noUiSlider.set([null, $maxPrice.val()]);
        markInputAsChanged(this);
      });

      return $slider;
    }

    // Function to update filter count for the current .sorting block
    function updateFilterCount() {
      let count = 0;
      const $filterCountElement = $container.find(".filtercount");

      // Count changed price filters
      $(".filter__price", $container).each(function () {
        const $priceContainer = $(this);
        const $minInput = $priceContainer.find(".price-min");
        const $maxInput = $priceContainer.find(".price-max");

        if (
          ($minInput.length && $minInput.attr("data-changed") === "true") ||
          ($maxInput.length && $maxInput.attr("data-changed") === "true")
        ) {
          count++;
        }
      });

      // Count checked checkboxes
      $(".filter-container", $container)
        .find('input[type="checkbox"]:checked')
        .each(function () {
          count++;
        });

      // Count selected radio buttons
      const checkedRadio = $(".filter-container", $container).find(
        'input[type="radio"]:checked'
      );
      if (checkedRadio.length && !checkedRadio[0].defaultChecked) {
        count++;
      }

      // Update filter count element
      if ($filterCountElement.length) {
        if (count > 0) {
          $filterCountElement.text(count).addClass("visible");
        } else {
          $filterCountElement.text("").removeClass("visible");
        }
      }
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

    // Add event listeners for checkboxes and radio buttons
    $filterContainer
      .find('input[type="checkbox"], input[type="radio"]')
      .on("change", updateFilterCount);

    // Add event listeners for slider changes
    $slider[0].noUiSlider.on("change", updateFilterCount);
    $slider2[0].noUiSlider.on("change", updateFilterCount);

    // Initialize the filter count on page load
    updateFilterCount();

    // Reset filters
    let reset_filter = $filterContainer.find(".reset-filter");
    reset_filter.on("click", function () {
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
  });
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
  if ($deleteButton.length && $deleteButton.closest(".finance, .products").length) {
    const $parentTr = $deleteButton.closest(".tr");
    if ($parentTr.length) {
      $parentTr.toggleClass("active");
    }
  }
});

$('.finance .cancel, .products .cancel').on('click', function () {
  const $parentTr = $(this).closest(".tr");
  if ($parentTr.length) {
    $parentTr.toggleClass("active");
  }
})

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
  $('.slimScroll').each(function () {
    $(this).slimscroll({
      height: '100%',
      alwaysVisible: false,
      color: '#FFFFFF33',
      railVisible: true,
      railColor: '#FFFFFF1A',
      distance: '0'
    });
  });

  $('.select').each(function () {
    const $currentSelect = $(this);

    const $dropdownParent = $currentSelect.closest('.dropdown-container');

    $currentSelect.select2({
      placeholder: "Выберите из списка",
      dropdownParent: $dropdownParent.length ? $dropdownParent : $('body'),
      width: 'resolve'
    });

    $currentSelect.on('select2:open', function () {
      const $container = $currentSelect.data('select2').$container;
      const $dropdown = $currentSelect.data('select2').$dropdown;
      const $searchField = $dropdown.find('.select2-search__field');
      const $selection = $container.find('.select2-selection');

      $selection.find('.select2-selection__placeholder').hide();

      if (!$selection.find('.select2-search__field').length) {
        $searchField.appendTo($selection);

        $searchField.off('keydown').on('keydown', function (e) {
          if (e.key === ' ') {
            e.stopPropagation();
          }
        });
      }
    });

    $currentSelect.on('select2:close', function () {
      const $dropdown = $currentSelect.data('select2').$dropdown;
      const $searchField = $dropdown.find('.select2-search__field');
      const $selection = $currentSelect.data('select2').$container.find('.select2-selection');
      const $placeholder = $selection.find('.select2-selection__placeholder');

      $placeholder.show();

      $dropdown.find('.select2-search').append($searchField);
    });

    $currentSelect.on('select2:open', function () {
      const $results = $currentSelect.data('select2').$dropdown.find('.select2-results__options');
      $results.slimscroll({
        height: '85px',
        alwaysVisible: true,
        color: '#FFFFFF33',
        railVisible: true,
        railColor: '#FFFFFF1A'
      });
    });
  });
});






$(document).ready(function () {
  $("[data-toggle='collaps'] > .toggle-arrow").on("click", function () {
    const $cardsGrid = $(this).parent().next(".collaps");
    const $arrow = $(this).parent().find(".toggle-arrow");

    if ($cardsGrid.hasClass("collapsed")) {
      $cardsGrid.removeClass("collapsed").css({
        height: $cardsGrid.prop("scrollHeight"),
        opacity: 1
      });
      $arrow.removeClass("rotated");
    } else {
      $cardsGrid.addClass("collapsed").css({
        height: 0,
        opacity: 0
      });
      $arrow.addClass("rotated");

    }
  });
});

$(document).ready(function () {
  $('.card .remove, .card .cancel').on("click", function () {
    let parent = $(this).closest('.card');
    parent.toggleClass('delete');
    parent.find('.card__header, .info, .card__footer, .action, .markets, .title').toggleClass('hidden')

  })
})