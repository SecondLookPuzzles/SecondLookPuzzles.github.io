/* Sends "View on Amazon" buttons to the visitor's own Amazon store, chosen from the
   browser's first language (for example "fr-BE" is French, Belgium):
     1. A country with its own store gets that store: fr-BE -> Amazon.com.be, en-AU -> Amazon.com.au.
     2. Switzerland and Luxembourg go by language: fr-CH -> Amazon.fr, de-CH -> Amazon.de.
        Another European country gets Amazon.de: de-AT, da-DK. Any other country gets
        Amazon.com: es-MX, pt-BR.
     3. With no country, the language decides: fr -> Amazon.fr, ja -> Amazon.co.jp,
        another European language -> Amazon.de, anything else -> Amazon.com.
   Without JavaScript the button stays on Amazon.com, the default in the page.
   Each book box ([data-amazon]) has a main button (.js-amazon) and one link per store
   ([data-store]). The button takes over the chosen store's link. Under it, "Other stores"
   shows three links: Amazon.com and the two stores nearest the chosen one (NEAREST).
   For Amazon.com itself it shows the three nearest. Store codes match _data/amazon.json,
   whose "shown" list is what visitors without JavaScript see. */
(function () {
  var BY_COUNTRY = {
    US: "us", CA: "ca", GB: "uk", IE: "ie", DE: "de", AT: "de", LI: "de",
    FR: "fr", MC: "fr", ES: "es", AD: "es", IT: "it", SM: "it", VA: "it", NL: "nl", BE: "be",
    PL: "pl", SE: "se", AU: "au", NZ: "au", JP: "jp"
  };
  var NEAREST = {
    us: ["ca", "uk", "de"], ca: ["uk", "fr"], uk: ["ie", "de"], ie: ["uk", "de"], de: ["nl", "fr"],
    fr: ["be", "de"], es: ["fr", "it"], it: ["fr", "de"], nl: ["be", "de"], be: ["nl", "fr"],
    pl: ["de", "se"], se: ["pl", "de"], au: ["uk", "jp"], jp: ["au", "uk"]
  };
  var BY_LANGUAGE = { en: "us", de: "de", fr: "fr", es: "es", it: "it", nl: "nl", pl: "pl", sv: "se", ja: "jp" };
  var EUROPEAN_LANGUAGES = ("be bg bs ca cs cy da de el es et eu fi fo fr ga gd gl hr hu is it lb lt lv " +
    "mk mt nb nl nn no pl pt rm ro ru sk sl sq sr sv uk").split(" ");
  var EUROPEAN_COUNTRIES = ("AD AL AT BA BE BG BY CH CY CZ DE DK EE ES FI FO FR GB GR HR HU IE IS IT LI LT LU " +
    "LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SK SM UA VA XK").split(" ");

  function chooseStore() {
    var tag = (navigator.languages && navigator.languages[0]) || navigator.language || "en-US";
    var parts = tag.replace(/_/g, "-").split("-");
    var lang = parts[0].toLowerCase();
    var country = "";
    for (var i = 1; i < parts.length; i++) {
      if (/^[a-z]{2}$/i.test(parts[i])) { country = parts[i].toUpperCase(); break; }
    }
    if (country === "CH" || country === "LU") return { fr: "fr", it: "it" }[lang] || "de";
    if (country) return BY_COUNTRY[country] || (EUROPEAN_COUNTRIES.indexOf(country) >= 0 ? "de" : "us");
    return BY_LANGUAGE[lang] || (EUROPEAN_LANGUAGES.indexOf(lang) >= 0 ? "de" : "us");
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
        var shown = (store === "us" ? [] : ["us"]).concat(NEAREST[store]);
        var links = boxes[i].querySelectorAll("[data-store]");
        for (var j = 0; j < links.length; j++) {
          links[j].hidden = shown.indexOf(links[j].getAttribute("data-store")) < 0;
        }
      }
    }
  });
})();
