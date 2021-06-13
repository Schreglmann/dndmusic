const volumeSteps = 0.05;
let muted = false;

function changeVolume(higherLower) {
  if (higherLower == "mute") {
    if (muted == false) {
      muted = player.volume;
      player.volume = 0;
    } else {
      player.volume = muted;
      muted = false;
    }
  } else if (higherLower == "+" && player.volume + volumeSteps <= 1) {
    player.volume += volumeSteps;
  } else if (higherLower == "-" && player.volume - volumeSteps >= 0) {
    player.volume -= volumeSteps;
  }
  document.getElementById("currentVolume").innerHTML =
    Math.round(player.volume * 100) / 100;
}
