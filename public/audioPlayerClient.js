let currentSong = "";
const player = document.getElementById("player");
let remoteUrl;
let activeAmbients = new Array();
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") remoteUrl = 'http://localhost:3000';
else if (location.hostname === "192.168.1.6") remoteUrl = 'http://192.168.1.6:3000';
else remoteUrl = 'https://dndmusic.schreglmann.at';

function showTimestamps() {
    document.getElementById("currentTime").innerHTML = "Aktuelle Wiedergabe: " + Math.round(player.currentTime) + " sec / " + Math.round(player.duration) + " sec";
	setTimeout(showTimestamps, 1000);
}

showTimestamps();

function playAudio(newSong, duration = 0) {
    document.getElementById("currentTime").innerHTML = "Aktuelle Wiedergabe: " + Math.round(player.currentTime) + " sec / " + Math.round(player.duration) + " sec";
    if (newSong != currentSong) {
        currentSong = newSong;
        player.pause();
        if (currentSong != "stop") {
            player.src = currentSong;
            player.addEventListener('loadedmetadata', () => {
                player.currentTime = duration;
                player.play();
            });
        }
    }
}

var socket = io();
socket.on('newSong', function (data) {
    let message = JSON.parse(data);
    playAudio(message.currentSong, message.timePassed);
});
socket.on('newAmbient', function (data) {
    let message = JSON.parse(data);
    let ambientsInRequest = new Array();
    Object.entries(message).forEach(ambient => {
        ambientsInRequest.push(ambient[1].category);
        if (!activeAmbients.includes(ambient[1].category)) {
            playAmbient(ambient[1].ambient, ambient[1].timePassed, ambient[1].category);
        } else if (ambient[1].timePassed < 3) {
            playAmbient(ambient[1].ambient, ambient[1].timePassed, ambient[1].category);
        }
    });

    activeAmbients.forEach(ambient => {
        if (!ambientsInRequest.includes(ambient)) {
            // Remove category from activeAmbients
            var index = activeAmbients.indexOf(ambient);
            if (index !== -1) activeAmbients.splice(index, 1);

            document.getElementById(ambient).remove();
        }
    });
});

function playAmbient(newAmbient, duration = 0, category) {
    let ambientPlayer;
    if (!document.getElementById(category)) {
        ambientPlayer = document.createElement("audio");
        document.getElementById('ambientAudios').appendChild(ambientPlayer);
        activeAmbients.push(category);
    } else {
        ambientPlayer = document.getElementById(category);
    }

    ambientPlayer.id = category;
    ambientPlayer.src = newAmbient;
    ambientPlayer.volume = currentVolume;
    ambientPlayer.controls = true;
    ambientPlayer.addEventListener('loadedmetadata', () => {
        ambientPlayer.currentTime = duration;
        ambientPlayer.play();
    });
}

document.getElementById("startButton").addEventListener("click", function() {
    let requestStartTime = new Date();
    fetch(remoteUrl + "/getCurrentSong", {
        credentials: "same-origin",
    })
    .then((response) => response.json())
    .then((data) => {
        player.src = data.currentSong;
        player.addEventListener('loadedmetadata', () => {
            player.currentTime = data.timePassed + (new Date() - requestStartTime)/1000;
            player.play();
        })
    });

    fetch(remoteUrl + "/getCurrentAmbients", {
        credentials: "same-origin",
    })
    .then((response) => response.json())
    .then((data) => {
        // player.src = data.currentSong;
        // player.addEventListener('loadedmetadata', () => {
        //     player.currentTime = data.timePassed + (new Date() - requestStartTime)/1000;
        //     player.play();
        // })
    });
});
