var clickPortalCard = document.getElementById("clickPortalCard");
var clickPortalCardTitle = document.getElementById("clickPortalCardTitle");
var clickPortalCardPrice = document.getElementById("clickPortalCardPrice");
var clickPortalSpacer = document.getElementById("clickPortalSpacer");

var clickPortalLevel = 0;
var clickPortalInterval;
var clickPortalMax = false;

var clickPortalLevelData = [
    {level: 1, price: 5000, perThirtySeconds: 10000},
    {level: 2, price: 30000, perThirtySeconds: 20000},
    {level: 3, price: 100000, perThirtySeconds: 50000},
    {level: 4, price: 250000, perThirtySeconds: 75000},
    {level: 5, price: 1000000, perThirtySeconds: 100000}
];

function buyClickPortal() {
    if(clicks >= clickPortalLevelData[clickPortalLevel].price) {
        clicks -= clickPortalLevelData[clickPortalLevel].price;
        clickCount.innerText = `Dumplings: ${clicks}`;

        clearInterval(clickPortalInterval);
        var clickPortalNewPerTwentySeconds = clickPortalLevelData[clickPortalLevel].perThirtySeconds;
        clickPortalInterval = setInterval(function() {
            clicks += clickPortalNewPerTwentySeconds;
            clickCount.innerText = `Dumplings: ${clicks}`;

            checkCases();
            checkStats();
            checkCases();
        }, 20000);

        clickPortalLevel++;

        if(clickPortalLevel >= clickPortalLevelData.length) {
            clickPortalCard.style.display = "none";
            clickPortalSpacer.style.display = "none";

            clickPortalMax = true;
        }else {
            var nextClickPortalLevel = clickPortalLevel + 1;
            var nextClickPortalPrice = clickPortalLevelData[clickPortalLevel].price;

            clickPortalCardTitle.innerText = "Dumplings Portal (Lvl. " + nextClickPortalLevel + ")";
            clickPortalCardPrice.innerText = "Buy (" + nextClickPortalPrice  + " Dumplings)";
        }

        upgradesBought++;
        
        playSound("buy");
        console.log(`Bought Upgrade: Dumplings Portal, Level: ${clickPortalLevel}.`);
    }else {
        var data = {
            message: "Not enough Dumplings!",
            timeout: 2000
        };
        snackbar.MaterialSnackbar.showSnackbar(data);
    }
}

function loadClickPortal() {
    if(clickPortalLevel === 0) {
        return;
    }

    var index = clickPortalLevel - 1;
    var clickPortalNewPerTwentySeconds = clickPortalLevelData[index].perThirtySeconds;
    clickPortalInterval = setInterval(function() {
        clicks += clickPortalNewPerTwentySeconds;
        clickCount.innerText = `Dumplings: ${clicks}`;

        checkCases();
        checkStats();
    }, 20000);

    if(clickPortalLevel >= clickPortalLevelData.length) {
        clickPortalCard.style.display = "none";
        clickPortalSpacer.style.display = "none";

        clickPortalMax = true;
    }else {
        var nextClickPortalLevel = clickPortalLevel + 1;
        var nextClickPortalPrice = clickPortalLevelData[clickPortalLevel].price;

        clickPortalCardTitle.innerText = "Dumplings Portal (Lvl. " + nextClickPortalLevel + ")";
        clickPortalCardPrice.innerText = "Buy (" + nextClickPortalPrice  + " Dumplings)";
    }
}
