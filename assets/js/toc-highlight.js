(function () {
  var toc = document.querySelector("[data-highlight-toc]");
  if (!toc) return;

  var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
  var targets = links
    .map(function (link) {
      var id = decodeURIComponent(link.hash.slice(1));
      return id ? { link: link, target: document.getElementById(id) } : null;
    })
    .filter(function (item) {
      return item && item.target;
    });

  if (!targets.length) return;

  function setActive() {
    var active = targets[0];
    var threshold = 130;

    targets.forEach(function (item) {
      if (item.target.getBoundingClientRect().top <= threshold) {
        active = item;
      }
    });

    links.forEach(function (link) {
      link.classList.toggle("is-active", link === active.link);
    });
  }

  setActive();
  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("resize", setActive);
})();
