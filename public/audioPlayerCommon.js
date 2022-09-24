const volumeSteps = new Array (1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.18, 0.16, 0.14, 0.12, 0.1, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01);
let muted = false;
const player = document.getElementById("player");
let currentVolume = localStorage.getItem('volume') ? localStorage.getItem('volume') : 1;
let currentVolumeStep = localStorage.getItem('volumeStep') ? localStorage.getItem('volumeStep') : 0;

if (player) {
    player.volume = currentVolume;
    document.getElementById("currentVolume").innerHTML = currentVolume;
}
currentVolumeStep = parseInt(currentVolumeStep);

function changeVolume(higherLower) {
    if (higherLower == "mute") {
        if (muted == false) {
            muted = currentVolume;
            currentVolume = 0;
        } else {
            currentVolume = muted;
            muted = false;
        }
    } else if (higherLower == "+" && currentVolumeStep != 0) {
        currentVolume = volumeSteps[currentVolumeStep-1];
        currentVolumeStep --;
    } else if (higherLower == "-" && currentVolumeStep != volumeSteps.length-1) {
        currentVolume = volumeSteps[currentVolumeStep+1];

        currentVolumeStep ++;
    }

    player.volume = currentVolume;
    localStorage.setItem('volume', Math.round(currentVolume * 100) / 100);
    localStorage.setItem('volumeStep', currentVolumeStep);
    document.getElementById("currentVolume").innerHTML = Math.round(currentVolume * 100) / 100;

    document.getElementById('ambientAudios').childNodes.forEach(child => {
        child.volume = currentVolume;
        if (currentVolume == 0) child.volume = 0;
    })
}

let deferredPrompt;
const addBtn = document.querySelector('.btnSave');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', function(e) {
  addBtn.style.display = 'block';
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
