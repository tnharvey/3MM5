window.onload = function(){
  var cube = document.querySelector('.scene');
  document.addEventListener('keydown', userAction);

  loadModels();
}

// scenario scores
var scenario1 = 0;
var scenario2 = 0;
var scenario3 = 0;

var score = 3;

/* Scenarios */
function updateScenario(scenario,points){
  console.log(scenario+", "+points);
  if (points == -1 || points == 1){
    switch(scenario) {
      case 1:
        if(scenario1 == 0){
          scenario1 = points;
          score = score + points;
          document.getElementById("scenarioScore").innerHTML = score;
        }
        else {
          if(points==1 && scenario1==-1){
            scenario1 = points;
            score = score + 2;
            document.getElementById("scenarioScore").innerHTML = score;
          }
          else {
            return;
          }
        }
        break;
      case 2:
        if(scenario2 == 0){
          scenario2 = points;
          score = score + points;
          document.getElementById("scenarioScore").innerHTML = score;
        }
        else {
          if(points==1 && scenario2==-1){
            scenario2 = points;
            score = score + 2;
            document.getElementById("scenarioScore").innerHTML = score;
          }
          else {
            return;
          }
        }
        break;
      case 3:
        if(scenario3 == 0){
          scenario3 = points;
          score = score + points;
          document.getElementById("scenarioScore").innerHTML = score;
        }
        else {
          if(points==1 && scenario3==-1){
            scenario3 = points;
            score = score + 2;
            document.getElementById("scenarioScore").innerHTML = score;
          }
          else {
            return;
          }
        }
        break;
      default:
        console.log("Invalid scenario. Your attempt at hacking this course has been logged. :P")
    }
  }
  else {
    console.log("Invalid points. Your attempt at hacking this course has been logged. :P");
  }
  if (score == 6) {
    endScenario();
  }
}

function endScenario(){
    parent.postMessage("scenario complete","*");
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
    var afssDoor = document.querySelector('#afssDoor01');
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
                cube.classList.add("face-front-equipment");
                afssDoor.classList.add("afssDoor-open");
            }
            /*else if (cube.classList.contains("face-left")) {
                cube.classList.remove("face-left");
                cube.classList.add("face-left-table");
            }
            else if (cube.classList.contains("face-right")) {
                cube.classList.remove("face-right");
                cube.classList.add("face-right-table");
            }*/
        }
        if(uAction === "ArrowDown") {
            if (cube.classList.contains("face-front-equipment")) {
                cube.classList.remove("face-front-equipment");
                cube.classList.remove("afssDoor-open");
                cube.classList.add("face-front");
            }
            /*else if (cube.classList.contains("face-left-table")) {
                cube.classList.remove("face-left-table");
                cube.classList.add("face-left");
            }
            else if (cube.classList.contains("face-right-table")) {
                cube.classList.remove("face-right-table");
                cube.classList.add("face-right");
            }*/
        }
        if(uAction === "Enter") {
            if(document.getElementById('popupB').style.visibility === "visible")
            popupBClick();
        }
    }
}   

// Changes XML to JSON
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

function loadModels (modelsJson) {
  /* takes a JSON model parsed from XML manifest of models and folder locations, loads those models into the HTML document, and adds initial transform data if none is present in main stylesheet */

  var tableCode1 = $('<div id="table01" class="c3dContainer">');
  var tableCode2 = $('<div id="table02" class="c3dContainer">');
  var docCabCode = $('<div id="docCab01" class="c3dContainer">');
  var flLightCode1 = $('<div id="flLight01" class="c3dContainer">');
  var flLightCode2 = $('<div id="flLight02" class="c3dContainer">');
  var flLightCode3 = $('<div id="flLight03" class="c3dContainer">');
  var monitorCode1 = $('<div id="monitor01" class="c3dContainer">');
  var plugCode1 = $('<div id="plug01" class="c3dContainer">');
  var afssBodyCode1 = $('<div id="afssBody01" class="c3dContainer">');
  var afssDoorCode1 = $('<div id="afssDoor01" class="c3dContainer">');
  var afssStandCode1 = $('<div id="afssStand01" class="c3dContainer">');
  var afssStandCode2 = $('<div id="afssStand02" class="c3dContainer">');
  var cubeHeart1 = $('<div id="cubeHeart01" class="c3dContainer healthHeart">');
  var cubeHeart2 = $('<div id="cubeHeart02" class="c3dContainer healthHeart">');
  var cubeHeart3 = $('<div id="cubeHeart03" class="c3dContainer healthHeart">');

  tableCode1.load("models/table/tableDom.html");
  tableCode2.load("models/table/tableDom.html");
  docCabCode.load("models/documentCabinet/docCabDom.html");
  flLightCode1.load("models/flLight/flLightDom.html");
  flLightCode2.load("models/flLight/flLightDom.html");
  flLightCode3.load("models/flLight/flLightDom.html");
  monitorCode1.load("models/monitor/monitorDom.html");
  plugCode1.load("models/plug/plugDom.html");
  afssBodyCode1.load("models/afssBody/afssBodyDom.html");
  afssDoorCode1.load("models/afssDoor/afssDoorDom.html");
  afssStandCode1.load("models/afssStand/afssStandDom.html");
  afssStandCode2.load("models/afssStand/afssStandDom.html");
  cubeHeart1.load("models/cubeHeart/cubeHeartDom.html");
  cubeHeart2.load("models/cubeHeart/cubeHeartDom.html");
  cubeHeart3.load("models/cubeHeart/cubeHeartDom.html");
  $("#scene1").append(tableCode1,tableCode2,docCabCode,flLightCode1,flLightCode2,flLightCode3,monitorCode1,plugCode1,afssBodyCode1,afssDoorCode1,afssStandCode1,afssStandCode2);
  $("#health").append(cubeHeart1,cubeHeart2,cubeHeart3);
  $("head").append('<link rel="stylesheet" href="models/table/tableStyle.css" />');
  $("head").append('<link rel="stylesheet" href="models/documentCabinet/docCabStyle.css" />');
  $("head").append('<link rel="stylesheet" href="models/flLight/flLightStyle.css" />');
  $("head").append('<link rel="stylesheet" href="models/monitor/monitorStyle.css" />');
  $("head").append('<link rel="stylesheet" href="models/plug/plugStyle.css" />');
  $("head").append('<link rel="stylesheet" href="models/afssBody/afssBodyStyle.css" />');
  $("head").append('<link rel="stylesheet" href="models/afssDoor/afssDoorStyle.css" />');
  $("head").append('<link rel="stylesheet" href="models/afssStand/afssStandStyle.css" />');
  $("head").append('<link rel="stylesheet" href="models/cubeHeart/cubeHeartStyle.css" />');
}