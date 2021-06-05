const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
const basicAuth = require("express-basic-auth");

app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use(express.json());
app.use(basicAuth({
    challenge: true,
    users: { 'admin': 'admin' }
}))

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/client.html"));
});
app.get("/admin", (req, res) => {
	res.sendFile(path.join(__dirname, "/admin.html"));
});
app.get("/getFiles", (req, res) => {
	let musicFiles = [];
	fs.readdir("~/dndmusic/" + req.query.path, (err, files) => {
		if (files) {
			files.forEach((file) => {
				if (file[0] != ".") musicFiles.push(file);
			});
		}
		res.send(musicFiles);
	});
});

app.get("/getCurrentSong", (req, res) => {
	fs.readFile("~/dndmusic/currentSong.txt", "utf8", function (err, data) {
		if (err) throw err;
		res.send({'currentSong': data});
	});
});

app.post("/writeCurrentSong", (req, res) => {
	fs.writeFile("~/dndmusic/currentSong.txt", req.body.currentSong, () => {
        res.end("success");
	});
});

app.use(express.static("~/dndmusic/music"));
app.use(express.static("~/dndmusic/js"));
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
