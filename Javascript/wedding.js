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
    let attendanceRadio = form.querySelector('input[name="attendance"]:checked');
    let attendance = "";

    if (attendanceRadio) {
        attendance = attendanceRadio.value;
    }

    let allPersons = personsDiv.querySelectorAll(".person");
    for (let i = 0; i < allPersons.length; i++) {
        let person = allPersons[i];
        let allergyLabel = person.querySelector(".allergy-field");

        if (!allergyLabel) {
            continue;
        }

        if (attendance === "NEJ") {
            allergyLabel.style.display = "none";
            let allergyInput = allergyLabel.querySelector("input");
            if (allergyInput) {
                allergyInput.value = "";
            }
        } else {
            allergyLabel.style.display = "block";
        }
    }

    if (attendance === "NEJ") {
        addPersonBtn.style.display = "none";
    } else {
        addPersonBtn.style.display = "inline-block";
    }
}

/* =========================================================
   Lägg till ny person
========================================================= */
addPersonBtn.addEventListener("click", function () {
    const div = document.createElement("div");
    div.classList.add("person");

    div.innerHTML =
        '<label>Förnamn:' +
        '<input type="text" name="firstName[]" class="input-field" required>' +
        '</label>' +
        '<label>Efternamn:' +
        '<input type="text" name="lastName[]" class="input-field" required>' +
        '</label>' +
        '<label class="allergy-field">Allergier:' +
        '<input type="text" name="allergy[]" class="input-field" ' +
        'placeholder="Lämna tom om du ej har någon allergi">' +
        '</label>' +
        '<button type="button" class="removePerson">Ta bort</button>';

    personsDiv.appendChild(div);

    const removeBtn = div.querySelector(".removePerson");
    removeBtn.addEventListener("click", function () {
        div.remove();
    });

    updatePersonFields();
});

/* =========================================================
   Lyssna på ändring av JA/NEJ
========================================================= */
const attendanceRadios = form.querySelectorAll('input[name="attendance"]');
for (let i = 0; i < attendanceRadios.length; i++) {
    attendanceRadios[i].addEventListener("change", function () {
        updatePersonFields();
    });
}

/* =========================================================
   Hantera OSA-svar
========================================================= */
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let attendanceRadio = form.querySelector('input[name="attendance"]:checked');
    let attendance = "";

    if (attendanceRadio) {
        attendance = attendanceRadio.value;
    }

    const firstNameInputs = form.querySelectorAll('input[name="firstName[]"]');
    const lastNameInputs = form.querySelectorAll('input[name="lastName[]"]');
    const allergyInputs = form.querySelectorAll('input[name="allergy[]"]');

    let data = [];

    for (let i = 0; i < firstNameInputs.length; i++) {
        const firstName = firstNameInputs[i].value;
        const lastName = lastNameInputs[i].value;
        let allergy = "";

        if (attendance !== "NEJ") {
            allergy = allergyInputs[i].value;
        }

        data.push({
            firstName: firstName,
            lastName: lastName,
            allergy: allergy,
            attendance: attendance
        });
    }

    /* =========================================================
       Bekräftelse innan skick
    ========================================================= */
    let confirmationText = "Är du säker på att du vill skicka din OSA?\n\n";
    if (attendance === "JA") {
        confirmationText = confirmationText + "Du kommer att OSA JA för ";
    } else {
        confirmationText = confirmationText + "Du kommer att OSA NEJ för ";
    }

    let nameList = [];
    for (let j = 0; j < firstNameInputs.length; j++) {
        nameList.push(firstNameInputs[j].value);
    }

    confirmationText = confirmationText + nameList.join(", ") + ".";

    const confirmed = confirm(confirmationText);
    if (!confirmed) {
        message.textContent = "Inget skickades.";
        return;
    }

    message.textContent = "Skickar...";

    /* =========================================================
       Skicka till Google Sheet
    ========================================================= */
    try {
        for (let i = 0; i < data.length; i++) {
            const person = data[i];

            await fetch("https://script.google.com/macros/s/AKfycbwLRhAmnDpn1rTP-s2EU24272tvxl8tMfU7VseOyXjqSNgTR-3vSYLiteemzCwnuGe45g/exec", {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(person)
            });
        }

        message.textContent = "Tack för din OSA! 💕";

        form.reset();

        personsDiv.innerHTML =
            '<div class="person">' +
            '<label>Förnamn:' +
            '<input type="text" name="firstName[]" class="input-field" required>' +
            '</label>' +
            '<label>Efternamn:' +
            '<input type="text" name="lastName[]" class="input-field" required>' +
            '</label>' +
            '<label class="allergy-field">Allergier:' +
            '<input type="text" name="allergy[]" class="input-field" ' +
            'placeholder="Lämna tom om du ej har någon allergi">' +
            '</label>' +
            '</div>';
    } catch (error) {
        console.error(error);
        message.textContent = "Något gick fel. Försök igen senare.";
    }
});