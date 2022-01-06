const audioSources = {};
let currentAudioSources = {};
let currentCategory = "";
let currentSong = "";
let remoteUrl;
let timestampTimeout;
let timePassed = 0;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") remoteUrl = 'http://localhost:3000';
else if (location.hostname === "192.168.1.6") remoteUrl = 'http://192.168.1.6:3000';
else remoteUrl = 'https://dndmusic.schreglmann.at';

let loadMusic = type => {
fetch(remoteUrl + "/getFiles?path=" + type, {
    credentials: "same-origin",
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((category) => {
        if (category[0] != ".") {
          var button = document.createElement("div");
          button.innerHTML = category;
          button.className = type == 'music' ? "musicButtons" : "ambientButtons";
          button.id = category;
  
          if (category.includes("Atmosphere"))
              button.className += " atmosphere";
          else if (category.includes("Ambience"))
              button.className += " ambience";
          else if (category.includes("Combat"))
              button.className += " combat";
          else if (category.includes("Feeling"))
              button.className += " feeling";
          else if (category.includes("Location"))
              button.className += " location";
          else if (category.includes("Stealth"))
              button.className += " stealth";
          else if (category.includes("Temple -"))
              button.className += " temple";
  
          button.onclick = () => type == 'music' ? playAudio(category) : playAmbient(category);
          var body = type == 'music' ? document.getElementById("musicButtons") : document.getElementById("ambientButtons");
          body.appendChild(button);
        }
      });
    })
    .catch (error => {
        console.log(error);
    });
}

loadMusic('music');
loadMusic('ambient');

  let showTimestamps = message => {
    let innerHtml = '';
    if (message.currentSong) innerHtml += message.currentSong;
    if (message.duration) innerHtml += "<br>Dauer: " + timePassed + ' / ' + Math.round(message.duration) + " Sekunden";
    if (message.stopped) innerHtml = 'Song stopped';
    document.getElementById("currentTime").innerHTML = innerHtml;
    timePassed++;
    timestampTimeout = setTimeout(showTimestamps, 1000, message);
  }

var socket = io();
socket.on('newSong', function (data) {
    let message = JSON.parse(data);
    if (message) {
        if (timestampTimeout) clearTimeout(timestampTimeout);
        timePassed = message.timePassed ? Math.round(message.timePassed) : 0;
        showTimestamps(message);
    }
});

socket.on('newAmbient', function (data) {
    let message = JSON.parse(data);
    if (message) {
        console.log(message);
    }
});

function playAudio(category = "") {
    fetch(remoteUrl + "/newCategory", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category: category, type: 'music' }),
    }); 
}

function playAmbient(category = "") {
    fetch(remoteUrl + "/newCategory", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category: category, type: 'ambient' }),
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
