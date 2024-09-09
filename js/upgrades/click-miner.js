var clickMinerCard = document.getElementById("clickMinerCard");
var clickMinerCardTitle = document.getElementById("clickMinerCardTitle");
var clickMinerCardPrice = document.getElementById("clickMinerCardPrice");
var clickMinerSpacer = document.getElementById("clickMinerSpacer");

var clickMinerLevel = 0;
var clickMinerInterval;
var clickMinerMax = false;

var clickMinerLevelData = [
    {level: 1, price: 1000, high: 100, low: 50},
    {level: 2, price: 1500, high: 150, low: 100},
    {level: 3, price: 2000, high: 200, low: 150},
    {level: 4, price: 3000, high: 250, low: 200},
    {level: 5, price: 5000, high: 500, low: 250},
    {level: 6, price: 7000, high: 750, low: 500},
    {level: 7, price: 9000, high: 1000, low: 750},
    {level: 8, price: 12000, high: 1500, low: 1000},
    {level: 9, price: 15000, high: 2500, low: 1500},
];

function buyClickMiner() {
    if(clicks >= clickMinerLevelData[clickMinerLevel].price) {
        clicks -= clickMinerLevelData[clickMinerLevel].price;
        clickCount.innerText = `Dumplings: ${clicks}`;
        
        clearInterval(clickMinerInterval);
        clickMinerInterval = setInterval(function() {
            var toAdd = generateNumberBetween(clickMinerLevelData[clickMinerLevel - 1].low, clickMinerLevelData[clickMinerLevel - 1].high);
            clicks += toAdd;
            clickCount.innerText = `Dumplings: ${clicks}`;

            checkCases();
            checkStats();
        }, 10000);

        clickMinerLevel++;

        if(clickMinerLevel >= clickMinerLevelData.length) {
            clickMinerCard.style.display = "none";
            clickMinerSpacer.style.display = "none";

            clickMinerMax = true;
        }else {
            var nextClickMinerLevel = clickMinerLevel + 1;
            var nextClickMinerPrice = clickMinerLevelData[clickMinerLevel].price;

            clickMinerCardTitle.innerText = "Dumplings Miner (Lvl. " + nextClickMinerLevel + ")";
            clickMinerCardPrice.innerText = "Buy (" + nextClickMinerPrice  + " Dumplings)";
        }

        upgradesBought++;
        
        playSound("buy");
        console.log(`Bought Upgrade: Dumplings Miner, Level: ${clickMinerLevel}.`);
    }else {
        var data = {
            message: "Not enough Dumplings!",
            timeout: 2000
        };
        snackbar.MaterialSnackbar.showSnackbar(data);
    }
}

function loadClickMiner() {
    if(clickMinerLevel === 0) {
        return;
    }

    var index = clickMinerLevel - 1;
    clickMinerInterval = setInterval(function() {
        var toAdd = generateNumberBetween(clickMinerLevelData[index].low, clickMinerLevelData[index].high);
        clicks += toAdd;
        clickCount.innerText = `Dumplings: ${clicks}`;

        checkCases();
        checkStats();
        checkCases();
    }, 10000);

    if(clickMinerLevel >= clickMinerLevelData.length) {
        clickMinerCard.style.display = "none";
        clickMinerSpacer.style.display = "none";
        
        clickMinerMax = true;
    }else {
        var nextClickMinerLevel = clickMinerLevel + 1;
        var nextClickMinerPrice = clickMinerLevelData[clickMinerLevel].price;

        clickMinerCardTitle.innerText = "Dumplings Miner (Lvl. " + nextClickMinerLevel + ")";
        clickMinerCardPrice.innerText = "Buy (" + nextClickMinerPrice  + " Dumplings)";
    }
}
