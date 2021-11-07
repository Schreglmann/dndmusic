let currentSong = "";
const player = document.getElementById("player");
let remoteUrl;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") remoteUrl = 'http://localhost:3000';
else remoteUrl = 'https://dndmusic.schreglmann.at';

function showTimestamps() {
    document.getElementById("currentTime").innerHTML = "Aktuelle Wiedergabe: " + Math.round(player.currentTime) + " sec / " + Math.round(player.duration) + " sec";
	setTimeout(showTimestamps, 1000);
}

showTimestamps();

function playAudio(newSong) {
    document.getElementById("currentTime").innerHTML = "Aktuelle Wiedergabe: " + Math.round(player.currentTime) + " sec / " + Math.round(player.duration) + " sec";
    if (newSong != currentSong) {
        currentSong = newSong;
        player.pause();
        if (currentSong != "stop") {
            player.src = currentSong;
            player.play();
        }
    }
}

const ws = new WebSocket('ws://localhost:9898/');
ws.onmessage = function(e) {
    let message = JSON.parse(e.data);
    playAudio(message.currentSong);
    console.log(message);
};