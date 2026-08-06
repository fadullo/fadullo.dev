(function () {
  var sliders = document.querySelectorAll("[data-image-slider]");

  sliders.forEach(function (slider) {
    var track = slider.querySelector(".slider-track");
    var slides = slider.querySelectorAll(".slider-slide");
    var prev = slider.querySelector("[data-slider-prev]");
    var next = slider.querySelector("[data-slider-next]");
    var dots = slider.querySelectorAll("[data-slider-dot]");
    var activeIndex = 0;

    if (!track || slides.length === 0) {
      return;
    }

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;
      track.style.transform = "translateX(-" + activeIndex * 100 + "%)";

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
        dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(activeIndex - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(activeIndex + 1);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    showSlide(0);
  });
})();
