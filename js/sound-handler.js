function playSound(sound) {
    if(innerWidth >= 840 || document.getElementById("mobileSoundsCheckbox").checked) {
        switch(sound) {
            case("defaultClickSound"): {
                new Audio(`./sounds/click-sounds/${sound}.mp3`).play();
            }
            break;
            case("bombClickSound"): {
                new Audio(`./sounds/click-sounds/${sound}.mp3`).play();
            }
            break;
            case("airhornClickSound"): {
                new Audio(`./sounds/click-sounds/${sound}.mp3`).play();
            }
            break;
            case("rainbowClickSound"): {
                new Audio(`./sounds/click-sounds/${sound}.mp3`).play();
            }
            break;
            case("fartClickSound"): {
                new Audio(`./sounds/click-sounds/${sound}.mp3`).play();
            }
            break;
            case("buy"): {
                new Audio(`./sounds/${sound}.mp3`).play();
            }
            break;
            case("none"): {
                // Do Nothing
            }
            break;
            default: {
                var data = {
                    message: `Sound "${sound}" Not Found!`,
                    timeout: 2000
                };
                snackbar.MaterialSnackbar.showSnackbar(data);
            }
        }
    }
}

function soundIdify(theSound) {
    switch(theSound) {
        case("Default Click Sound"): {
            return "defaultClickSound";
        }
        case("Bomb Click Sound"): {
            return "bombClickSound";
        }
        case("Airhorn Click Sound"): {
            return "airhornClickSound";
        }
        case("Rainbow Click Sound"): {
            return "rainbowClickSound";
        }
        case("Fart Click Sound"): {
            return "fartClickSound";
        }
        default: {
            var data = {
                message: `Case "${theSound}" Not Found!`,
                timeout: 2000
            };
            snackbar.MaterialSnackbar.showSnackbar(data);
        }
    }
}

function soundUnIdify(theSound) {
    switch(theSound) {
        case("defaultClickSound"): {
            return "Default Click Sound";
        }
        case("bombClickSound"): {
            return "Bomb Click Sound";
        }
        case("airhornClickSound"): {
            return "Airhorn Click Sound";
        }
        case("rainbowClickSound"): {
            return "Rainbow Click Sound";
        }
        case("fartClickSound"): {
            return "Fart Click Sound";
        }
        default: {
            var data = {
                message: `Sound "${theSound}" Not Found!`,
                timeout: 2000
            };
            snackbar.MaterialSnackbar.showSnackbar(data);
        }
    }
}
