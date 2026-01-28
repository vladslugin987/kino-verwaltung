const operatorPage = document.getElementById("operator-page");
const customerPage = document.getElementById("customer-page");
const operatorButton = document.getElementById("operator-button");
const customerButton = document.getElementById("customer-button");

const setActiveRole = (role) => {
  if (role === "operator") {
    operatorPage.style.display = "block";
    customerPage.style.display = "none";
    operatorButton.classList.add("is-active");
    customerButton.classList.remove("is-active");
  } else {
    customerPage.style.display = "block";
    operatorPage.style.display = "none";
    customerButton.classList.add("is-active");
    operatorButton.classList.remove("is-active");
  }
};

operatorButton.addEventListener("click", () => {
  setActiveRole("operator");
});

customerButton.addEventListener("click", () => {
  setActiveRole("customer");
});

setActiveRole("operator");

document.getElementById("create-hall-button").addEventListener("click", () => {
  // TODO: Kinosaal anlegen implementieren
});

document.getElementById("create-show-button").addEventListener("click", () => {
  // TODO: Vorstellung anlegen implementieren
});

// Kunde Seite
const seatSelectionTitle = document.getElementById("seat-selection-title");
const seatSelectionHint = document.getElementById("seat-selection-hint");
const seatSelectionContent = document.getElementById("seat-selection-content");
const seatSelectButtons = document.querySelectorAll(".js-select-seats");

const updateSeatSelectionTitle = (button) => {
  if (!seatSelectionTitle || !seatSelectionHint) {
    return;
  }

  const { movie, date, time } = button.dataset;
  seatSelectionTitle.textContent = `Sitzplatzauswahl - ${movie} (${date}, ${time})`;
  seatSelectionHint.style.display = "none";
  seatSelectionContent.style.display = "block";
};

if (seatSelectionTitle) {
  seatSelectionTitle.textContent = "";
}
if (seatSelectionContent) {
  seatSelectionContent.style.display = "none";
}

seatSelectButtons.forEach((button) => {
  button.addEventListener("click", () => updateSeatSelectionTitle(button));
});
