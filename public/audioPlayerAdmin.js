const audioSources = {};
let currentAudioSources = {};
let currentCategory = "";
let currentSong = "";

fetch("https://dndmusic.schreglmann.at/getFiles?path=music", {
  credentials: "same-origin",
})
  .then((response) => response.json())
  .then((data) => {
    data.forEach((category) => {
      if (category[0] != ".") {
        fetch(
          "https://dndmusic.schreglmann.at/getFiles?path=music/" + category,
          {
            credentials: "same-origin",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            audioSources[category] = data;

            var button = document.createElement("div");
            button.innerHTML = category;
            button.className = "musicButtons";
            button.id = category;

            if (category.includes('Atmosphere')) button.className += 'atmosphere';
            else if (category.includes('Ambience')) button.className += 'ambience';
            else if (category.includes('Combat')) button.className += 'combat';
            else if (category.includes('Feeling')) button.className += 'feeling';
            else if (category.includes('Location')) button.className += 'location';
            else if (category.includes('Stealth')) button.className += 'stealth';
            else if (category.includes('Temple')) button.className += 'temple';

            button.onclick = () => playAudio(category);
            var body = document.getElementById("musicButtons");
            body.appendChild(button);
          });
      }
    });
  });

const player = document.getElementById("player");
function playAudio(category = "") {
  if (
    category != currentCategory &&
    category != "" &&
    typeof category == "string"
  ) {
    currentAudioSources = audioSources;
    currentCategory = category;
  } else {
    const index = currentAudioSources[currentCategory].indexOf(currentSong);
    if (index > -1) {
      currentAudioSources[currentCategory].splice(index, 1);
    }
  }
  if (currentAudioSources[currentCategory].length > 0) {
    currentSong =
      currentAudioSources[currentCategory][
        Math.floor(Math.random() * currentAudioSources[currentCategory].length)
      ];
    let audioSource = currentCategory + "/" + currentSong;
    player.src = audioSource;
    writeCurrentSong(audioSource);
    player.play();
  } else {
    player.pause();
  }
}
player.addEventListener("ended", playAudio);

function writeCurrentSong(song) {
  fetch("https://dndmusic.schreglmann.at/writeCurrentSong", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentSong: song }),
  });
}
