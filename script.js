/*
- Remove keyboard navigation
training to scenario transition function
- Unload/load assets, images, etc. (should this be crossfade between two scenes)
- Hide/Show (load/unload?) training/scenario content containers
- Trigger initial scenario popup

Slide interface
- *Popup
  - Popup with iframe or load()
*/

  window.onload = function(){
  var cube = document.querySelector('.scene');
  document.addEventListener('keydown', userAction);

  let viewCards = document.getElementsByClassName('popup3d');
  let viewCardsArr = Array.prototype.slice.call(viewCards);
  viewCardsArr.forEach(function(item){
    item.addEventListener("click",userAction);
  });

  browserCheck();

  document.getElementById("backButton").addEventListener("click",userAction);
  loadModels();
}

const baseUrl = "";

// scenario scores
var devControls = false;
var scenario1 = 0;
var scenario2 = 0;
var scenario3 = 0;
var score = 3;

/* Scenarios */
function updateScenario(scenario,points){
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
  updateHealth();
  if (score==6) {
    endScenario();
  }
}

function resetScenario(){
  score = 3;
  scenario1 = 0;
  scenario2 = 0;
  scenario3 = 0;
  document.getElementById("scenarioScore").innerHTML = 3;
  updateHealth();
}

function endScenario(){
  updateHealth();
  parent.postMessage("scenario complete","*");
  window.alert("Scenario Complete. You've helped to save PFC Bosky!")
}

function updateHealth() {
  var heart1 = document.getElementById("cubeHeart01");
  var heart2 = document.getElementById("cubeHeart02")
  var heart3 = document.getElementById("cubeHeart03")
  
  switch(score) {
    case 0:
      heart1.classList.add("hide");
      heart2.classList.add("hide");
      heart3.classList.add("hide");
      break;
    case 1:
      if (heart1.classList.contains("healthy")) {
        heart1.classList.remove("healthy");
        heart1.classList.add("sick");
      }
      if (heart1.classList.contains("hide")) {
        heart1.classList.remove("hide");
      }
      heart2.classList.add("hide");
      heart3.classList.add("hide");
      break;
    case 2:
      if (heart1.classList.contains("healthy")) {
        heart1.classList.remove("healthy");
        heart1.classList.add("sick");
      }
      if (heart1.classList.contains("hide")) {
        heart1.classList.remove("hide");
      }
      if (heart2.classList.contains("healthy")) {
        heart2.classList.remove("healthy");
        heart2.classList.add("sick");
      }
      if (heart2.classList.contains("hide")) {
        heart2.classList.remove("hide");
      }
      heart3.classList.add("hide");
      break;
    case 3:
      if (heart1.classList.contains("healthy")) {
        heart1.classList.remove("healthy");
        heart1.classList.add("sick");
      }
      if (heart1.classList.contains("hide")) {
        heart1.classList.remove("hide");
      }
      if (heart2.classList.contains("healthy")) {
        heart2.classList.remove("healthy");
        heart2.classList.add("sick");
      }
      if (heart2.classList.contains("hide")) {
        heart2.classList.remove("hide");
      }
      if (heart3.classList.contains("healthy")) {
        heart3.classList.remove("healthy");
        heart3.classList.add("sick");
      }
      if (heart3.classList.contains("hide")) {
        heart3.classList.remove("hide");
      }
      break;
    case 4:
      if (heart1.classList.contains("sick")) {
        heart1.classList.remove("sick");
        heart1.classList.add("healthy");
      }
      if (heart1.classList.contains("hide")) {
        heart1.classList.remove("hide");
      }
      if (heart2.classList.contains("healthy")) {
        heart2.classList.remove("healthy");
        heart2.classList.add("sick");
      }
      if (heart2.classList.contains("hide")) {
        heart2.classList.remove("hide");
      }
      if (heart3.classList.contains("healthy")) {
        heart3.classList.remove("healthy");
        heart3.classList.add("sick");
      }
      if (heart3.classList.contains("hide")) {
        heart3.classList.remove("hide");
      }
      break;
    case 5:
      if (heart1.classList.contains("sick")) {
        heart1.classList.remove("sick");
        heart1.classList.add("healthy");
      }
      if (heart2.classList.contains("sick")) {
        heart2.classList.remove("sick");
        heart2.classList.add("healthy");
      }
      if (heart3.classList.contains("healthy")) {
        heart3.classList.remove("healthy");
        heart3.classList.add("sick");
      }
      break;
    case 6:
      if (heart1.classList.contains("sick")) {
        heart1.classList.remove("sick");
        heart1.classList.add("healthy");
      }
      if (heart2.classList.contains("sick")) {
        heart2.classList.remove("sick");
        heart2.classList.add("healthy");
      }
      if (heart3.classList.contains("sick")) {
        heart3.classList.remove("sick");
        heart3.classList.add("healthy");
      }
      break;
  }
}

/* Inline click funcions, need to set up with listeners */
function showPopup (popupId) {
    document.getElementById(popupId).style.display="flex";
}

function hidePopup (popupId) {
    document.getElementById(popupId).style.display="none";
}

function userAction (input) {
/* Primary user action handler. Checks for type of input as some are currently inline pasing strings.
   Depending on action, triggers/toggles CSS clases or styles to effect 3D movement. */
    var cube = document.querySelector('#scene1');
    var orientation = cube.classList[1];
    var afssDoor = document.querySelector('#afssDoor01');
    var uAction = "";

    if (typeof(input)==='object') {
      if(input.key=="ArrowUp"||input.key=="ArrowDown" ||input.key=="ArrowLeft"||input.key=="ArrowDown"){
        // Prevent scrolling on arrow keypress, which makes page jump around when navigating with keyboard
        input.preventDefault();
      }
      if(input.type=="keydown"){
        uAction = input.key;
      }
      else if(input.type="click"){
        uAction = input.path[0].dataset.targetDir;
      }
    }
    else if (typeof(input)==='string') {
        uAction = input;
    }
  if (uAction !== "") {
    //Dev controls toggle
    if (uAction =="D"){
      var devElements = document.getElementsByClassName("dev");
      Array.from(devElements).forEach(
        function(element,index,array){
          if(element.classList.contains("delete")){
            element.classList.remove("delete")
            element.classList.add("dashItem")
          }
          else {
            element.classList.add("delete")
            element.classList.remove("dashItem")
          }
        });
    }
    if(uAction.search("face-")==0){
      if(uAction == "face-front"||uAction == "face-right"||uAction == "face-left"){
        cube.classList.remove(cube.classList[1]);
        cube.classList.add(uAction);
        document.getElementById("cards").style.visibility="visible";
        document.getElementById("backButton").style.opacity="0";
        if (uAction=="face-front" && document.getElementById("afssDoor01").classList.contains("afssDoor-open")){
          document.getElementById("afssDoor01").classList.remove("afssDoor-open");
        }
      }
      else {
        document.getElementById("backButton").dataset.targetDir = cube.classList[1];
        cube.classList.remove(cube.classList[1]);
        cube.classList.add(uAction);
        document.getElementById("cards").style.visibility="hidden";
        document.getElementById("backButton").style.opacity=1;
        if(uAction=="face-equipment") {
          document.getElementById("afssDoor01").classList.add("afssDoor-open");
        }
        if(uAction=="face-computer") {
          showPopup("popupC");
          loadContent ("popTest","popups/computerTraining/","popupC");
        }
        if(uAction=="face-equipment") {
          showPopup("popupD");
        }
      }
    }
    if (orientation=="face-front") {
      if(uAction === "ArrowLeft") {
        cube.classList.remove("face-front");
        cube.classList.add("face-left");
      }
      else if (uAction === "ArrowRight"){
        cube.classList.remove("face-front");
        cube.classList.add("face-right");
      }
      else if (uAction === "ArrowUp"){
        cube.classList.remove("face-front");
        cube.classList.add("face-equipment");
        document.getElementById("afssDoor01").classList.add("afssDoor-open");
        document.getElementById("cards").style.visibility="hidden";
      }
      else if (uAction === "ArrowDown"){}
      else if (uAction === "Enter"){}
    }
    else if (orientation=="face-left"){
      if(uAction === "ArrowLeft") {}
      else if (uAction === "ArrowRight"){
        cube.classList.remove("face-left");
        cube.classList.add("face-front");
      }
      else if (uAction === "ArrowUp"){
        cube.classList.remove("face-left");
        cube.classList.add("face-resources");
        document.getElementById("cards").style.visibility="hidden";
      }
      else if (uAction === "ArrowDown"){}
      else if (uAction === "Enter"){}
    }
    else if (orientation=="face-right"){
      if(uAction === "ArrowLeft") {
        cube.classList.remove("face-right");
        cube.classList.add("face-front");
      }
      else if (uAction === "ArrowRight"){}
      else if (uAction === "ArrowUp"){
        cube.classList.remove("face-right");
        cube.classList.add("face-computer");
        document.getElementById("cards").style.visibility="hidden";
      }
      else if (uAction === "ArrowDown"){}
      else if (uAction === "Enter"){}
    }
    else if (orientation=="face-equipment"){
      if(uAction === "ArrowLeft") {}
      else if (uAction === "ArrowRight"){}
      else if (uAction === "ArrowUp"){}
      else if (uAction === "ArrowDown"){
        cube.classList.remove("face-equipment");
        document.getElementById("afssDoor01").classList.remove("afssDoor-open");
        cube.classList.add("face-front");
        document.getElementById("cards").style.visibility="visible";
      }
      else if (uAction === "Enter"){}
    }
    else if (orientation=="face-resources"){
      if(uAction === "ArrowLeft") {}
      else if (uAction === "ArrowRight"){}
      else if (uAction === "ArrowUp"){}
      else if (uAction === "ArrowDown"){
        cube.classList.remove("face-resources");
        cube.classList.add("face-left");
        document.getElementById("cards").style.visibility="visible";
      }
      else if (uAction === "Enter"){}
    }
    else if (orientation=="face-computer"){
      if(uAction === "ArrowLeft") {
        cube.classList.remove("face-computer");
        cube.classList.add("face-references");
      }
      else if (uAction === "ArrowRight"){}
      else if (uAction === "ArrowUp"){}
      else if (uAction === "ArrowDown"){
        cube.classList.remove("face-computer");
        cube.classList.add("face-right");
        document.getElementById("cards").style.visibility="visible";
      }
      else if (uAction === "Enter"){}
    }
    else if (orientation=="face-references"){
      if(uAction === "ArrowLeft") {}
      else if (uAction === "ArrowRight"){
        cube.classList.remove("face-references");
        cube.classList.add("face-computer");
      }
      else if (uAction === "ArrowUp"){}
      else if (uAction === "ArrowDown"){
        cube.classList.remove("face-references");
        cube.classList.add("face-right");
        document.getElementById("cards").style.visibility="visible";
      }
      else if (uAction === "Enter"){}
    }
    else if ((input.shiftKey && uAction =="ArrowLeft")||uAction=="rotLeft"){}
    else if ((input.shiftKey && uAction =="ArrowRight")||uAction=="rotRight"){}
  }
}   

function loadContent (contentId,contentLoc,targetId,params) {
  /* Load content from local folder directory to target element ID */

  var newElementCode = $('<div id="'+contentId+'" class="loaded">');

  newElementCode.load(contentLoc+"index.html");
  
  $('#'+targetId).append(newElementCode);

  $("head").append('<link rel="stylesheet" href="'+contentLoc+'style.css" />');
}

function removeContent(targetId) {
  document.getElementById("popTest").remove();
}

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
  var cubeHeart1 = $('<div id="cubeHeart01" class="c3dContainer healthHeart sick">');
  var cubeHeart2 = $('<div id="cubeHeart02" class="c3dContainer healthHeart sick">');
  var cubeHeart3 = $('<div id="cubeHeart03" class="c3dContainer healthHeart sick">');
  var manualSm1 = $('<div id="manualSm01" class="c3dContainer">');

  tableCode1.load(baseUrl+"models/table/tableDom.html");
  tableCode2.load(baseUrl+"models/table/tableDom.html");
  docCabCode.load(baseUrl+"models/documentCabinet/docCabDom.html");
  flLightCode1.load(baseUrl+"models/flLight/flLightDom.html");
  flLightCode2.load(baseUrl+"models/flLight/flLightDom.html");
  flLightCode3.load(baseUrl+"models/flLight/flLightDom.html");
  monitorCode1.load(baseUrl+"models/monitor/monitorDom.html");
  plugCode1.load(baseUrl+"models/plug/plugDom.html");
  afssBodyCode1.load(baseUrl+"models/afssBody/afssBodyDom.html");
  afssDoorCode1.load(baseUrl+"models/afssDoor/afssDoorDom.html");
  afssStandCode1.load(baseUrl+"models/afssStand/afssStandDom.html");
  afssStandCode2.load(baseUrl+"models/afssStand/afssStandDom.html");
  cubeHeart1.load(baseUrl+"models/cubeHeart/cubeHeartDom.html");
  cubeHeart2.load(baseUrl+"models/cubeHeart/cubeHeartDom.html");
  cubeHeart3.load(baseUrl+"models/cubeHeart/cubeHeartDom.html");
  manualSm1.load(baseUrl+"models/manualSm/manualSmDom.html");
  $("#scene1").append(tableCode1,tableCode2,docCabCode,flLightCode1,flLightCode2,flLightCode3,monitorCode1,plugCode1,afssBodyCode1,afssDoorCode1,afssStandCode1,afssStandCode2);
  $("#health").append(cubeHeart1,cubeHeart2,cubeHeart3);
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/table/tableStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/documentCabinet/docCabStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/flLight/flLightStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/monitor/monitorStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/plug/plugStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/afssBody/afssBodyStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/afssDoor/afssDoorStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/afssStand/afssStandStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/cubeHeart/cubeHeartStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/manualSm/manualSmStyle.css" />');
}

function browserCheck() {
  // Uses computer style to detect browser. If browser if Moz, blocks interaction with popup.
  
  var prefix = (Array.prototype.slice
    .call(window.getComputedStyle(document.documentElement, ""))
    .join("") 
    .match(/-(moz|webkit|ms)-/))[1];

  if (prefix == "moz") {
    document.getElementById("browser-error").style.display="flex";
  }
}
// Functions in development
/*
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

function getSceneTransformXYZ(scene) {
  if (scene.transform.includes('3d')) {
    var rawMatrixArr = scene.transform.match(/matrix.*\((.+)\)/)[1].split(', ');
    var x = rawMatrixArr[12];
    var y = rawMatrixArr[13];
    var z = rawMatrixArr[14];
  }
}
*/