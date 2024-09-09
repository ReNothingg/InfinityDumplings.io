var soundCaseTimeout;

var soundCaseContents = [
    "bombClickSound",
    "airhornClickSound",
    "rainbowClickSound",
    "fartClickSound"
];

function getSoundCaseResult() {
    return soundCaseContents[Math.floor(Math.random() * soundCaseContents.length)];
}

async function openSoundCase() {
    caseDialog.style.display = "block";

    var elements = document.getElementsByClassName("soundCaseCard");
    var spacerElements = document.getElementsByClassName("soundCaseSpacer");
    elements[0].remove();
    spacerElements[0].remove();

    var index = casesInventory.indexOf("Sound Case");
    if(index !== -1) {
        casesInventory.splice(index, 1);
    }

    caseUpdate();

    for(var i = 100; i <= 500; i += 10) {
        await delay(i);
        
        var item = soundUnIdify(getSoundCaseResult());
        theItem.innerHTML = item;
        
        if(i !== 500) {
            playSound("defaultClickSound");
        }else {
            if(unlockedClickSounds.indexOf(soundIdify(item)) === -1) {
                unlockedClickSounds.push(soundIdify(item));
            }

            youGot.style.display = "block";
            caseOkay.style.display = "block";

            caseOkay.addEventListener("click", function() {
                caseDialog.style.display = "none";
                youGot.style.display = "none";
                theItem.innerHTML = "";
                caseOkay.style.display = "none";
            });

            casesOpened++;
            console.log(`Got Sound: ${item}`);

            playSound("buy");
        }
    }
}
