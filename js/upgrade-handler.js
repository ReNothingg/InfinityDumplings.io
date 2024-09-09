var allMaxed = document.getElementById("allMaxed");

function buy(upgrade) {
    switch(upgrade) {
        case("perClick"): {
            buyPerClick();
        }
        break;
        case("clickBomb"): {
            buyClickBomb();
        }
        break;
        case("clickFactory"): {
            buyClickFactory();
        }
        break;
        case("clickMiner"): {
            buyClickMiner();
        }
        break;
        case("autoClicker"): {
            buyAutoClicker();
        }
        break;
        case("clickPortal"): {
            buyClickPortal();
        }
        break;
        default: {
            var data = {
                message: `Upgrade "${upgrade}" Not Found!`,
                timeout: 2000
            };
            snackbar.MaterialSnackbar.showSnackbar(data);
        }
    }

    checkAllMax();
}

function checkAllMax() {
    if(allMax()) {
        console.log("All upgrades maxed!");

        allMaxed.style.display = "block";
    }
}

function allMax() {
    return perClickMax && clickBombMax && clickFactoryMax && clickMinerMax && autoClickerMax && clickPortalMax;
}
