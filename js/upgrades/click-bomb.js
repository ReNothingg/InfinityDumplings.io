var clickBombCard = document.getElementById("clickBombCard");
var clickBombCardTitle = document.getElementById("clickBombCardTitle");
var clickBombCardPrice = document.getElementById("clickBombCardPrice");
var clickBombSpacer = document.getElementById("clickBombSpacer");

var clickBombLevel = 0;
var clickBombInterval;
var clickBombMax = false;

var clickBombLevelData = [
    {level: 1, price: 100, perFiveSeconds: 15},
    {level: 2, price: 250, perFiveSeconds: 25},
    {level: 3, price: 750, perFiveSeconds: 35},
    {level: 4, price: 1500, perFiveSeconds: 45},
    {level: 5, price: 2500, perFiveSeconds: 55},
    {level: 6, price: 5000, perFiveSeconds: 55},
    {level: 7, price: 7500, perFiveSeconds: 65},
    {level: 8, price: 10000, perFiveSeconds: 75},
    {level: 9, price: 15000, perFiveSeconds: 90},
    {level: 10, price: 20000, perFiveSeconds: 100},
];

function buyClickBomb() {
    if(clicks >= clickBombLevelData[clickBombLevel].price) {   
        clicks -= clickBombLevelData[clickBombLevel].price;
        clickCount.innerText = `Dumplings: ${clicks}`;
        
        clearInterval(clickBombInterval);
        var clickBombNewPerFiveSeconds = clickBombLevelData[clickBombLevel].perFiveSeconds;
        clickBombInterval = setInterval(function() {
            clicks += clickBombNewPerFiveSeconds;
            clickCount.innerText = `Dumplings: ${clicks}`;

            checkCases();
            checkStats();
        }, 5000);
        
        clickBombLevel++;
        
        if(clickBombLevel >= clickBombLevelData.length) {
            clickBombCard.style.display = "none";
            clickBombSpacer.style.display = "none";

            clickBombMax = true;
        }else {
            var nextClickBombLevel = clickBombLevel + 1;
            var nextClickBombPrice = clickBombLevelData[clickBombLevel].price;

            clickBombCardTitle.innerText = "Dumplings Bomb (Lvl. " + nextClickBombLevel + ")";
            clickBombCardPrice.innerText = "Buy (" + nextClickBombPrice  + " Dumplings)";
        }

        upgradesBought++;
        
        playSound("buy");
        console.log(`Bought Upgrade: Dumplings Bomb, Level: ${clickBombLevel}.`);
    }else {
        var data = {
            message: "Not enough Dumplings!",
            timeout: 2000
        };
        snackbar.MaterialSnackbar.showSnackbar(data);
    }
}

function loadClickBomb() {
    if(clickBombLevel === 0) {
        return;
    }

    var index = clickBombLevel - 1;
    var clickBombNewPerFiveSeconds = clickBombLevelData[index].perFiveSeconds;
    clickBombInterval = setInterval(function() {
        clicks += clickBombNewPerFiveSeconds;
        clickCount.innerText = `Dumplings: ${clicks}`;

        checkCases();
        checkStats();
        checkCases();
    }, 5000);

    if(clickBombLevel >= clickBombLevelData.length) {
        clickBombCard.style.display = "none";
        clickBombSpacer.style.display = "none";

        clickBombMax = true;
    }else {
        var nextClickBombLevel = clickBombLevel + 1;
        var nextClickBombPrice = clickBombLevelData[clickBombLevel].price;

        clickBombCardTitle.innerText = "Dumplings Bomb (Lvl. " + nextClickBombLevel + ")";
        clickBombCardPrice.innerText = "Buy (" + nextClickBombPrice  + " Dumplings)";
    }
}
