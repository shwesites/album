// ============================================================
// CONFIGURATION & MIXED FOLDER IMAGE LIST
// ============================================================
const CORRECT_PIN = "567";
const LOCKOUT_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// List your photos from any folder or subfolder here manually
const imageList = [
  // Photos from the main photos folder
  { src: "photos/1.jpg", caption: "Main Folder Photo 1" },
  { src: "photos/2.jpg", caption: "Main Folder Photo 2" },
  
  // Photos from subfolders (add as many as you like)
  { src: "photos/international/ramona/1.jpg", caption: "Ramona Trip 1" },
  { src: "photos/international/ramona/2.jpg", caption: "Ramona Trip 2" },
  
  // Example of another subfolder if you have one:
  // { src: "photos/vacation/beach.jpg", caption: "Beach Day" }
];

// ------------------------------------------------------------
// Dynamic Gallery Builder
// ------------------------------------------------------------
const gallerySection = document.getElementById("gallery");

imageList.forEach((item, index) => {
  const figure = document.createElement("figure");
  figure.className = "photo-card";
  figure.innerHTML = `
    <img src="${item.src}" alt="Album photo ${index + 1}" loading="lazy">
    <figcaption>${item.caption}</figcaption>
  `;
  gallerySection.appendChild(figure);
});

// ------------------------------------------------------------
// PIN logic with 24-Hour Expiration & Two-Attempt Override
// ------------------------------------------------------------
let enteredPin = "";
let attemptCount = parseInt(localStorage.getItem("album_attempts") || "0", 10);

const lockScreen = document.getElementById("lockScreen");
const album = document.getElementById("album");
const pinDots = document.querySelectorAll("#pinDots span");
const pinMessage = document.getElementById("pinMessage");

const unlockTime = parseInt(localStorage.getItem("album_unlock_time") || "0", 10);
const currentTime = new Date().getTime();

if (localStorage.getItem("album_unlocked") === "true" && (currentTime - unlockTime < LOCKOUT_DURATION)) {
  lockScreen.classList.add("hidden");
  album.classList.remove("hidden");
} else {
  localStorage.removeItem("album_unlocked");
  localStorage.removeItem("album_unlock_time");
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
  localStorage.setItem("album_attempts", attemptCount);

  if (attemptCount > 1) {
    localStorage.setItem("album_unlocked", "true");
    localStorage.setItem("album_unlock_time", new Date().getTime());
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

document.getElementById("lockButton").addEventListener("click", () => {
  localStorage.removeItem("album_unlocked");
  localStorage.removeItem("album_unlock_time");
  localStorage.setItem("album_attempts", "0");
  attemptCount = 0;
  album.classList.add("hidden");
  lockScreen.classList.remove("hidden");
  enteredPin = "";
  updateDots();
});

// ------------------------------------------------------------
// Photo lightbox & Navigation
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
document.getElementById("nextPhoto").addEventListener("click", () => showPhoto(currentPhoto + 1));

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
