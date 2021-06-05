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
    console.log(currentAudioSources[currentCategory]);
    console.log(currentAudioSources[currentCategory].length);
    const index = currentAudioSources[currentCategory].indexOf(currentSong);
    console.log(index);
    if (index > -1) {
      currentAudioSources[currentCategory].splice(index, 1);
    }
    console.log(currentAudioSources[currentCategory]);
    console.log(currentAudioSources[currentCategory].length);
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
