let currentSong = "";
const player = document.getElementById("player");
let remoteUrl;
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
    console.log(data);
    let message = JSON.parse(data);
    playAudio(message.currentSong, message.timePassed);
});

document.getElementById("startButton").addEventListener("click", function() {
    console.log('Buttonpress');
    let requestStartTime = new Date();
    fetch(remoteUrl + "/getCurrentSong", {
        credentials: "same-origin",
    })
    .then((response) => response.json())
    .then((data) => {
            console.log(data);
            player.src = data.currentSong;
            player.addEventListener('loadedmetadata', () => {
                console.log('canplay');
                player.currentTime = data.timePassed + (new Date() - requestStartTime)/1000;
                player.play();
            })
        });
});
