var caseDialog = document.getElementById("caseDialog");
var theItem = document.getElementById("theItem");
var youGot = document.getElementById("youGot");
var caseOkay = document.getElementById("caseOkay");
var caseList = document.getElementById("caseList");
var noCases = document.getElementById("noCases");

var soundCaseCardDescription = "Gives a random sound that can be used for clicking.";
var clickCaseCardDescription = "Gives you clicks.";

var cases = [
    "Sound Case",
    "Click Case"
];

var caseData = [
    {clicks: 150, got: false},
    {clicks: 300, got: false},
    {clicks: 500, got: false},
    {clicks: 1000, got: false},
    {clicks: 1500, got: false},
    {clicks: 2500, got: false},
    {clicks: 5000, got: false},
    {clicks: 8000, got: false},
    {clicks: 12000, got: false},
    {clicks: 17000, got: false},
    {clicks: 25000, got: false},
    {clicks: 32000, got: false}
];

var casesInventory = [];

function checkCases() {
    for(x in caseData) {
        if(clicks >= caseData[x].clicks && !caseData[x].got) {            
            var caseGot = cases[generateNumberBetween(0, cases.length - 1)];
            caseData[x].got = true;
            
            casesInventory.push(caseGot);
            console.log(`Got Case: ${caseGot}`);
            
            var data = {
                message: `Got Case: ${caseGot}`,
                timeout: 2000
            };
            snackbar.MaterialSnackbar.showSnackbar(data);
            
            showCase(caseGot, caseIdify(caseGot));
            caseUpdate();

            return;
        }   
    }
}

function caseIdify(theCase) {
    switch(theCase) {
        case("Sound Case"): {
            return "soundCase";
        }
        case("Click Case"): {
            return "clickCase";
        }
        default: {
            var data = {
                message: `Case "${theCase}" Not Found!`,
                timeout: 2000
            };
            snackbar.MaterialSnackbar.showSnackbar(data);
        }
    }
}

function caseUnIdify(theCase) {
    switch(theCase) {
        case("soundCase"): {
            return "Sound Case";
        }
        case("clickCase"): {
            return "Click Case";
        }
        default: {
            var data = {
                message: `Case "${theCase}" Not Found!`,
                timeout: 2000
            };
            snackbar.MaterialSnackbar.showSnackbar(data);
        }
    }
}

function showCase(caseName, caseID) {
    var caseDiv = document.createElement("div");
    var imageDiv = document.createElement("div");
    var supportingTextDiv = document.createElement("div");
    var caseTitle = document.createElement("h3");
    var caseDescription = document.createElement("p");
    var caseOptionsDiv = document.createElement("div");
    var openCaseButton = document.createElement("a");
    var spacer = document.createElement("div");

    caseDiv.classList.add(`${caseID}Card`, "card-wide", "mdl-card", "mdl-shadow--2dp", "mdl-cell", "mdl-cell--3-col-desktop", "mdl-cell--4-col-tablet");

    imageDiv.id = `${caseID}CardImage`;
    imageDiv.classList.add("mdl-card__title");

    supportingTextDiv.classList.add("mdl-card__supporting-text"); 

    caseTitle.innerText = caseName;

    switch(caseID) {
        case("soundCase"): {
            caseDescription.innerText = soundCaseCardDescription;
        }
        break;
        case("clickCase"): {
            caseDescription.innerText = clickCaseCardDescription;
        }
        break;
        default: {
            var data = {
                message: `Case "${theCase}" Not Found!`,
                timeout: 2000
            };
            snackbar.MaterialSnackbar.showSnackbar(data);
        }
    }

    caseOptionsDiv.classList.add("mdl-card__actions", "mdl-card--border");

    openCaseButton.classList.add("mdl-button", "mdl-button--colored", "mdl-js-button", "mdl-js-ripple-effect");
    openCaseButton.innerText = "Open Case";
    openCaseButton.addEventListener("click", function() {
        switch(caseID) {
            case("soundCase"): {
                openSoundCase();
            }
            break;
            case("clickCase"): {
                openClickCase();
            }
            break;
            default: {
                var data = {
                    message: `Case "${theCase}" Not Found!`,
                    timeout: 2000
                };
                snackbar.MaterialSnackbar.showSnackbar(data);
            }
        }
    });

    spacer.classList.add(`${caseID}Spacer`, "mdl-layout-spacer");
    
    caseDiv.append(imageDiv);
    supportingTextDiv.append(caseTitle);
    supportingTextDiv.append(caseDescription);
    caseDiv.append(supportingTextDiv);
    caseOptionsDiv.append(openCaseButton);
    caseDiv.append(caseOptionsDiv);
    caseList.append(caseDiv);
    caseList.append(spacer);
}

function loadCases() {
    console.log("Loading cases...");

    for(x in casesInventory) {
        switch(caseIdify(casesInventory[x])) {
            case("soundCase"): {
                showCase("Sound Case", "soundCase", soundCaseCardDescription);
            }
            break;
            case("clickCase"): {
                showCase("Click Case", "clickCase", clickCaseCardDescription);
            }
            break;
            default: {
                var data = {
                    message: `Case "${casesInventory[x]}" Not Found!`,
                    timeout: 2000
                };
                snackbar.MaterialSnackbar.showSnackbar(data);
            }
        }
    }
    
    caseUpdate();
}

function caseUpdate() {
    if(casesInventory.length === 0) {
        noCases.style.display = "block";
    }else {
        noCases.style.display = "none";
    }
}
