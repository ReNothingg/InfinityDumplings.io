var clickCount = document.getElementById("clickCount");

var clicks = 0;
var perClick = 1;
var clickSound = "defaultClickSound";

var unlockedClickSounds = [
    "defaultClickSound"
]

document.getElementById("clicker").addEventListener("click", function() {
    clicks += perClick;
    clickCount.innerText = `Dumplings: ${clicks}`;
    
    totalClicks++;
    
    checkStats();
    checkCases();
    playSound(clickSound);
});
