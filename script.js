// ============================================================
// CONFIGURATION
// ============================================================
const CORRECT_PIN = "123";

// ------------------------------------------------------------
// PIN logic with Session Persistence & Two-Attempt Override
// ------------------------------------------------------------
let enteredPin = "";
let attemptCount = parseInt(sessionStorage.getItem("album_attempts") || "0", 10);

const lockScreen = document.getElementById("lockScreen");
const album = document.getElementById("album");
const pinDots = document.querySelectorAll("#pinDots span");
const pinMessage = document.getElementById("pinMessage");

// Check if user already unlocked the page during this browser session
if (sessionStorage.getItem("album_unlocked") === "true") {
  lockScreen.classList.add("hidden");
  album.classList.remove("hidden");
}

function updateDots() {
  pinDots.forEach((dot, index) => {
    dot.classList.toggle("filled", index < enteredPin.length);
  });
}

function enterDigit(digit) {
  if (enteredPin.length >= 3) return;

  enteredPin += digit;
  pinMessage.textContent = "";
  updateDots();

  if (enteredPin.length === 3) {
    setTimeout(checkPin, 120);
  }
}

function deleteDigit() {
  enteredPin = enteredPin.slice(0, -1);
  pinMessage.textContent = "";
  updateDots();
}

function checkPin() {
  attemptCount++;
  sessionStorage.setItem("album_attempts", attemptCount);

  // First attempt always fails regardless of what was typed.
  // Second attempt (or subsequent) passes for any 3-digit entry.
  if (attemptCount > 1) {
    sessionStorage.setItem("album_unlocked", "true");
    lockScreen.classList.add("hidden");
    album.classList.remove("hidden");
    enteredPin = "";
    updateDots();
  } else {
    pinMessage.textContent = "Incorrect PIN. Try again.";
    enteredPin = "";
    updateDots();
  }
}

document.querySelectorAll(".keypad button[data-key]").forEach(button => {
  button.addEventListener("click", () => enterDigit(button.dataset.key));
});

document.getElementById("backspace").addEventListener("click", deleteDigit);

document.addEventListener("keydown", event => {
  if (event.key >= "0" && event.key <= "9") {
    enterDigit(event.key);
  } else if (event.key === "Backspace") {
    deleteDigit();
  }
});

// Lock again and reset session state
document.getElementById("lockButton").addEventListener("click", () => {
  sessionStorage.removeItem("album_unlocked");
  sessionStorage.setItem("album_attempts", "0");
  attemptCount = 0;
  album.classList.add("hidden");
  lockScreen.classList.remove("hidden");
  enteredPin = "";
  updateDots();
});

// ------------------------------------------------------------
// Photo lightbox
// ------------------------------------------------------------
const cards = Array.from(document.querySelectorAll(".photo-card"));
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
let currentPhoto = 0;

function showPhoto(index) {
  currentPhoto = (index + cards.length) % cards.length;
  const img = cards[currentPhoto].querySelector("img");
  const caption = cards[currentPhoto].querySelector("figcaption");

  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = caption.textContent;
  lightbox.classList.remove("hidden");
}

function closeLightbox() {
  lightbox.classList.add("hidden");
}

cards.forEach((card, index) => {
  card.addEventListener("click", () => showPhoto(index));
});

document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
document.getElementById("prevPhoto").addEventListener("click", () => showPhoto(currentPhoto - 1));
document.getElementById("nextPhoto",.addEventListener("click", () => showPhoto(currentPhoto + 1));

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (lightbox.classList.contains("hidden")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
  if (event.key === "ArrowRight") showPhoto(currentPhoto + 1);
});

document.getElementById("year").textContent = new Date().getFullYear();
