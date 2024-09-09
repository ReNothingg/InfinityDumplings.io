var deleteSaveDialog = document.getElementById("deleteSaveDialog");
var mobileSounds = document.getElementById("mobileSounds");

var saveOnReload = true;

function saveGame() {
    console.log("Saving...");

    // Clicks
    localStorage.setItem("clicks", clicks);

    // Upgrades
    localStorage.setItem("perClickLevel", perClickLevel);
    localStorage.setItem("clickBombLevel", clickBombLevel);
    localStorage.setItem("clickFactoryLevel", clickFactoryLevel);
    localStorage.setItem("clickMinerLevel", clickMinerLevel);
    localStorage.setItem("autoClickerLevel", autoClickerLevel);
    localStorage.setItem("clickPortalLevel", clickPortalLevel);

    // Stats
    localStorage.setItem("highestClicks", highestClicks);
    localStorage.setItem("totalClicks", totalClicks);
    localStorage.setItem("upgradesBought", upgradesBought);
    localStorage.setItem("casesOpened", casesOpened);

    // Sounds and Settings
    localStorage.setItem("unlockedClickSounds", unlockedClickSounds);
    localStorage.setItem("clickSound", clickSound);

    // Cases
    localStorage.setItem("casesInventory", casesInventory);
    localStorage.setItem("caseData", JSON.stringify(caseData));

    console.log("Saved!");
    console.log(localStorage);

    var data = {
        message: "Saved!",
        timeout: 2000
    };
    snackbar.MaterialSnackbar.showSnackbar(data);
}

function loadGame() {
    if(typeof(localStorage.clicks) === "undefined") {
        console.log("No saved data, not loading data.");
        return;
    }

    console.log("Found save data, loading...");

    // Clicks
    console.log("Loading click count...");

    clicks = Number(localStorage.clicks);
    clickCount.innerText = `Clicks: ${clicks}`;

    // Upgrades
    console.log("Loading upgrades...");

    perClickLevel = Number(localStorage.perClickLevel);
    clickBombLevel = Number(localStorage.clickBombLevel);
    clickFactoryLevel = Number(localStorage.clickFactoryLevel);
    clickMinerLevel = Number(localStorage.clickMinerLevel);
    autoClickerLevel = Number(localStorage.autoClickerLevel);
    clickPortalLevel = Number(localStorage.clickPortalLevel);

    loadPerClick();
    loadClickBomb();
    loadClickFactory();
    loadClickMiner();
    loadAutoClicker();
    loadClickPortal();

    checkAllMax();

    // Stats
    console.log("Loading stats...");

    highestClicks = Number(localStorage.highestClicks);
    totalClicks = Number(localStorage.totalClicks);
    upgradesBought = Number(localStorage.upgradesBought);
    casesOpened = Number(localStorage.casesOpened);
    
    // Sounds
    console.log("Loading sounds...");

    unlockedClickSounds = localStorage.unlockedClickSounds.split(",");

    // Settings
    console.log("Loading settings...");
    
    clickSound = localStorage.clickSound;
    
    // Cases
    if(localStorage.casesInventory !== "") {
        casesInventory = localStorage.casesInventory.split(",");
        loadCases();
    }
    caseData = JSON.parse(localStorage.caseData);

    console.log("Save data loaded!");
}

function deleteSave() {
    deleteSaveDialog.style.display = "block";

    document.getElementById("yesDelete").addEventListener("click", function() {
        console.log("Deleting save...");

        localStorage.clear();
        saveOnReload = false;

        console.log("Save deleted, reloading...");
        location.reload();
    });

    document.getElementById("noDelete").addEventListener("click", function() {
        deleteSaveDialog.style.display = "none";
    });
}

window.addEventListener("beforeunload", function() {
    if(!saveOnReload) {
        return;
    }

    saveGame();
});
