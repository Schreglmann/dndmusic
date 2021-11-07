const audioSources = {};
let currentAudioSources = {};
let currentCategory = "";
let currentSong = "";
let remoteUrl;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") remoteUrl = 'http://localhost:3000';
else remoteUrl = 'https://dndmusic.schreglmann.at';

fetch(remoteUrl + "/getFiles?path=music", {
  credentials: "same-origin",
})
  .then((response) => response.json())
  .then((data) => {
    data.forEach((category) => {
      if (category[0] != ".") {
        fetch(
          remoteUrl + "/getFiles?path=music/" + category,
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

            if (category.includes("Atmosphere"))
              button.className += " atmosphere";
            else if (category.includes("Ambience"))
              button.className += " ambience";
            else if (category.includes("Combat")) button.className += " combat";
            else if (category.includes("Feeling"))
              button.className += " feeling";
            else if (category.includes("Location"))
              button.className += " location";
            else if (category.includes("Stealth"))
              button.className += " stealth";
            else if (category.includes("Temple")) button.className += " temple";

            button.onclick = () => playAudio(category);
            var body = document.getElementById("musicButtons");
            body.appendChild(button);
          });
      }
    });
  });

var socket = io();
socket.on('newSong', function (data) {
    let message = JSON.parse(data);
    console.log(message);
    if (message) {
        let innerHtml = '';
        if (message.currentSong) innerHtml += message.currentSong;
        if (message.duration) innerHtml += "<br>Dauer: " + Math.round(message.duration) + " Sekunden";
        if (message.stopped) innerHtml = 'Song stopped';
        document.getElementById("currentTime").innerHTML = innerHtml;
    }
});

function playAudio(category = "") {
    fetch(remoteUrl + "/newCategory", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category: category }),
    }); 
}

function stopMusic() {
    fetch(remoteUrl + "/stop", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }); 
}
