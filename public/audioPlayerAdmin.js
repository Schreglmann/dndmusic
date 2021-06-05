const audioSources = {};

fetch("https://dndmusic.schreglmann.at/getFiles?path=music", {
	credentials: "same-origin",
})
	.then((response) => response.json())
	.then((data) => {
		data.forEach((category) => {
			if (category[0] != ".") {
				fetch("https://dndmusic.schreglmann.at/getFiles?path=music/" + category, {
					credentials: "same-origin",
				})
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
function playAudio(category) {
	let audioSource =
		category +
		"/" +
		audioSources[category][
			Math.floor(Math.random() * audioSources[category].length)
		];
	player.src = audioSource;
    writeCurrentSong(audioSource);
	player.play();
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
