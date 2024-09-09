var clickFactoryCard = document.getElementById("clickFactoryCard");
var clickFactoryCardTitle = document.getElementById("clickFactoryCardTitle");
var clickFactoryCardPrice = document.getElementById("clickFactoryCardPrice");
var clickFactorySpacer = document.getElementById("clickFactorySpacer");

var clickFactoryLevel = 0;
var clickFactoryInterval;
var clickFactoryMax = false;

var clickFactoryLevelData = [
    {level: 1, price: 1000, perTwentySeconds: 500},
    {level: 2, price: 2000, perTwentySeconds: 1000},
    {level: 3, price: 3000, perTwentySeconds: 1500},
    {level: 4, price: 5000, perTwentySeconds: 2000},
    {level: 5, price: 8000, perTwentySeconds: 2500},
    {level: 6, price: 12000, perTwentySeconds: 3000},
    {level: 7, price: 16000, perTwentySeconds: 3500},
    {level: 8, price: 20000, perTwentySeconds: 4000},
    {level: 9, price: 25000, perTwentySeconds: 4500},
    {level: 10, price: 32000, perTwentySeconds: 5000},
];

function buyClickFactory() {
    if(clicks >= clickFactoryLevelData[clickFactoryLevel].price) {
        clicks -= clickFactoryLevelData[clickFactoryLevel].price;
        clickCount.innerText = `Dumplings: ${clicks}`;

        clearInterval(clickFactoryInterval);
        var clickFactoryNewPerTwentySeconds = clickFactoryLevelData[clickFactoryLevel].perTwentySeconds;
        clickFactoryInterval = setInterval(function() {
            clicks += clickFactoryNewPerTwentySeconds;
            clickCount.innerText = `Dumplings: ${clicks}`;

            checkCases();
            checkStats();
            checkCases();
        }, 20000);

        clickFactoryLevel++;

        if(clickFactoryLevel >= clickFactoryLevelData.length) {
            clickFactoryCard.style.display = "none";
            clickFactorySpacer.style.display = "none";

            clickFactoryMax = true;
        }else {
            var nextClickFactoryLevel = clickFactoryLevel + 1;
            var nextClickFactoryPrice = clickFactoryLevelData[clickFactoryLevel].price;

            clickFactoryCardTitle.innerText = "Dumplings Factory (Lvl. " + nextClickFactoryLevel + ")";
            clickFactoryCardPrice.innerText = "Buy (" + nextClickFactoryPrice  + " Dumplings)";
        }

        upgradesBought++;
        
        playSound("buy");
        console.log(`Bought Upgrade: Dumplings Factory, Level: ${clickFactoryLevel}.`);
    }else {
        var data = {
            message: "Not enough Dumplings!",
            timeout: 2000
        };
        snackbar.MaterialSnackbar.showSnackbar(data);
    }
}

function loadClickFactory() {
    if(clickFactoryLevel === 0) {
        return;
    }

    var index = clickFactoryLevel - 1;
    var clickFactoryNewPerTwentySeconds = clickFactoryLevelData[index].perTwentySeconds;
    clickFactoryInterval = setInterval(function() {
        clicks += clickFactoryNewPerTwentySeconds;
        clickCount.innerText = `Dumplings: ${clicks}`;

        checkCases();
        checkStats();
    }, 20000);

    if(clickFactoryLevel >= clickFactoryLevelData.length) {
        clickFactoryCard.style.display = "none";
        clickFactorySpacer.style.display = "none";

        clickFactoryMax = true;
    }else {
        var nextClickFactoryLevel = clickFactoryLevel + 1;
        var nextClickFactoryPrice = clickFactoryLevelData[clickFactoryLevel].price;

        clickFactoryCardTitle.innerText = "Dumplings Factory (Lvl. " + nextClickFactoryLevel + ")";
        clickFactoryCardPrice.innerText = "Buy (" + nextClickFactoryPrice  + " Dumplings)";
    }
}
