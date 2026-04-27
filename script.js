const playlist = [
  {
    title: "Her",
    src: "music/music1.mp3",
    cover: "cover/cover1.jpg"
  },
  {
    title: "Golden Hours",
    src: "music/music2.mp3",
    cover: "cover/cover2.jpg"
  },
  {
    title: "This Is What Falling In Love Feels Like",
    src: "music/music3.mp3",
    cover: "cover/cover3.jpg"
  }
];

let songIndex = 0;

const audio = document.getElementById("bg-music");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const progress = document.getElementById("progress");
const current = document.getElementById("current");
const duration = document.getElementById("duration");
const title = document.getElementById("title");
const cover = document.getElementById("cover");

audio.volume = 0.4;

function loadSong(index) {
  const song = playlist[index];

  title.textContent = song.title;
  cover.src = song.cover;
  audio.src = song.src;
  audio.load();

  current.textContent = "0:00";
  duration.textContent = "0:00";
  progress.value = 0;
  progress.style.setProperty("--value", "0%");
}

function formatTime(time) {
  if (isNaN(time)) return "0:00";

  const minute = Math.floor(time / 60);
  const second = Math.floor(time % 60);

  return `${minute}:${second < 10 ? "0" : ""}${second}`;
}

async function playMusic() {
  await audio.play();
  playBtn.textContent = "⏯";
}

function pauseMusic() {
  audio.pause();
  playBtn.textContent = "▶";
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
});

nextBtn.addEventListener("click", async () => {
  songIndex++;

  if (songIndex >= playlist.length) {
    songIndex = 0;
  }

  loadSong(songIndex);
  await playMusic();
});

prevBtn.addEventListener("click", async () => {
  songIndex--;

  if (songIndex < 0) {
    songIndex = playlist.length - 1;
  }

  loadSong(songIndex);
  await playMusic();
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
  progress.max = audio.duration;
});

audio.addEventListener("timeupdate", () => {
  current.textContent = formatTime(audio.currentTime);
  progress.value = audio.currentTime;

  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.setProperty("--value", percent + "%");
});

progress.addEventListener("input", () => {
  audio.currentTime = progress.value;
});

audio.addEventListener("ended", () => {
  nextBtn.click();
});

loadSong(songIndex);