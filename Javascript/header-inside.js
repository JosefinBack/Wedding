(function () {
    if (!document.getElementById("googleFontsLink")) {
        const link = document.createElement("link");
        link.id = "googleFontsLink";
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Playfair+Display:wght@400;700&display=swap";
        document.head.appendChild(link);
    }
})();


let header = document.getElementById("header");
let meny = document.getElementById("meny");

header.innerHTML = `
    <h2 id ="headerH2">Välkommen på bröllop mellan</h2>
    <h1>Anna och Johan</h1>
    <h3 id ="headerH3">9 maj 2026</h3>
`


meny.innerHTML = `
    <div id = "topMeny">
        <a href ="../index.html">Välkommen</a>
        <a href ="../HTML/wedding.html">Bröllopet</a>
        <a href ="../HTML/info.html">Info</a>
        <a href ="../HTML/housing.html">Boende</a>
        <a href ="../HTML/list.html">Gåvor</a>
        <a href ="../HTML/osa.html">O.S.A</a>
        <a href ="../HTML/toastmaster.html">Tal & Toastmaster</a>
        <a href ="../HTML/contact.html">Kontakt</a>
    </div>
`