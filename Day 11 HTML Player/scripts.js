// Elements
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const rangeSliders = player.querySelectorAll(".player__slider");
const skipButtons = player.querySelectorAll("[data-skip]");
const fullscreen = player.querySelector(".fullscreen");

// Functions

function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  toggle.textContent = icon;
}

function skip() {
  // convert skip time to a true number
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    player.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// Event listeners
video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("timeupdate", handleProgress);
toggle.addEventListener("click", togglePlay);
fullscreen.addEventListener("click", toggleFullScreen);

let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("movemove", (e) => mousedown && scrub(e)); // if mousedown is true, then run scrub
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));

skipButtons.forEach(button => button.addEventListener("click", skip));
rangeSliders.forEach(range => range.addEventListener("change", handleRangeUpdate));
rangeSliders.forEach(range => range.addEventListener("mousemove", handleRangeUpdate));
