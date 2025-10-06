const form = document.getElementById("osaForm");
const addPersonBtn = document.getElementById("addPerson");
const message = document.getElementById("message");

/* =========================================================
   Uppdatera fälten beroende på JA/NEJ
========================================================= */
function updatePersonFields() {
    const attendanceRadio = form.querySelector('input[name="attendance"]:checked');
    let attendance = "";

    if (attendanceRadio) {
        attendance = attendanceRadio.value;
    }

    const allSections = form.querySelectorAll(".persons");
    for (let i = 0; i < allSections.length; i++) {
        const personSection = allSections[i];
        const allergyLabel = personSection.querySelector('label:nth-child(3)'); // tredje labeln är allergier
        if (!allergyLabel) {
            continue;
        }

        if (attendance === "NEJ") {
            allergyLabel.style.display = "none";
            const allergyInput = allergyLabel.querySelector("input");
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
   Lägg till ny persons-sektion
========================================================= */
addPersonBtn.addEventListener("click", function () {
    const newSection = document.createElement("div");
    newSection.classList.add("divInForm");

    newSection.innerHTML = `
        <p>Personlig information</p>
        <div class="persons">
            <label>Förnamn:
                <input type="text" name="firstName[]" class="input-field" required>
            </label>
            <label>Efternamn:
                <input type="text" name="lastName[]" class="input-field" required>
            </label>
            <label class="allergy-field">Allergier:
                <input type="text" name="allergy[]" class="input-field"
                       placeholder="Lämna tom om du ej har någon allergi">
            </label>
        </div>
        <button type="button" class="removePerson">Ta bort</button>
    `;

    form.insertBefore(newSection, addPersonBtn);

    const removeBtn = newSection.querySelector(".removePerson");
    removeBtn.addEventListener("click", function () {
        newSection.remove();
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

    const attendanceRadio = form.querySelector('input[name="attendance"]:checked');
    let attendance = "";
    if (attendanceRadio) {
        attendance = attendanceRadio.value;
    }

    const firstNames = form.querySelectorAll('input[name="firstName[]"]');
    const lastNames = form.querySelectorAll('input[name="lastName[]"]');
    const allergies = form.querySelectorAll('input[name="allergy[]"]');

    let data = [];

    for (let i = 0; i < firstNames.length; i++) {
        const firstName = firstNames[i].value;
        const lastName = lastNames[i].value;
        let allergy = "";

        if (attendance !== "NEJ") {
            allergy = allergies[i].value;
        }

        data.push({
            firstName: firstName,
            lastName: lastName,
            allergy: allergy,
            attendance: attendance
        });
    }

    /* ===== Bekräftelseruta ===== */
    let confirmationText = "Är du säker på att du vill skicka din OSA?\n\n";
    if (attendance === "JA") {
        confirmationText += "Du kommer att OSA JA för ";
    } else {
        confirmationText += "Du kommer att OSA NEJ för ";
    }

    let names = [];
    for (let i = 0; i < firstNames.length; i++) {
        names.push(firstNames[i].value + " " + lastNames[i].value);
    }
    confirmationText += names.join(", ") + ".";

    // Visa egen bekräftelseruta
    const overlay = document.getElementById("confirmationOverlay");
    const confirmTextEl = document.getElementById("confirmText");
    const confirmYesBtn = document.getElementById("confirmYes");
    const confirmNoBtn = document.getElementById("confirmNo");

    confirmTextEl.textContent = confirmationText;
    overlay.style.display = "flex";

    // Vänta på användarens svar (via Promise)
    const userConfirmed = await new Promise(function (resolve) {
        confirmYesBtn.onclick = function () {
            overlay.style.display = "none";
            resolve(true);
        };
        confirmNoBtn.onclick = function () {
            overlay.style.display = "none";
            resolve(false);
        };
    });

    if (!userConfirmed) {
        message.textContent = "Inget skickades.";
        return;
    }

    message.textContent = "Skickar...";

    /* ===== Skicka till Google Sheet ===== */
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

        // Återställ till en tom persons-sektion
        form.querySelectorAll(".divInForm").forEach(function (section, index) {
            if (index > 0) section.remove();
        });
    } catch (error) {
        console.error(error);
        message.textContent = "Något gick fel. Försök igen senare.";
    }
});
