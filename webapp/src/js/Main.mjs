document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');
  if (app) app.textContent = 'Hello World';
});

const bodyBetreiber = document.getElementByID("Betreiber");
const bodyKunde = document.getElementByID("Kunde");

document.getElementById("BetreiberButton").addEventListener("click", () => {
  bodyBetreiber.style.display = "block";
  bodyKunde.style.display = "none";
});

document.getElementById("KundenButton").addEventListener("click", () => {
  bodyKunde.style.display = "block";
  bodyBetreiber.style.display = "none";
});
