const operatorPage = document.getElementById('operator-page');
const customerPage = document.getElementById('customer-page');
const operatorButton = document.getElementById('operator-button');
const customerButton = document.getElementById('customer-button');

const setActiveRole = (role) => {
  if (role === 'operator') {
    operatorPage.style.display = 'block';
    customerPage.style.display = 'none';
    operatorButton.classList.add('is-active');
    customerButton.classList.remove('is-active');
  } else {
    customerPage.style.display = 'block';
    operatorPage.style.display = 'none';
    customerButton.classList.add('is-active');
    operatorButton.classList.remove('is-active');
  }
};

operatorButton.addEventListener('click', () => {
  setActiveRole('operator');
});

customerButton.addEventListener('click', () => {
  setActiveRole('customer');
});

setActiveRole('operator');

// creating the hall

const nameInput = document.getElementById("hall-name");
const rowInput = document.getElementById("rows-count");
const seatsPerRowInput = document.getElementById("seats-per-row");
const tableBody = document.getElementById("tableBodyHall");
const template = document.getElementById("row-template");


document.getElementById('create-hall-button').addEventListener('click', () => {
  const name = nameInput.value;
  const rows = rowInput.value;
  const seatsPerRow = seatsPerRowInput.value;

  
  const clone = template.content.cloneNode(true);

  
  clone.querySelector(".name").textContent = name;
  clone.querySelector(".reihen").textContent = rows;
  clone.querySelector(".sitze").textContent = seatsPerRow;
  clone.querySelector(".gesamtkapazität").textContent = rows * seatsPerRow;

  tableBody.appendChild(clone);
});

//create movie

const movieNameInput = document.getElementById("movie-name");
const hallInput = document.getElementById("hall-select");
const dateInput = document.getElementById("show-date");
const timeInput = document.getElementById("show-time");
const tableBodyFilm = document.getElementById("tableBodyFilm");
const movieTemplate = document.getElementById("movieTemplate");

document.getElementById('create-show-button').addEventListener('click', () => {
  const movie = movieNameInput.value;
  const hall = hallInput.value;
  const date = dateInput.value;
  const time = timeInput.value;

  const clone = movieTemplate.content.cloneNode(true);

  clone.querySelector(".movieName").textContent = movie;
  clone.querySelector(".hall").textContent = hall;
  clone.querySelector(".date").textContent = date;
  clone.querySelector(".time").textContent = time;
  clone.querySelector(".availableSeats").textContent = 80; //TODO: insert variable 

  tableBodyFilm.appendChild(clone);
});

// Kunde Seite
const seatSelectionTitle = document.getElementById('seat-selection-title');
const seatSelectionHint = document.getElementById('seat-selection-hint');
const seatSelectionContent = document.getElementById('seat-selection-content');
const reserveSeatsButton = document.getElementById('reserve-seats-button');
const seatSelectButtons = document.querySelectorAll('.js-select-seats');

const updateSeatSelectionTitle = (button) => {
  if (!seatSelectionTitle || !seatSelectionHint) {
    return;
  }

  const { movie, date, time } = button.dataset;
  seatSelectionTitle.textContent = `Sitzplatzauswahl - ${movie} (${date}, ${time})`;
  seatSelectionHint.style.display = 'none';
  seatSelectionContent.style.display = 'block';
};

if (seatSelectionTitle) {
  seatSelectionTitle.textContent = '';
}
if (seatSelectionContent) {
  seatSelectionContent.style.display = 'none';
}

seatSelectButtons.forEach((button) => {
  button.addEventListener('click', () => updateSeatSelectionTitle(button));
});

const markSelectedSeatsAsTaken = () => {
  if (!seatSelectionContent) {
    return;
  }

  const selectedSeats = seatSelectionContent.querySelectorAll('.seat-toggle:checked');
  selectedSeats.forEach((seatToggle) => {
    seatToggle.checked = false;
    seatToggle.disabled = true;

    const seatLabel = seatToggle.nextElementSibling;
    if (seatLabel) {
      seatLabel.classList.add('seat--taken');
    }
  });
};

if (reserveSeatsButton) {
  reserveSeatsButton.addEventListener('click', markSelectedSeatsAsTaken);
}
