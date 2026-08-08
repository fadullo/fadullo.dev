(function () {
  var counter = document.querySelector("[data-visitor-counter]");
  if (!counter) return;

  var countTarget = counter.querySelector("[data-visitor-count]");
  var namespace = counter.getAttribute("data-counter-namespace");
  var name = counter.getAttribute("data-counter-name");
  var storageKey = counter.getAttribute("data-counter-storage-key");
  var allowedHosts = (counter.getAttribute("data-counter-hosts") || "")
    .split(",")
    .map(function (host) {
      return host.trim();
    })
    .filter(Boolean);

  if (!countTarget || !namespace || !name || !storageKey) return;

  function canUseStorage() {
    try {
      var testKey = storageKey + "-test";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  function hasCounted() {
    if (!canUseStorage()) return false;
    return window.localStorage.getItem(storageKey) === "1";
  }

  function markCounted() {
    if (!canUseStorage()) return;
    window.localStorage.setItem(storageKey, "1");
  }

  function isLocalPreview() {
    var host = window.location.hostname;
    return (
      window.location.protocol === "file:" ||
      !host ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1"
    );
  }

  function isAllowedHost() {
    if (!allowedHosts.length) return true;
    return allowedHosts.indexOf(window.location.hostname) !== -1;
  }

  function getCount(data) {
    if (!data) return null;
    if (typeof data.count === "number") return data.count;
    if (typeof data.value === "number") return data.value;
    if (data.data && typeof data.data.count === "number") return data.data.count;
    if (data.data && typeof data.data.value === "number") return data.data.value;
    return null;
  }

  function showCount(value) {
    if (typeof value !== "number") return;
    countTarget.textContent = value.toLocaleString();
  }

  var shouldIncrement = !isLocalPreview() && isAllowedHost() && !hasCounted();
  var endpoint =
    "https://api.counterapi.dev/v1/" +
    encodeURIComponent(namespace) +
    "/" +
    encodeURIComponent(name) +
    (shouldIncrement ? "/up" : "");

  fetch(endpoint, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("Counter request failed");
      return response.json();
    })
    .then(function (data) {
      showCount(getCount(data));

      if (shouldIncrement) {
        markCounted();
      }
    })
    .catch(function () {
      counter.classList.add("is-unavailable");
    });
})();
