
let header = document.getElementById("header");
let meny = document.getElementById("meny");

header.innerHTML = `
    <h2 id ="headerH2">Välkommen på bröllop mellan</h2>
    <h1>Anna & Johan</h1>
    <h3 id ="headerH3">9 maj 2026</h3>
`


meny.innerHTML = `
    <div id = "topMeny">
        <a href ="index.html">Välkommen</a>
        <a href ="HTML/wedding.html">Bröllopet</a>
        <a href ="HTML/info.html" >Info</a>
        <a href ="HTML/housing.html">Boende</a>
        <a href ="HTML/list.html">Gåvor</a>
        <a href ="HTML/osa.html">O.S.A</a>
        <a href ="HTML/toastmaster.html">Tal & Toastmaster</a>
    </div>

 <!-- Dropdown (mobil) -->
  <div class="custom-dropdown" id="mobileDropdown">
      <div class="dropdown-selected">Välj sida </div>
      <ul class="dropdown-list">
          <li><a href="index.html">Välkommen</a></li>
          <li><a href="HTML/wedding.html">Bröllopet</a></li>
          <li><a href="HTML/info.html">Info</a></li>
          <li><a href="HTML/housing.html">Boende</a></li>
          <li><a href="HTML/list.html">Gåvor</a></li>
          <li><a href="HTML/osa.html">O.S.A</a></li>
          <li><a href="HTML/toastmaster.html">Tal & Toastmaster</a></li>
      </ul>
  </div>
`

// Funktion som aktiverar dropdownen
function initDropdown() {
    const dropdown = document.getElementById("mobileDropdown");
    const selected = dropdown.querySelector(".dropdown-selected");
    const list = dropdown.querySelector(".dropdown-list");
    const items = dropdown.querySelectorAll("li a");

    selected.addEventListener("click", function () {
        list.classList.toggle("open");
        dropdown.classList.toggle("open");
    });

    document.addEventListener("click", function (e) {
        if (!dropdown.contains(e.target)) {
            list.classList.remove("open");
        }
    });

    // Markera aktuell sida
    const currentPage = window.location.pathname.split("/").pop();
    for (let i = 0; i < items.length; i++) {
        if (items[i].getAttribute("href").endsWith(currentPage)) {
            selected.innerHTML = items[i].textContent + `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="black" style="vertical-align: middle; margin-left: 6px;">
              <path d="M6.293 8.293a1 1 0 011.414 0L12 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z"/>
            </svg>`;
            break;
        }
    }

    // Navigera vid klick
    for (let i = 0; i < items.length; i++) {
        items[i].addEventListener("click", function (e) {
            e.preventDefault();
            selected.innerHTML = this.textContent + `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="black" style="vertical-align: middle; margin-left: 6px;">
              <path d="M6.293 8.293a1 1 0 011.414 0L12 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z"/>
            </svg>`;
            list.classList.remove("open");
            window.location.href = this.getAttribute("href");
        });
    }
}

// Kör dropdown-logik bara om mobilmenyn syns (små skärmar)
if (window.matchMedia("(max-width: 600px)").matches) {
    initDropdown();
}

