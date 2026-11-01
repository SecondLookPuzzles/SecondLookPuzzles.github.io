/* Sends "View on Amazon" buttons to the visitor's own Amazon store, based on the
   browser's language:
     English (UK or Ireland)      -> Amazon.co.uk
     other European languages     -> Amazon.de
     everyone else                -> Amazon.com  (the default in the page)
   A European language spoken outside Europe (e.g. es-MX, pt-BR, fr-CA) goes to Amazon.com.
   Each book box ([data-amazon]) has a main button (.js-amazon) and one link per store
   ([data-store="us|uk|de"]); the button takes over the chosen store's link. */
(function () {
  var EUROPEAN_LANGUAGES = ("be bg bs ca cs cy da de el es et eu fi fo fr ga gd gl hr hu is it lb lt lv " +
    "mk mt nb nl nn no pl pt rm ro ru sk sl sq sr sv uk").split(" ");
  var EUROPEAN_REGIONS = ("AD AL AT BA BE BG BY CH CY CZ DE DK EE ES FI FO FR GB GR HR HU IE IS IT LI LT LU " +
    "LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SK SM UA VA XK").split(" ");

  function chooseStore() {
    var tag = (navigator.languages && navigator.languages[0]) || navigator.language || "en-US";
    var parts = tag.replace(/_/g, "-").split("-");
    var lang = parts[0].toLowerCase();
    var region = "";
    for (var i = 1; i < parts.length; i++) {
      if (/^[a-z]{2}$/i.test(parts[i])) { region = parts[i].toUpperCase(); break; }
    }
    if (lang === "en") return region === "GB" || region === "IE" ? "uk" : "us";
    if (EUROPEAN_LANGUAGES.indexOf(lang) >= 0 && (!region || EUROPEAN_REGIONS.indexOf(region) >= 0)) return "de";
    return "us";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var store = chooseStore();
    var boxes = document.querySelectorAll("[data-amazon]");
    for (var i = 0; i < boxes.length; i++) {
      var link = boxes[i].querySelector('[data-store="' + store + '"]');
      var button = boxes[i].querySelector(".js-amazon");
      if (link && button) {
        button.href = link.href;
        button.textContent = "View on " + link.textContent;
      }
    }
  });
})();
