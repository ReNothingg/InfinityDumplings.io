var clicker = document.getElementById("clicker");
var perClickCard = document.getElementById("perClickCard");
var perClickCardTitle = document.getElementById("perClickCardTitle");
var perClickCardPrice = document.getElementById("perClickCardPrice");
var perClickSpacer = document.getElementById("perClickSpacer");

var perClickLevel = 0;
var perClickMax = false;

var perClickLevelData = [
    {level: 1, price: 50, perClick: 2},
    {level: 2, price: 200, perClick: 3},
    {level: 3, price: 500, perClick: 5},
    {level: 4, price: 1000, perClick: 7},
    {level: 5, price: 2000, perClick: 10},
    {level: 6, price: 2500, perClick: 15},
    {level: 7, price: 5000, perClick: 20},
    {level: 8, price: 7500, perClick: 25},
    {level: 9, price: 10000, perClick: 50},
    {level: 10, price: 15000, perClick: 75},
    {level: 11, price: 25000, perClick: 100},
    {level: 12, price: 35000, perClick: 125},
    {level: 13, price: 45000, perClick: 150},
    {level: 14, price: 55000, perClick: 200},
    {level: 15, price: 75000, perClick: 250},
    {level: 16, price: 95000, perClick: 300},
    {level: 17, price: 105000, perClick: 400}
];

function buyPerClick() {
    if(clicks >= perClickLevelData[perClickLevel].price) {
        clicks -= perClickLevelData[perClickLevel].price;
        clickCount.innerText = `Dumplings: ${clicks}`;

        perClick = perClickLevelData[perClickLevel].perClick;
        clicker.innerText = "+" + perClick + " Dumplings";

        clicker.classList.remove("mdl-js-ripple-effect");
        clicker.classList.add("mdl-js-ripple-effect");
        
        perClickLevel++;
        
        if(perClickLevel >= perClickLevelData.length) {
            perClickCard.style.display = "none";
            perClickSpacer.style.display = "none";

            perClickMax = true;
        }else {
            var nextPerClickLevel = perClickLevel + 1;
            var nextPerClickPrice = perClickLevelData[perClickLevel].price;

            perClickCardTitle.innerText = "Per Dumplings (Lvl. " + nextPerClickLevel + ")";
            perClickCardPrice.innerText = "Buy (" + nextPerClickPrice + " Dumplings)";
        }

        upgradesBought++;
        
        playSound("buy");
        console.log(`Bought Upgrade: Per Dumplings, Level: ${perClickLevel}`);
    }else {
        var data = {
            message: "Not enough Dumplings!",
            timeout: 2000
        };
        snackbar.MaterialSnackbar.showSnackbar(data);
    }
}

function loadPerClick() {
    if(perClickLevel === 0) {
        return;
    }

    var index = perClickLevel - 1;
    perClick = perClickLevelData[index].perClick;
    clicker.innerText = "+" + perClick + " Dumplings";

    if(perClickLevel >= perClickLevelData.length) {
        perClickCard.style.display = "none";
        perClickSpacer.style.display = "none";

        perClickMax = true;
    }else {
        var nextPerClickLevel = perClickLevel + 1;
        var nextPerClickPrice = perClickLevelData[perClickLevel].price;

        perClickCardTitle.innerText = "Per Dumplings (Lvl. " + nextPerClickLevel + ")";
        perClickCardPrice.innerText = "Buy (" + nextPerClickPrice + " Dumplings)";
    }
}
