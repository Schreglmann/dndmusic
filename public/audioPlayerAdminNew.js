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

let writeSongName = () => { 
    fetch(remoteUrl + "/getCurrentSong", {
        credentials: "same-origin",
    })
    .then((response) => response.json())
    .then((data) => {
        let innerHtml = '';
        if (data.currentSong) innerHtml += data.currentSong;
        if (data.duration) innerHtml += "<br>Dauer: " + Math.round(data.duration) + " Sekunden";
        document.getElementById("currentTime").innerHTML = innerHtml;
    });
    setTimeout(writeSongName, 1000);
}
writeSongName();

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
