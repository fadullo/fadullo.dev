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

    function restartGif(slide) {
      var gif = slide.querySelector("[data-slider-gif]");
      if (!gif) return;

      var src = gif.getAttribute("src");
      gif.setAttribute("src", "");

      window.requestAnimationFrame(function () {
        gif.setAttribute("src", src);
      });
    }

    function pauseVideos(slide) {
      slide.querySelectorAll("video").forEach(function (video) {
        video.pause();
      });
    }

    function showSlide(index) {
      var previousIndex = activeIndex;
      activeIndex = (index + slides.length) % slides.length;
      track.style.transform = "translateX(-" + activeIndex * 100 + "%)";

      if (previousIndex !== activeIndex) {
        pauseVideos(slides[previousIndex]);
      }

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
        dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
      });

      restartGif(slides[activeIndex]);
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
