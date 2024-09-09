var statsDialog = document.getElementById("statsDialog");
var highestClicksText = document.getElementById("highestClicks");
var totalClicksText = document.getElementById("totalClicks");
var upgradesBoughtText = document.getElementById("upgradesBought");
var casesOpenedText = document.getElementById("casesOpened");

var highestClicks = 0;
var totalClicks = 0;
var upgradesBought = 0;
var casesOpened = 0;

function checkStats() {
    if(clicks > highestClicks) {
        highestClicks = clicks;
    }
}

document.getElementById("statsOkay").addEventListener("click", function() {
    statsDialog.style.display = "none";
});

function showStats() {
    highestClicksText.innerText = "Highest Amount of Clicks: " + highestClicks;
    totalClicksText.innerText = "Total Mouse Clicks: " + totalClicks;
    upgradesBoughtText.innerText = "Upgrades Bought: " + upgradesBought;
    casesOpenedText.innerText = "Cases Opened: " + casesOpened;

    statsDialog.style.display = "block";
}
