const express = require("express");
const app = express();
const path = require("path");
const http = require('http');
const fs = require("fs");
const basicAuth = require("express-basic-auth");
const { getAudioDurationInSeconds } = require('get-audio-duration');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

server.listen(3000, () => {});

let currentCategory = '';
let currentCategorySongs = new Array();
let currentSong = '';
let timeout;
let songDuration;

app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(express.static("public"));
app.use(express.static("images"));
app.use(express.json());
app.use(basicAuth({
    challenge: true,
    users: { 'admin': 'admin' }
}))

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/client.html"));
});
app.get("/admin", (req, res) => {
	res.sendFile(path.join(__dirname, "/adminNew.html"));
});
app.get("/getFiles", (req, res) => {
	let musicFiles = [];
	fs.readdir(req.query.path, (err, files) => {
		if (files) {
			files.forEach((file) => {
				if (file[0] != ".") musicFiles.push(file);
			});
		}
		res.send(musicFiles);
	});
});

app.get("/getCurrentSong", (req, res) => {
    timePassed = getTimeLeft(timeout);
    if (currentSong == 'stop') res.send({'stopped': true});
    else if (currentCategory || currentSong || songDuration) res.send({'currentSong': currentCategory + '/' + currentSong, 'duration': songDuration, 'timePassed': timePassed});
    else res.send({});
});

app.post("/newCategory", (req, res) => {
    playNewCategory(req.body.category);
    res.end("success");
});

app.post("/stop", (req, res) => {
    stop();
    res.end("success");
});

app.use(express.static("music"));

let playNewCategory = category => {
    if (timeout) clearTimeout(timeout);
    currentCategory = category;
    currentCategorySongs = [];
    fs.readdir('music/' + category, (err, files) => {
		if (files) {
			files.forEach((file) => {
				if (file[0] != ".") currentCategorySongs.push(file);
			});
            currentCategorySongs = currentCategorySongs.sort((a, b) => 0.5 - Math.random());
            playNewSong();
		}
    });
}
let playNewSong = () => {
    currentSong = currentCategorySongs[0];
    
    getAudioDurationInSeconds('music/' + currentCategory + '/' + currentSong).then(duration => {
        songDuration = duration;
        io.sockets.emit('newSong', JSON.stringify({'currentSong': currentCategory + '/' + currentSong, 'duration': songDuration}));
        currentCategorySongs.shift();

        if (currentCategorySongs.length > 0) timeout = setTimeout(playNewSong, duration*1000);
        else {
            timeout = setTimeout(restartPlaylist, duration*1000)
        }
    });
}
let restartPlaylist = () => {
    stop();
    setTimeout(playNewCategory, 2000, currentCategory);
}

let stop = () => {
    if (timeout) clearTimeout(timeout);
	currentSong = 'stop';
    io.sockets.emit('newSong', JSON.stringify({'currentSong': currentSong}));
}
io.on('connection', (socket) => {
    if (currentCategory && currentSong) {
        timePassed = getTimeLeft(timeout);
        io.sockets.emit('newSong', JSON.stringify({'currentSong': currentCategory + '/' + currentSong, 'duration': songDuration, 'timePassed': timePassed}));
    }
});

function getTimeLeft() {
    if (currentSong == 'stop') return 0;
    return songDuration - Math.abs((timeout._idleStart + timeout._idleTimeout)/1000 - process.uptime());
}