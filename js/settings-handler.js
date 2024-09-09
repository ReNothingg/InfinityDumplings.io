var settingsDialog = document.getElementById("settingsDialog");

var clickSoundSelector = document.getElementById("clickSounds");

document.getElementById("settingsSave").addEventListener("click", function() {
    console.log("Updating settings...");
    doUpdate();
    console.log("Settings updated!")
    settingsDialog.style.display = "none";
});

function showSettings() {
    clickSoundSelector.innerHTML = "";

    var soundEntry = document.createElement("option");
    soundEntry.value = "none";
    soundEntry.innerText = "None";
    clickSoundSelector.append(soundEntry);

    for(x in unlockedClickSounds) {
        soundEntry = document.createElement("option");
        soundEntry.value = unlockedClickSounds[x];
        soundEntry.innerText = soundUnIdify(unlockedClickSounds[x]);
        clickSoundSelector.append(soundEntry);
    }

    settingsDialog.style.display = "block";
}

function doUpdate() {
    // Click Sound
    clickSound = clickSoundSelector.value;
}
