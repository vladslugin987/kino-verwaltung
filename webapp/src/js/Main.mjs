import QRCode from 'qrcode';

const operatorPage = document.getElementById('operator-page');
const customerPage = document.getElementById('customer-page');
const operatorButton = document.getElementById('operator-button');
const customerButton = document.getElementById('customer-button');

const shows = [];
const halls = [];
const reservations = [];

let currentMoviePage = 1;
let currentHallPage = 1;
let currentCustomerPage = 1;
let currentSelectedShowIndex = null;

let itemsPerMoviePage = 4;
let itemsPerHallPage = 4;
let itemsPerCustomerPage = 4;

const nameInput = document.getElementById('hall-name');
const rowInput = document.getElementById('rows-count');
const seatsPerRowInput = document.getElementById('seats-per-row');
const tableBodyHall = document.getElementById('tableBodyHall');
const template = document.getElementById('row-template');
const hallPageInfo = document.getElementById('infoHall');

const movieNameInput = document.getElementById('movie-name');
const hallInput = document.getElementById('hall-select');
const dateInput = document.getElementById('show-date');
const timeInput = document.getElementById('show-time');
const tableBodyFilm = document.getElementById('tableBodyFilm');
const movieTemplate = document.getElementById('movieTemplate');
const moviePageInfo = document.getElementById('infoMovie');
const hallPagination = document.getElementById('prevButtonHall').closest('.table-pagination');
const moviePagination = document.getElementById('prevButtonMovie').closest('.table-pagination');

const tableBodyCustomer = document.getElementById('tableBodyCustomer');
const customerTemplate = document.getElementById('customerMovieTemplate');
const customerPageInfo = document.getElementById('infoCustomer');
const customerPagination = document.getElementById('prevCustomerButton').closest('.table-pagination');
const seatSelectionTitle = document.getElementById('seat-selection-title');
const seatSelectionHint = document.getElementById('seat-selection-hint');
const seatSelectionContent = document.getElementById('seat-selection-content');
const seatGrid = document.getElementById('seat-grid');
const reserveSeatsButton = document.getElementById('reserve-seats-button');
const customerNameInput = document.getElementById('customer-name');
const reservationTicket = document.getElementById('reservation-ticket');
const reservationQr = document.getElementById('reservation-qr');
const reservationTicketText = document.getElementById('reservation-ticket-text');
const printReservationButton = document.getElementById('print-reservation-button');
const operatorReservationTicket = document.getElementById('operator-reservation-ticket');
const operatorReservationQr = document.getElementById('operator-reservation-qr');
const operatorReservationTicketText = document.getElementById('operator-reservation-ticket-text');
const printOperatorReservationButton = document.getElementById('print-operator-reservation-button');
const closeReservationButton = document.getElementById('close-reservation-button');
const closeOperatorReservationButton = document.getElementById('close-operator-reservation-button');
const tableBodyReservations = document.getElementById('tableBodyReservations');
const reservationTemplate = document.getElementById('reservationTemplate');

// role switch (operator / customer)
function setActiveRole (role) {
  if (role === 'operator') {
    operatorPage.style.display = 'block';
    customerPage.style.display = 'none';
    operatorButton.classList.add('is-active');
    customerButton.classList.remove('is-active');
    recalculateItemsPerPage();
    renderHallTable();
    renderMovieTable();
    renderReservationsTable();
  } else {
    customerPage.style.display = 'block';
    operatorPage.style.display = 'none';
    customerButton.classList.add('is-active');
    operatorButton.classList.remove('is-active');
    recalculateItemsPerPage();
    renderCustomerTable();
  }
}

function calculateHallCapacity (hall) {
  const rows = Number(hall.rows);
  const seatsPerRow = Number(hall.seatsPerRow);
  return rows * seatsPerRow;
}

function findHallByName (hallName) {
  for (let i = 0; i < halls.length; i++) {
    if (halls[i].name === hallName) {
      return halls[i];
    }
  }
  return null;
}

function findShowIndexById (showId) {
  for (let i = 0; i < shows.length; i++) {
    if (String(shows[i]._id) === String(showId)) {
      return i;
    }
  }
  return -1;
}

function findShowById (showId) {
  for (let i = 0; i < shows.length; i++) {
    if (String(shows[i]._id) === String(showId)) {
      return shows[i];
    }
  }
  return null;
}

function getShowFromReservation (reservation) {
  if (reservation.show) {
    return reservation.show;
  }

  if (reservation.showId) {
    const show = findShowById(reservation.showId);
    if (show) return show;
  }

  return {
    movie: '-',
    hall: '-',
    date: '-',
    time: '-'
  };
}

function refreshHallSelectOptions () {
  const currentValue = hallInput.value;
  hallInput.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Bitte Saal auswählen';
  hallInput.appendChild(placeholder);

  for (let i = 0; i < halls.length; i++) {
    const option = document.createElement('option');
    option.value = halls[i].name;
    option.textContent = halls[i].name;
    hallInput.appendChild(option);
  }

  if (currentValue) {
    hallInput.value = currentValue;
  } else {
    hallInput.value = '';
  }
}

function clampPageIndexes () {
  const totalHallPages = Math.max(1, Math.ceil(halls.length / itemsPerHallPage));
  const totalMoviePages = Math.max(1, Math.ceil(shows.length / itemsPerMoviePage));
  const totalCustomerPages = Math.max(1, Math.ceil(shows.length / itemsPerCustomerPage));

  if (currentHallPage > totalHallPages) currentHallPage = totalHallPages;
  if (currentMoviePage > totalMoviePages) currentMoviePage = totalMoviePages;
  if (currentCustomerPage > totalCustomerPages) currentCustomerPage = totalCustomerPages;
}

function recalculateItemsPerPage () {
  itemsPerHallPage = calculateItemsPerPageForTable(tableBodyHall, hallPagination);
  itemsPerMoviePage = calculateItemsPerPageForTable(tableBodyFilm, moviePagination);
  itemsPerCustomerPage = calculateItemsPerPageForTable(tableBodyCustomer, customerPagination);

  clampPageIndexes();
}

function calculateItemsPerPageForTable (tableBody, paginationElement) {
  const tableRect = tableBody.getBoundingClientRect();
  const paginationHeight = paginationElement ? paginationElement.offsetHeight : 0;
  const firstRow = tableBody.querySelector('tr');
  const rowHeight = firstRow ? Math.ceil(firstRow.getBoundingClientRect().height) : 44;
  const freeSpace = window.innerHeight - tableRect.top - paginationHeight - 20;
  let itemsPerPage = Math.floor(freeSpace / rowHeight);

  if (!Number.isFinite(itemsPerPage) || itemsPerPage < 1) itemsPerPage = 1;
  return itemsPerPage;
}

// count reserved seats from saved reservations
function recomputeReservedSeats () {
  for (let i = 0; i < shows.length; i++) {
    shows[i].reservedSeats = 0;
    const hall = findHallByName(shows[i].hall);
    if (hall) {
      shows[i].totalSeats = calculateHallCapacity(hall);
    } else if (!shows[i].totalSeats) {
      shows[i].totalSeats = 0;
    }
  }

  for (let j = 0; j < reservations.length; j++) {
    const reservation = reservations[j];
    const showId = reservation.show && reservation.show._id ? reservation.show._id : reservation.showId;
    const idx = findShowIndexById(showId);

    if (idx !== -1 && Array.isArray(reservation.seats)) {
      shows[idx].reservedSeats = shows[idx].reservedSeats + reservation.seats.length;
    }
  }
}

// load halls from backend
async function loadHalls () {
  const response = await fetch('/api/halls');
  const data = await response.json();

  halls.length = 0;
  for (let i = 0; i < data.length; i++) {
    const hall = data[i];
    hall.all = calculateHallCapacity(hall);
    halls.push(hall);
  }
}

// load shows from backend
async function loadShows () {
  const response = await fetch('/api/shows');
  const data = await response.json();

  shows.length = 0;
  for (let i = 0; i < data.length; i++) {
    const show = data[i];
    const hall = findHallByName(show.hall);

    if (hall) {
      show.totalSeats = calculateHallCapacity(hall);
    } else if (!show.totalSeats) {
      show.totalSeats = 0;
    }

    show.reservedSeats = 0;
    shows.push(show);
  }
}

// load reservations from backend
async function loadReservations () {
  const response = await fetch('/api/reservations');
  const data = await response.json();

  reservations.length = 0;
  for (let i = 0; i < data.length; i++) {
    reservations.push(data[i]);
  }
}

// return all taken seat numbers for one show
function getTakenSeatsForShow (show) {
  const takenSeats = [];

  for (let i = 0; i < reservations.length; i++) {
    const reservation = reservations[i];
    const reservationShowId = reservation.show && reservation.show._id ? reservation.show._id : reservation.showId;

    if (String(reservationShowId) === String(show._id) && Array.isArray(reservation.seats)) {
      for (let j = 0; j < reservation.seats.length; j++) {
        takenSeats.push(Number(reservation.seats[j]));
      }
    }
  }

  return takenSeats;
}

// build seat grid dynamically from hall rows/seats
function renderSeatGridForShow (show) {
  const hall = findHallByName(show.hall);
  if (!hall) {
    seatGrid.innerHTML = '';
    return;
  }

  const rows = Number(hall.rows);
  const seatsPerRow = Number(hall.seatsPerRow);
  let seatNumber = 1;

  seatGrid.innerHTML = '';

  for (let row = 0; row < rows; row++) {
    const rowElement = document.createElement('div');
    rowElement.className = 'seat-row';

    for (let seat = 0; seat < seatsPerRow; seat++) {
      const input = document.createElement('input');
      input.className = 'seat-toggle';
      input.type = 'checkbox';
      input.id = `seat-${seatNumber}`;

      const label = document.createElement('label');
      label.className = 'seat';
      label.setAttribute('for', input.id);
      label.textContent = String(seatNumber);

      rowElement.appendChild(input);
      rowElement.appendChild(label);
      seatNumber++;
    }

    seatGrid.appendChild(rowElement);
  }
}

// update seat grid for currently selected show
function applySeatGridForShow (show) {
  renderSeatGridForShow(show);

  const seatToggles = seatSelectionContent.querySelectorAll('.seat-toggle');
  const takenSeats = getTakenSeatsForShow(show);

  for (let i = 0; i < seatToggles.length; i++) {
    const seatToggle = seatToggles[i];
    const seatId = seatToggle.id;
    const seatNumber = Number(seatId.replace('seat-', ''));
    const seatLabel = seatSelectionContent.querySelector(`label[for="${seatId}"]`);
    let isTaken = false;

    for (let j = 0; j < takenSeats.length; j++) {
      if (takenSeats[j] === seatNumber) {
        isTaken = true;
        break;
      }
    }

    seatToggle.checked = false;
    seatToggle.disabled = isTaken;

    if (seatLabel) {
      if (isTaken) {
        seatLabel.classList.add('seat--taken');
      } else {
        seatLabel.classList.remove('seat--taken');
      }
    }
  }
}

// table: halls
function renderHallTable () {
  tableBodyHall.innerHTML = '';

  const start = (currentHallPage - 1) * itemsPerHallPage;
  const end = start + itemsPerHallPage;
  const totalPages = Math.max(1, Math.ceil(halls.length / itemsPerHallPage));
  const pageItems = halls.slice(start, end);

  for (let i = 0; i < pageItems.length; i++) {
    const hall = pageItems[i];
    const clone = template.content.cloneNode(true);

    clone.querySelector('.name').textContent = hall.name;
    clone.querySelector('.reihen').textContent = hall.rows;
    clone.querySelector('.sitze').textContent = hall.seatsPerRow;
    clone.querySelector('.gesamtkapazität').textContent = calculateHallCapacity(hall);

    tableBodyHall.appendChild(clone);
  }

  hallPageInfo.textContent = `Seite ${currentHallPage} von ${totalPages}`;
}

// table: shows (operator)
function renderMovieTable () {
  tableBodyFilm.innerHTML = '';

  const start = (currentMoviePage - 1) * itemsPerMoviePage;
  const end = start + itemsPerMoviePage;
  const totalPages = Math.max(1, Math.ceil(shows.length / itemsPerMoviePage));
  const pageItems = shows.slice(start, end);

  for (let i = 0; i < pageItems.length; i++) {
    const show = pageItems[i];
    const clone = movieTemplate.content.cloneNode(true);

    clone.querySelector('.movieName').textContent = show.movie;
    clone.querySelector('.hall').textContent = show.hall;
    clone.querySelector('.date').textContent = show.date;
    clone.querySelector('.time').textContent = show.time;
    clone.querySelector('.availableSeats').textContent =
      `${show.totalSeats - show.reservedSeats}/${show.totalSeats}`;

    tableBodyFilm.appendChild(clone);
  }

  moviePageInfo.textContent = `Seite ${currentMoviePage} von ${totalPages}`;
}

function renderReservationsTable () {
  tableBodyReservations.innerHTML = '';

  for (let i = 0; i < reservations.length; i++) {
    const reservation = reservations[i];
    const show = getShowFromReservation(reservation);
    const clone = reservationTemplate.content.cloneNode(true);
    const ticketButton = clone.querySelector('.r-ticket-button');

    clone.querySelector('.r-movie').textContent = show.movie;
    clone.querySelector('.r-hall').textContent = show.hall;
    clone.querySelector('.r-date').textContent = show.date;
    clone.querySelector('.r-time').textContent = show.time;
    clone.querySelector('.r-customer').textContent = reservation.customerName || '-';
    clone.querySelector('.r-seats').textContent = Array.isArray(reservation.seats) ? reservation.seats.join(', ') : '-';

    if (ticketButton) {
      ticketButton.addEventListener('click', async function () {
        await showOperatorReservationTicket(reservation, show);
      });
    }

    tableBodyReservations.appendChild(clone);
  }
}

// table: shows (customer)
function renderCustomerTable () {
  tableBodyCustomer.innerHTML = '';

  const start = (currentCustomerPage - 1) * itemsPerCustomerPage;
  const end = start + itemsPerCustomerPage;
  const totalPages = Math.max(1, Math.ceil(shows.length / itemsPerCustomerPage));
  const pageItems = shows.slice(start, end);

  for (let i = 0; i < pageItems.length; i++) {
    const show = pageItems[i];
    const clone = customerTemplate.content.cloneNode(true);
    const available = show.totalSeats - show.reservedSeats;
    const button = clone.querySelector('.js-select-seats');
    const globalIndex = start + i;

    clone.querySelector('.c-movie').textContent = show.movie;
    clone.querySelector('.c-date').textContent = show.date;
    clone.querySelector('.c-time').textContent = show.time;
    clone.querySelector('.c-hall').textContent = show.hall;
    clone.querySelector('.c-available').textContent = `${available}/${show.totalSeats}`;

    button.dataset.index = globalIndex;
    button.dataset.movie = show.movie;
    button.dataset.date = show.date;
    button.dataset.time = show.time;

    button.addEventListener('click', function () {
      currentSelectedShowIndex = globalIndex;
      updateSeatSelectionTitle(button);
      applySeatGridForShow(show);
    });

    tableBodyCustomer.appendChild(clone);
  }

  customerPageInfo.textContent = `Seite ${currentCustomerPage} von ${totalPages}`;
}

function updateSeatSelectionTitle (button) {
  const movie = button.dataset.movie;
  const date = button.dataset.date;
  const time = button.dataset.time;

  seatSelectionTitle.textContent = `Sitzplatzauswahl - ${movie} (${date}, ${time})`;
  seatSelectionHint.style.display = 'none';
  seatSelectionContent.style.display = 'block';
}

// read selected seats from UI
function getSelectedSeatNumbers () {
  const selectedSeatToggles = seatSelectionContent.querySelectorAll('.seat-toggle:checked');
  const seatNumbers = [];

  for (let i = 0; i < selectedSeatToggles.length; i++) {
    const id = selectedSeatToggles[i].id;
    const number = Number(id.replace('seat-', ''));
    seatNumbers.push(number);
  }

  return seatNumbers;
}

async function generateQrImageDataUrl (text) {
  const dataUrl = await QRCode.toDataURL(text, {
    width: 220,
    margin: 1
  });
  return dataUrl;
}

function buildQrPayload (reservationId, show, seatNumbers, customerName) {
  return `reservationId:${reservationId};movie:${show.movie};hall:${show.hall};date:${show.date};time:${show.time};customer:${customerName};seats:${seatNumbers.join(',')}`;
}

function clearPrintTargets () {
  if (reservationTicket) reservationTicket.classList.remove('print-target');
  if (operatorReservationTicket) operatorReservationTicket.classList.remove('print-target');
}

async function fillTicketBlock (ticketElement, qrElement, textElement, reservation, show, seatNumbers, customerName) {
  const reservationId = reservation._id ? String(reservation._id) : 'n/a';
  const qrPayload = buildQrPayload(reservationId, show, seatNumbers, customerName);

  qrElement.src = await generateQrImageDataUrl(qrPayload);
  textElement.textContent =
    `Film: ${show.movie} | Saal: ${show.hall} | Datum: ${show.date} ${show.time} | Name: ${customerName} | Sitze: ${seatNumbers.join(', ')} | ID: ${reservationId}`;
  ticketElement.style.display = 'block';
}

async function showReservationTicket (reservation, show, seatNumbers, customerName) {
  clearPrintTargets();
  await fillTicketBlock(
    reservationTicket,
    reservationQr,
    reservationTicketText,
    reservation,
    show,
    seatNumbers,
    customerName
  );
  if (reservationTicket) reservationTicket.classList.add('print-target');
}

async function showOperatorReservationTicket (reservation, show) {
  const seatNumbers = Array.isArray(reservation.seats) ? reservation.seats : [];
  const customerName = reservation.customerName || '-';

  clearPrintTargets();
  await fillTicketBlock(
    operatorReservationTicket,
    operatorReservationQr,
    operatorReservationTicketText,
    reservation,
    show,
    seatNumbers,
    customerName
  );
  if (operatorReservationTicket) operatorReservationTicket.classList.add('print-target');
}

// create new hall
async function createHall () {
  const name = nameInput.value;
  const rows = Number(rowInput.value);
  const seatsPerRow = Number(seatsPerRowInput.value);

  if (!name || !rows || !seatsPerRow) {
    window.alert('Bitte alle Felder ausfüllen');
    return;
  }

  const response = await fetch('/api/halls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      rows,
      seatsPerRow
    })
  });

  const hall = await response.json();
  hall.all = calculateHallCapacity(hall);
  halls.push(hall);

  refreshHallSelectOptions();
  renderHallTable();
}

// create new show
async function createShow () {
  const movie = movieNameInput.value;
  const hallName = hallInput.value;
  const date = dateInput.value;
  const time = timeInput.value;
  const hallObj = findHallByName(hallName);

  if (!hallObj) {
    window.alert('Saal existiert nicht!');
    return;
  }

  if (!movie || !date || !time) {
    window.alert('Bitte alle Felder ausfüllen');
    return;
  }

  const year = Number(date.split('-')[0]);
  if (!year || year > 9999) {
    window.alert('Ungültiges Datum (Jahr muss 4-stellig sein)');
    return;
  }

  const response = await fetch('/api/shows', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      movie,
      hall: hallName,
      date,
      time
    })
  });

  const show = await response.json();
  show.totalSeats = calculateHallCapacity(hallObj);
  show.reservedSeats = 0;
  shows.push(show);

  renderMovieTable();
  renderCustomerTable();
}

// create reservation with show + seats[] + customerName
async function reserveSeats () {
  if (currentSelectedShowIndex === null) return;

  const show = shows[currentSelectedShowIndex];
  if (!show) return;

  const customerName = customerNameInput.value;
  const seatNumbers = getSelectedSeatNumbers();

  if (!customerName) {
    window.alert('Bitte Namen eingeben');
    return;
  }

  if (seatNumbers.length < 1) {
    window.alert('Bitte mindestens einen Sitz auswählen');
    return;
  }

  const response = await fetch('/api/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      show: {
        _id: show._id,
        movie: show.movie,
        hall: show.hall,
        date: show.date,
        time: show.time
      },
      showId: show._id,
      seats: seatNumbers,
      customerName
    })
  });

  const reservation = await response.json();
  reservations.push(reservation);
  recomputeReservedSeats();
  applySeatGridForShow(show);
  await showReservationTicket(reservation, show, seatNumbers, customerName);

  renderCustomerTable();
  renderMovieTable();
  renderReservationsTable();
}

// first load from backend
async function initData () {
  try {
    recalculateItemsPerPage();
    await loadHalls();
    await loadShows();
    await loadReservations();
    recomputeReservedSeats();
    refreshHallSelectOptions();
    renderHallTable();
    renderMovieTable();
    renderCustomerTable();
    renderReservationsTable();

    // second pass with real row heights after first render
    recalculateItemsPerPage();
    renderHallTable();
    renderMovieTable();
    renderCustomerTable();
  } catch (error) {
    console.error(error);
    window.alert('Fehler beim Laden der Daten');
  }
}

window.addEventListener('resize', function () {
  recalculateItemsPerPage();
  renderHallTable();
  renderMovieTable();
  renderCustomerTable();
});

operatorButton.addEventListener('click', function () {
  setActiveRole('operator');
});

customerButton.addEventListener('click', function () {
  setActiveRole('customer');
});

document.getElementById('create-hall-button').addEventListener('click', createHall);
document.getElementById('create-show-button').addEventListener('click', createShow);

document.getElementById('prevButtonHall').addEventListener('click', function () {
  if (currentHallPage > 1) {
    currentHallPage--;
    renderHallTable();
  }
});

document.getElementById('nextButtonHall').addEventListener('click', function () {
  if (currentHallPage * itemsPerHallPage < halls.length) {
    currentHallPage++;
    renderHallTable();
  }
});

document.getElementById('prevButtonMovie').addEventListener('click', function () {
  if (currentMoviePage > 1) {
    currentMoviePage--;
    renderMovieTable();
  }
});

document.getElementById('nextButtonMovie').addEventListener('click', function () {
  if (currentMoviePage * itemsPerMoviePage < shows.length) {
    currentMoviePage++;
    renderMovieTable();
  }
});

document.getElementById('prevCustomerButton').addEventListener('click', function () {
  if (currentCustomerPage > 1) {
    currentCustomerPage--;
    renderCustomerTable();
  }
});

document.getElementById('nextCustomerButton').addEventListener('click', function () {
  if (currentCustomerPage * itemsPerCustomerPage < shows.length) {
    currentCustomerPage++;
    renderCustomerTable();
  }
});

seatSelectionTitle.textContent = '';
seatSelectionContent.style.display = 'none';

reserveSeatsButton.addEventListener('click', reserveSeats);

printReservationButton.addEventListener('click', function () {
  if (reservationTicket.style.display === 'none') return;
  reservationTicket.classList.add('print-target');
  operatorReservationTicket.classList.remove('print-target');
  window.print();
});

printOperatorReservationButton.addEventListener('click', function () {
  if (operatorReservationTicket.style.display === 'none') return;
  operatorReservationTicket.classList.add('print-target');
  reservationTicket.classList.remove('print-target');
  window.print();
});

closeReservationButton.addEventListener('click', function () {
  reservationTicket.style.display = 'none';
  reservationTicket.classList.remove('print-target');
});

closeOperatorReservationButton.addEventListener('click', function () {
  operatorReservationTicket.style.display = 'none';
  operatorReservationTicket.classList.remove('print-target');
});

setActiveRole('operator');
initData();
