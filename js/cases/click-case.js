var clickCaseTimeout;
var clicksRegex = new RegExp("\d*");

var clickCaseContents = [
    "500 Clicks",
    "500 Clicks",
    "500 Clicks",
    "500 Clicks",
    "1000 Clicks",
    "1000 Clicks",
    "1000 Clicks",
    "1500 Clicks",
    "1500 Clicks",
    "2500 Clicks",
    "5000 Clicks",
    "10000 Clicks",
    "25000 Clicks"
];

function getClickCaseResult() {
    return clickCaseContents[Math.floor(Math.random() * clickCaseContents.length)];
}

async function openClickCase() {
    caseDialog.style.display = "block";

    var elements = document.getElementsByClassName("clickCaseCard");
    var spacerElements = document.getElementsByClassName("clickCaseSpacer");
    elements[0].remove();
    spacerElements[0].remove();

    var index = casesInventory.indexOf("Click Case");
    if(index !== -1) {
        casesInventory.splice(index, 1);
    }

    caseUpdate();

    for(var i = 100; i <= 500; i += 10) {
        await delay(i);
        
        var item = getClickCaseResult();
        theItem.innerHTML = item;

        if(i !== 500) {
            playSound("defaultClickSound");
        }else {
            youGot.style.display = "block";
            caseOkay.style.display = "block";

            caseOkay.addEventListener("click", function() {
                caseDialog.style.display = "none";
                youGot.style.display = "none";
                theItem.innerHTML = "";
                caseOkay.style.display = "none";
            });

            casesOpened++;
            console.log(`Got Clicks: ${item}`);

            var newClicks = parseInt(item);
            clicks += newClicks;
            clickCount.innerText = `Clicks: ${clicks}`;

            playSound("buy");
        }
    }
}
