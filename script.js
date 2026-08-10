// ============================================================
// CONFIGURATION & FOLDER-BASED IMAGE LIST
// ============================================================
const CORRECT_PIN = "567";
const LOCKOUT_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Organize your photos with folder/album names
const foldersData = {
  "Me": [
    { src: "photos/1.jpg", caption: "me 1" },
    { src: "photos/2.jpg", caption: "me 2" },
    { src: "photos/3.jpg", caption: "me 3" },
    { src: "photos/4.jpg", caption: "me 4" },
    { src: "photos/5.jpg", caption: "me 5" },
    { src: "photos/6.jpg", caption: "me 6" },
    { src: "photos/7.jpg", caption: "me 7" },
    { src: "photos/8.jpg", caption: "me 8" },
    { src: "photos/9.jpg", caption: "me 9" },
    { src: "photos/10.jpg", caption: "me 10" }
  ],
  "Ramona": [
    { src: "photos/international/ramona/1.jpg", caption: "Ramona 1" },
    { src: "photos/international/ramona/2.jpg", caption: "Ramona 2" },
    { src: "photos/international/ramona/3.jpg", caption: "Ramona 3" },
    { src: "photos/international/ramona/4.jpg", caption: "Ramona 4" },
    { src: "photos/international/ramona/5.jpg", caption: "Ramona 5" },
    { src: "photos/international/ramona/6.jpg", caption: "Ramona 6" },
    { src: "photos/international/ramona/7.jpg", caption: "Ramona 7" },
    { src: "photos/international/ramona/8.jpg", caption: "Ramona 8" },
    { src: "photos/international/ramona/9.jpg", caption: "Ramona 9" },
    { src: "photos/international/ramona/10.jpg", caption: "Ramona 10" }
  ],
  "Liana Luck": [
    { src: "photos/international/liana-luck/1.jpg", caption: "liana luck 1" },
    { src: "photos/international/liana-luck/2.jpg", caption: "liana luck 2" },
    { src: "photos/international/liana-luck/3.jpg", caption: "liana luck 3" },
    { src: "photos/international/liana-luck/4.jpg", caption: "liana luck 4" },
    { src: "photos/international/liana-luck/5.jpg", caption: "liana luck 5" },
    { src: "photos/international/liana-luck/6.jpg", caption: "liana luck 6" },
    { src: "photos/international/liana-luck/7.jpg", caption: "liana luck 7" },
    { src: "photos/international/liana-luck/8.jpg", caption: "liana luck 8" },
    { src: "photos/international/liana-luck/9.jpg", caption: "liana luck 9" },
    { src: "photos/international/liana-luck/10.jpg", caption: "liana luck 10" }
  ],
  "Couple One": [
    { src: "photos/international/couple1/1.jpg", caption: "Couple One 1" },
    { src: "photos/international/couple1/2.jpg", caption: "Couple One 2" },
    { src: "photos/international/couple1/3.jpg", caption: "Couple One 3" },
    { src: "photos/international/couple1/4.jpg", caption: "Couple One 4" },
    { src: "photos/international/couple1/5.jpg", caption: "Couple One 5" },
    { src: "photos/international/couple1/6.jpg", caption: "Couple One 6" },
    { src: "photos/international/couple1/7.jpg", caption: "Couple One 7" },
    { src: "photos/international/couple1/8.jpg", caption: "Couple One 8" },
    { src: "photos/international/couple1/9.jpg", caption: "Couple One 9" },
    { src: "photos/international/couple1/10.jpg", caption: "Couple One 10" }
  ]
};

// ------------------------------------------------------------
// DOM Elements & Globals
// ------------------------------------------------------------
const gallerySection = document.getElementById("gallery");
const lockScreen = document.getElementById("lockScreen");
const album = document.getElementById("album");
const pinDots = document.querySelectorAll("#pinDots span");
const pinMessage = document.getElementById("pinMessage");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

let currentPhotos = [];
let cards = [];
let currentPhotoIndex = 0;

// ------------------------------------------------------------
// Folder & Gallery Navigation Functions
// ------------------------------------------------------------
function initAlbumView() {
  if (!gallerySection) return;
  gallerySection.innerHTML = "";
  gallerySection.className = "gallery folder-view";

  Object.keys(foldersData).forEach(folderName => {
    const previewImg = foldersData[folderName][0] ? foldersData[folderName][0].src : "";
    
    const folderCard = document.createElement("div");
    folderCard.className = "folder-card";
    folderCard.innerHTML = `
      <div class="folder-thumbnail">
        <img src="${previewImg}" alt="${folderName}" loading="lazy">
        <div class="folder-badge">📁</div>
      </div>
      <h3>${folderName}</h3>
      <p>${foldersData[folderName].length} photos</p>
    `;

    folderCard.addEventListener("click", () => openFolder(folderName));
    gallerySection.appendChild(folderCard);
  });
}

function openFolder(folderName) {
  currentPhotos = foldersData[folderName];
  gallerySection.innerHTML = "";
  gallerySection.className = "gallery photo-grid";

  const backBtnContainer = document.createElement("div");
  backBtnContainer.className = "back-container";
  backBtnContainer.innerHTML = `<button id="backToFolders" class="back-btn">← Back to Folders</button><h2>${folderName}</h2>`;
  gallerySection.appendChild(backBtnContainer);

  document.getElementById("backToFolders").addEventListener("click", initAlbumView);

  const gridContainer = document.createElement("div");
  gridContainer.className = "grid-container";

  currentPhotos.forEach((item, index) => {
    const figure = document.createElement("figure");
    figure.className = "photo-card";
    figure.innerHTML = `
      <img src="${item.src}" alt="${item.caption}" loading="lazy">
      <figcaption>${item.caption}</figcaption>
    `;
    figure.addEventListener("click", () => showLightbox(index));
    gridContainer.appendChild(figure);
  });

  gallerySection.appendChild(gridContainer);
  cards = Array.from(gridContainer.querySelectorAll(".photo-card"));
}

// ------------------------------------------------------------
// PIN logic with 24-Hour Expiration & Two-Attempt Override
// ------------------------------------------------------------
let enteredPin = "";
let attemptCount = parseInt(localStorage.getItem("album_attempts") || "0", 10);

const unlockTime = parseInt(localStorage.getItem("album_unlock_time") || "0", 10);
const currentTime = new Date().getTime();

if (localStorage.getItem("album_unlocked") === "true" && (currentTime - unlockTime < LOCKOUT_DURATION)) {
  lockScreen.classList.add("hidden");
  album.classList.remove("hidden");
  setTimeout(initAlbumView, 50);
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

  if (attemptCount > 1 || enteredPin === CORRECT_PIN) {
    localStorage.setItem("album_unlocked", "true");
    localStorage.setItem("album_unlock_time", new Date().getTime());
    lockScreen.classList.add("hidden");
    album.classList.remove("hidden");
    enteredPin = "";
    updateDots();
    initAlbumView();
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
  if (!lockScreen.classList.contains("hidden")) {
    if (event.key >= "0" && event.key <= "9") {
      enterDigit(event.key);
    } else if (event.key === "Backspace") {
      deleteDigit();
    }
    return;
  }

  if (lightbox.classList.contains("hidden")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") {
    currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
    updateLightboxContent();
  }
  if (event.key === "ArrowRight") {
    currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
    updateLightboxContent();
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
// Photo Lightbox & Navigation
// ------------------------------------------------------------
function showLightbox(index) {
  currentPhotoIndex = index;
  updateLightboxContent();
  lightbox.classList.remove("hidden");
}

function updateLightboxContent() {
  const item = currentPhotos[currentPhotoIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.caption;
  lightboxCaption.textContent = item.caption;
}

function closeLightbox() {
  lightbox.classList.add("hidden");
}

document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
document.getElementById("prevPhoto").addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
  updateLightboxContent();
});
document.getElementById("nextPhoto").addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
  updateLightboxContent();
});

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.getElementById("year").textContent = new Date().getFullYear();
