
const bodyBetreiber = document.getElementById("Betreiber");
const bodyKunde = document.getElementById("Kunde");

document.getElementById("BetreiberButton").addEventListener("click", () => {
  bodyBetreiber.style.display = "block";
  bodyKunde.style.display = "none";
});

document.getElementById("KundenButton").addEventListener("click", () => {
  bodyKunde.style.display = "block";
  bodyBetreiber.style.display = "none";
});

document.getElementById("KinosaalAnlegen").addEventListener("click", () => {

});
document.getElementById("VorstellungAnlegen").addEventListener("click", () => {
  
});