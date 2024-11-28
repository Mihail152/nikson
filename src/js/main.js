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


    // slider 1
    const slider = document.getElementById('price-range');
    const minPrice = document.getElementById('price-min');
    const maxPrice = document.getElementById('price-max');

    noUiSlider.create(slider, {
        start: [0, 100],
        connect: true,
        range: {
            'min': 0,
            'max': 100
        },
        format: {
            to: value => Math.round(value),
            from: value => Number(value)
        }
    });

    slider.noUiSlider.on('update', (values) => {
        minPrice.value = values[0];
        maxPrice.value = values[1];
    });

    minPrice.addEventListener('change', () => {
        slider.noUiSlider.set([minPrice.value, null]);
    });

    maxPrice.addEventListener('change', () => {
        slider.noUiSlider.set([null, maxPrice.value]);
    });

    // slider 2
    const slider2 = document.getElementById('price-range-2');
    const minPrice2 = document.getElementById('price-min-2');
    const maxPrice2 = document.getElementById('price-max-2');

    noUiSlider.create(slider2, {
        start: [0, 100],
        connect: true,
        range: {
            'min': 0,
            'max': 100
        },
        format: {
            to: value => Math.round(value),
            from: value => Number(value)
        }
    });

    slider2.noUiSlider.on('update', (values) => {
        minPrice2.value = values[0];
        maxPrice2.value = values[1];
    });

    minPrice2.addEventListener('change', () => {
        slider2.noUiSlider.set([minPrice2.value, null]);
    });

    maxPrice2.addEventListener('change', () => {
        slider2.noUiSlider.set([null, maxPrice2.value]);
    });

    // set first radio 
    const filterContainer = document.querySelector('.filter-container');
    const radioButtons = filterContainer.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });

    if (radioButtons.length > 0) {
        radioButtons[0].checked = true;
    }



    // reset filter
    document.querySelector('.reset-filter').addEventListener('click', () => {
        // const filterContainer = document.querySelector('.filter-container');

        filterContainer.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '';
        });
        filterContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        filterContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });    
        const firstRadio = filterContainer.querySelector('input[type="radio"]');
        if (firstRadio) {
            firstRadio.checked = true;
        }
        
        
        const sliderInstance = slider.noUiSlider;
        if (sliderInstance) {
            sliderInstance.set([sliderInstance.options.range.min, sliderInstance.options.range.max]);
        }
        const sliderInstance2 = slider2.noUiSlider;
        if (sliderInstance2) {
            sliderInstance2.set([sliderInstance.options.range.min, sliderInstance.options.range.max]);
        }
    
        console.log('Фильтры сброшены');
    });
});
