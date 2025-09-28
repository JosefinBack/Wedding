// Datum för bröllopet
const weddingDate = new Date("May 9, 2026 14:00:00").getTime();

// Uppdatera varje sekund
const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // Räkna ut dagar, timmar, minuter, sekunder
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Skriv ut på sidan
    document.getElementById("countdown").innerHTML = `
    <span>${days} dagar</span>
    <span>${hours} timmar</span>
    <span>${minutes} minuter</span>
    <span>${seconds} sekunder</span>
    `;

    // Om nedräkningen är slut
    if (distance < 0) {
        clearInterval(countdown);
        document.getElementById("countdown").innerHTML =
            "Idag är det bröllop! 🎉💍";
    }
}, 1000);
