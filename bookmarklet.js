javascript:
(function () {
  window.bookmarkver = "1.4";
  var CANONICAL_REPO = "JustinHoMi/PowerDeleteSuite-updated";
  var PINNED_REF = "b16651707177d78fdf2cd767230e562717723ea5";
  var SCRIPT_SHA256 =
    "e3edd24d340943abb658c5c7bbf9fbb9087d0433a3af773526d241a401c262f9";
  var isReddit =
    document.location.hostname.split(".").slice(-2).join(".") === "reddit.com";
  var isOverview = document.location.href.match(/\/overview\b/);
  if (isReddit && isOverview) {
    load();
  } else if (
    confirm(
      "This script can only be run from your own user profile on reddit. Would you like to go there now?"
    )
  ) {
    document.location = "https://old.reddit.com/u/me/overview";
  } else {
    alert("Please go to your reddit profile before running this script");
  }

  async function load() {
    var url =
      "https://raw.githubusercontent.com/" +
      CANONICAL_REPO +
      "/" +
      PINNED_REF +
      "/powerdeletesuite.js";
    try {
      var response = await fetch(url);
      if (!response.ok) {
        alert("Error retrieving PowerDeleteSuite (HTTP " + response.status + ")");
        return;
      }
      var bytes = await response.arrayBuffer();
      if (!window.crypto || !window.crypto.subtle) {
        alert("PowerDeleteSuite cannot verify its own integrity in this browser.");
        return;
      }
      var digest = await window.crypto.subtle.digest("SHA-256", bytes);
      var digestBytes = new Uint8Array(digest);
      var hex = "";
      for (var i = 0; i < digestBytes.length; i++) {
        hex += ("0" + digestBytes[i].toString(16)).slice(-2);
      }
      if (hex !== SCRIPT_SHA256) {
        alert("PowerDeleteSuite integrity check failed; not executing.");
        return;
      }

      var existing = document.getElementById("pd-script");
      if (
        existing &&
        existing.getAttribute("data-pd-hash") === SCRIPT_SHA256 &&
        window.pd &&
        typeof window.pd.init === "function"
      ) {
        window.pd.init();
        return;
      }
      if (existing) {
        existing.parentNode.removeChild(existing);
      }
      window.pd = undefined;

      var code = new TextDecoder("utf-8").decode(bytes);
      var script = document.createElement("script");
      script.id = "pd-script";
      script.setAttribute("data-pd-hash", SCRIPT_SHA256);
      script.textContent = code;
      document.head.appendChild(script);
    } catch (e) {
      alert("Error retrieving PowerDeleteSuite from GitHub");
    }
  }
})();
