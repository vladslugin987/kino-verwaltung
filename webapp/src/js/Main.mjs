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

//functions for operator

//restrict the items in the movie table per page to 3
let shows = [];
let currentMoviePage = 1;
const itemsPerMoviePage = 3;

//restrict the items in the hall table per page to 3

let halls = [];
let currentHallPage = 1;
const itemsPerHallPage = 3;

// creating the hall

const nameInput = document.getElementById("hall-name");
const rowInput = document.getElementById("rows-count");
const seatsPerRowInput = document.getElementById("seats-per-row");
const tableBodyHall = document.getElementById("tableBodyHall");
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

  let all = rows * seatsPerRow;
  halls.push({
    name,
    rows,
    seatsPerRow,
    all,
  });
  renderHallTable();
});

const hallPageInfo = document.getElementById("infoHall");
function renderHallTable(){
  tableBodyHall.innerHTML = "";

  const start = (currentHallPage - 1) * itemsPerHallPage;
  const end = start + itemsPerHallPage;

  const totalPages = Math.max(1, Math.ceil(halls.length / itemsPerHallPage));

  const pageItems = halls.slice(start, end);

  pageItems.forEach(hall => {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".name").textContent = hall.name;
    clone.querySelector(".reihen").textContent = hall.rows;
    clone.querySelector(".sitze").textContent = hall.seatsPerRow;
    clone.querySelector(".gesamtkapazität").textContent = hall.all;

    tableBodyHall.appendChild(clone);
  });
   hallPageInfo.textContent = `Seite ${currentHallPage} von ${totalPages}`;

}
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

  shows.push({
  movie,
  hall,
  date,
  time,
  seats: 80
});

renderMovieTable();
});

const moviePageInfo = document.getElementById("infoMovie");

function renderMovieTable() {
  tableBodyFilm.innerHTML = "";

  const start = (currentMoviePage - 1) * itemsPerMoviePage;
  const end = start + itemsPerMoviePage;

  const totalPages = Math.max(1, Math.ceil(shows.length / itemsPerMoviePage));

  const pageItems = shows.slice(start, end);

  pageItems.forEach(show => {
    const clone = movieTemplate.content.cloneNode(true);

    clone.querySelector(".movieName").textContent = show.movie;
    clone.querySelector(".hall").textContent = show.hall;
    clone.querySelector(".date").textContent = show.date;
    clone.querySelector(".time").textContent = show.time;
    clone.querySelector(".availableSeats").textContent = show.seats;

    tableBodyFilm.appendChild(clone);
  });

  moviePageInfo.textContent = `Seite ${currentMoviePage} von ${totalPages}`;
}

//toggle halls and movies
//halls
document.getElementById("prevButtonHall").addEventListener("click", () => {
  if (currentHallPage > 1) {
    currentHallPage--;
    renderHallTable();
  }
});

document.getElementById("nextButtonHall").addEventListener("click", () => {
  if (currentHallPage * itemsPerHallPage < halls.length) {
    currentHallPage++;
    renderHallTable();
  }
});
//shows
document.getElementById("prevButtonMovie").addEventListener("click", () => {
  if (currentMoviePage > 1) {
    currentMoviePage--;
    renderMovieTable();
  }
});

document.getElementById("nextButtonMovie").addEventListener("click", () => {
  if (currentMoviePage * itemsPerMoviePage < shows.length) {
    currentMoviePage++;
    renderMovieTable();
  }
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
