let currentVolumeStep = 0;
const volumeSteps = new Array (1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.18, 0.16, 0.14, 0.12, 0.1, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01);
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
    } else if (higherLower == "+" && currentVolumeStep != 0) {
        player.volume = volumeSteps[currentVolumeStep-1];
        currentVolumeStep --;
    } else if (higherLower == "-" && currentVolumeStep != volumeSteps.length-1) {
        player.volume = volumeSteps[currentVolumeStep+1];
        currentVolumeStep ++;
    }
    document.getElementById("currentVolume").innerHTML = Math.round(player.volume * 100) / 100;
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  deferredPrompt = e;
});

document.getElementById("btnSave").addEventListener("click", function() {
    if(deferredPrompt !== undefined) {
      deferredPrompt.prompt();
  
      deferredPrompt.userChoice.then(function(choiceResult) {
        console.log(choiceResult.outcome);
        if(choiceResult.outcome == 'dismissed') {
          console.log('User cancelled home screen install');
        }
        else {
          console.log('User added to home screen');
        }
  
        deferredPrompt = null;
      });
    }
  });
