const volumeSteps = 0.1;

function changeVolume(higherLower) {
    const player = document.getElementById("player");
    console.log(player.volume);
    if (higherLower == '+' && (player.volume + volumeSteps) <= 1) {
        player.volume += volumeSteps;
    } else if (higherLower == '-' && (player.volume - volumeSteps) >= 0) {
        player.volume -= volumeSteps;
    }
    document.getElementById('currentVolume').innerHTML = (Math.round(player.volume * 10) / 10);
}