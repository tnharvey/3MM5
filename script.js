window.onload = function(){
    var cube = document.querySelector('.scene');
    document.addEventListener('keydown', userAction);

    var tableCode = $('<div id="table01" class="c3dContainer">');
    var docCabCode = $('<div id="docCab01" class="c3dContainer">');
    var flLightCode1 = $('<div id="flLight01" class="c3dContainer">');
    var flLightCode2 = $('<div id="flLight02" class="c3dContainer">');
    var flLightCode3 = $('<div id="flLight03" class="c3dContainer">');

    tableCode.load("models/table/tableDom.html");
    docCabCode.load("models/documentCabinet/docCabDom.html");
    flLightCode1.load("models/flLight/flLightDom.html");
    flLightCode2.load("models/flLight/flLightDom.html");
    flLightCode3.load("models/flLight/flLightDom.html");
    
    $("#scene1").append(tableCode,docCabCode,flLightCode1,flLightCode2,flLightCode3);
    $("head").append('<link rel="stylesheet" href="models/table/tableStyle.css" />');
    $("head").append('<link rel="stylesheet" href="models/documentCabinet/docCabStyle.css" />');
    $("head").append('<link rel="stylesheet" href="models/flLight/flLightStyle.css" />');
}

/* Inline click funcions, need to set up with listeners */
function showPopup (popupId) {
    document.getElementById(popupId).style.display="flex";
}

function hidePopup (popupId) {
    document.getElementById(popupId).style.display="none";
}

function wallClick () {
    document.getElementById("popupA").style.display="flex";
}

function popupAClick () {
    document.getElementById("popupA").style.display="none";
}

function tableClick () {
    document.getElementById("popupB").style.display="flex";
}

function popupBClick () {
    document.getElementById("popupB").style.display="none";
}

function userAction (input) {
/* Primary user action handler. Checks for type of input as some are currently inline pasing strings.
   Depending on action, triggers/toggles CSS clases or styles to effect 3D movement. */
    var cube = document.querySelector('.scene');
    var uAction = "";

    if (typeof(input)==='object') {
        uAction = input.key;
    }
    else if (typeof(input)==='string') {
        uAction = input;
    }
    
    if (uAction !== "") {
        if(uAction === "ArrowLeft") {
            if (cube.classList.contains("face-right")) {
                cube.classList.remove("face-right");
                cube.classList.add("face-front");
            }
            else if (cube.classList.contains("face-front")) {
                cube.classList.remove("face-front");
                cube.classList.add("face-left");
            }
        }
        if (uAction === "ArrowRight") {
            if (cube.classList.contains("face-left")) {
                cube.classList.remove("face-left");
                cube.classList.add("face-front");
            }
            else if (cube.classList.contains("face-front")) {
                cube.classList.remove("face-front");
                cube.classList.add("face-right");
            }
        }
        if(uAction === "ArrowUp") {
            if (cube.classList.contains("face-front")) {
                cube.classList.remove("face-front");
                cube.classList.add("face-front-table");
            }
            else if (cube.classList.contains("face-left")) {
                cube.classList.remove("face-left");
                cube.classList.add("face-left-table");
            }
            else if (cube.classList.contains("face-right")) {
                cube.classList.remove("face-right");
                cube.classList.add("face-right-table");
            }
        }
        if(uAction === "ArrowDown") {
            if (cube.classList.contains("face-front-table")) {
                cube.classList.remove("face-front-table");
                cube.classList.add("face-front");
            }
            else if (cube.classList.contains("face-left-table")) {
                cube.classList.remove("face-left-table");
                cube.classList.add("face-left");
            }
            else if (cube.classList.contains("face-right-table")) {
                cube.classList.remove("face-right-table");
                cube.classList.add("face-right");
            }
        }
        if(uAction === "Enter") {
            if(document.getElementById('popupB').style.visibility === "visible")
            popupBClick();
        }
    }
}   