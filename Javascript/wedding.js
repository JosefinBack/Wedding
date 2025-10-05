const form = document.getElementById("osaForm");
const personsDiv = document.getElementById("persons");
const addPersonBtn = document.getElementById("addPerson");
const message = document.getElementById("message");

// Datum för bröllopet
const weddingDate = new Date("May 9, 2026 15:00:00").getTime();

// Uppdatera varje sekund
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = `
      <span>${days} dagar</span>
      <span>${hours} timmar</span>
      <span>${minutes} minuter</span>
      <span>${seconds} sekunder</span>
    `;

    if (distance < 0) {
        clearInterval(countdown);
        document.getElementById("countdown").innerHTML = "Idag är det bröllop! 🎉💍";
    }
}

// 🔹 Kör direkt en gång (så den visas direkt)
updateCountdown();
// 🔹 Uppdatera varje sekund därefter
const countdown = setInterval(updateCountdown, 1000);


// 🔸 Funktion som uppdaterar formuläret beroende på "kommer/inte"
function updatePersonFields() {
    const attendance = form.querySelector('input[name="attendance"]:checked')?.value;

    const allPersons = personsDiv.querySelectorAll(".person");
    allPersons.forEach(person => {
        const allergyLabel = person.querySelector('.allergy-field');
        if (!allergyLabel) return; // hoppa över om fältet inte finns

        if (attendance === "NEJ") {
            allergyLabel.style.display = "none";
            const allergyInput = allergyLabel.querySelector('input');
            if (allergyInput) allergyInput.value = ""; // rensa ev. tidigare allergidata
        } else {
            allergyLabel.style.display = "block";
        }
    });

    // Dölj knappen "Lägg till person" om man valt NEJ
    addPersonBtn.style.display = attendance === "NEJ" ? "none" : "inline-block";
}

// Lägg till ny person
addPersonBtn.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("person");
    div.innerHTML = `
        <label>Namn: <input type="text" name="name[]" required></label>
        <label class="allergy-field">Allergier: <input type="text" name="allergy[]"></label>
        <button type="button" class="removePerson">Ta bort</button>
    `;
    personsDiv.appendChild(div);

    div.querySelector(".removePerson").addEventListener("click", () => div.remove());
    updatePersonFields(); // uppdatera synlighet för nya fältet
});

// Lyssna på ändring av JA/NEJ
form.querySelectorAll('input[name="attendance"]').forEach(radio => {
    radio.addEventListener("change", updatePersonFields);
});

// Hantera OSA-svar
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const attendance = form.querySelector('input[name="attendance"]:checked')?.value;
    const names = [...form.querySelectorAll('input[name="name[]"]')].map(i => i.value);
    const allergies = [...form.querySelectorAll('input[name="allergy[]"]')].map(i => i.value);

    const data = names.map((name, i) => ({
        name: name,
        allergy: attendance === "NEJ" ? "" : (allergies[i] || ""),
        attendance: attendance
    }));

    message.textContent = "Skickar...";


    // 🟢 Bekräftelse innan skick
    let confirmationText = "Är du säker på att du vill skicka din OSA?\n\n";
    if (attendance === "JA") {
        confirmationText += `Du kommer att OSA JA för ${names.join(", ")}.`;
    } else {
        confirmationText += `Du kommer att OSA NEJ för ${names.join(", ")}.`;
    }

    const confirmed = confirm(confirmationText);
    if (!confirmed) {
        message.textContent = "Inget skickades.";
        return;
    }

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwuz6oH2h0Nna1yiJy2GxIJUecwpLpWQ8XOV8871SSshfqM7sDE-9jvbQzLkBbTniRoyw/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        message.textContent = "Tack för din OSA! 💕";
        form.reset();
        personsDiv.innerHTML = `
            <div class="person">
                <label>Namn: <input type="text" name="name[]" required></label>
                <label class="allergy-field">Allergier: <input type="text" name="allergy[]"></label>
            </div>`;
    } catch (error) {
        console.error(error);
        message.textContent = "Något gick fel. Försök igen senare.";
    }
});
