let currentSong = "";
const player = document.getElementById("player");
let remoteUrl;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") remoteUrl = 'http://localhost:3000';
else remoteUrl = 'https://dnd.schreglmann.at';

function checkSong() {
    document.getElementById("currentTime").innerHTML = "Aktuelle Wiedergabe: " + Math.round(player.currentTime) + " sec / " + Math.round(player.duration) + " sec";
	setTimeout(function () {
		fetch("http://localhost:3000/getCurrentSong", {
			credentials: "same-origin",
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.currentSong != currentSong) {
					currentSong = data.currentSong;
					player.pause();
					if (currentSong != "stop") {
                        player.src = currentSong;
						player.play();
					}
				}
			});
		checkSong();
	}, 1000);
}

checkSong();

function playAudio(category) {
	let audioSource =
		category +
		"/" +
		audioSources[category][
			Math.floor(Math.random() * audioSources[category].length)
		];
	player.src = audioSource;
	player.play();
}
player.addEventListener("ended", playAudio);
