/* TO DO

1. update messages
2. create function to check which options have content, set 3d card to glow.
3. Update score/health (waiting for feedback from charles)
- Refactor popup system to use array/object and allow for tracking the last popup and close it or close all popups
Might also be able to use an object to load and track all popup info at once and load/unload individual ones
- Refactor to have transition listener on transition between challenges. Maybe refactor to have a function that handles start/stop of listener.
- Refactor to have relevant areas tracked in objects (i.e. all 3d cards have state stored in object and updated)
*/

window.onload = function(){
  var cube = document.querySelector('.scene');

  let viewCards = document.getElementsByClassName('popup3d');
  let viewCardsArr = Array.prototype.slice.call(viewCards);
  
  viewCardsArr.forEach(function(item){
    item.addEventListener("click",userAction);
  });
  //$("#cancelStart")[0].addEventListener("click",userAction);

  browserCheck();
  
  loadContent ("popLoad","popups/intro/","popupIntro","index",true);
  showPopup("popupIntro");
  
  window.addEventListener("message", (event) => {
    if (event.data == "start") {
      startScenario();
    }
  }, false);

  document.getElementById("backButton").addEventListener("click",userAction);
  loadModels();
}

const baseUrl = "";

// scenario scores
var currentChallenge = 1;
var score = 3;
var activeAreas = {resources:0,forms:0,computer:0,equipment:0};
var currentPopup = "";
var choices = {
  challenge01:0,
  challenge02:0,
  challenge03:0,
  challenge04:0,
  challenge05:0,
};

/* Scenarios */
function startScenario() {
  hideCurrentPopup();
  removeContent('popLoad');
  // initiate any starting sequence
  updateScenario();
}

function updateScenario(){
  var cards = document.getElementsByClassName('popup3d');
  switch (currentChallenge) {
    case 1:
      loadContent("challenge01","popups/challenges/challenge01/","popupChallenge","challenge01");
      loadContent("option01","popups/challenges/challenge01/","popupOption01","option01");
      loadContent("option02","popups/challenges/challenge01/","popupOption02","option02");
      loadContent("option03","popups/challenges/challenge01/","popupOption03","option03");
      loadContent("feedback01","popups/challenges/challenge01/","popupFeedback01","option01FB");
      loadContent("feedback02","popups/challenges/challenge01/","popupFeedback02","option02FB");
      loadContent("feedback03","popups/challenges/challenge01/","popupFeedback03","option03FB");
      // add glow class to all relevant areas in room (remove glow from all then add)
      activeAreas.computer = 1;
      activeAreas.equipment = 1;
      activeAreas.forms = 1;
      updateCards();
      showPopup("popupChallenge");
      //updateMessage
      break;
    case 2:
      removeContent("challenge01");
      removeContent("option01");
      removeContent("option02");
      removeContent("option03");
      removeContent("feedback01");
      removeContent("feedback02");
      removeContent("feedback03");
      loadContent("challenge02","popups/challenges/challenge02/","popupChallenge","challenge02");
      loadContent("option01","popups/challenges/challenge02/","popupOption01","option01");
      loadContent("option02","popups/challenges/challenge02/","popupOption02","option02");
      loadContent("option03","popups/challenges/challenge02/","popupOption03","option03");
      loadContent("feedback01","popups/challenges/challenge02/","popupFeedback01","option01FB");
      loadContent("feedback02","popups/challenges/challenge02/","popupFeedback02","option02FB");
      loadContent("feedback03","popups/challenges/challenge02/","popupFeedback03","option03FB");
      hideCurrentPopup();
      // add glow class to all relevant areas in room (remove glow from all then add)
      Array.from(cards).forEach((card) => {
        document.getElementById(card.id).classList.remove("glow");
      });
      activeAreas.computer = 1;
      activeAreas.equipment = 1;
      activeAreas.forms = 1;
      updateCards();
      showPopup("popupChallenge");
      break;
    case 3:
      removeContent("challenge02");
      removeContent("option01");
      removeContent("option02");
      removeContent("option03");
      removeContent("feedback01");
      removeContent("feedback02");
      removeContent("feedback03");
      loadContent("challenge03","popups/challenges/challenge03/","popupChallenge","challenge03");
      loadContent("option01","popups/challenges/challenge03/","popupOption01","option01");
      loadContent("option02","popups/challenges/challenge03/","popupOption02","option02");
      loadContent("option03","popups/challenges/challenge03/","popupOption03","option03");
      loadContent("feedback01","popups/challenges/challenge03/","popupFeedback01","option01FB");
      loadContent("feedback02","popups/challenges/challenge03/","popupFeedback02","option02FB");
      loadContent("feedback03","popups/challenges/challenge03/","popupFeedback03","option03FB");
      hideCurrentPopup();
      // add glow class to all relevant areas in room (remove glow from all then add)
      activeAreas.computer = 1;
      activeAreas.equipment = 1;
      activeAreas.forms = 1;
      updateCards();
      showPopup("popupChallenge");
      break;
    case 4:
      removeContent("challenge03");
      removeContent("option01");
      removeContent("option02");
      removeContent("option03");
      removeContent("feedback01");
      removeContent("feedback02");
      removeContent("feedback03");
      loadContent("challenge04","popups/challenges/challenge04/","popupChallenge","challenge04");
      loadContent("option01","popups/challenges/challenge04/","popupOption01","option01");
      loadContent("option03","popups/challenges/challenge04/","popupOption03","option03");
      loadContent("option04","popups/challenges/challenge04/","popupOption04","option04");
      loadContent("feedback01","popups/challenges/challenge04/","popupFeedback01","option01FB");
      loadContent("feedback03","popups/challenges/challenge04/","popupFeedback03","option03FB");
      loadContent("feedback04","popups/challenges/challenge04/","popupFeedback04","option04FB");
      hideCurrentPopup();
      // add glow class to all relevant areas in room (remove glow from all then add)
      activeAreas.computer = 1;
      activeAreas.equipment = 1;
      activeAreas.forms = 0;
      activeAreas.resources = 1;
      updateCards();
      showPopup("popupChallenge");
      break;
    case 5:
      removeContent("challenge04");
      removeContent("option01");
      removeContent("option02");
      removeContent("option03");
      removeContent("feedback01");
      removeContent("feedback02");
      removeContent("feedback03");
      loadContent("challenge05","popups/challenges/challenge05/","popupChallenge","challenge05");
      loadContent("option01","popups/challenges/challenge05/","popupOption01","option01");
      loadContent("option02","popups/challenges/challenge05/","popupOption02","option02");
      loadContent("option03","popups/challenges/challenge05/","popupOption03","option03");
      loadContent("feedback01","popups/challenges/challenge05/","popupFeedback01","option01FB");
      loadContent("feedback02","popups/challenges/challenge05/","popupFeedback02","option02FB");
      loadContent("feedback03","popups/challenges/challenge05/","popupFeedback03","option03FB");
      hideCurrentPopup();
      // add glow class to all relevant areas in room (remove glow from all then add)
      activeAreas.computer = 1;
      activeAreas.equipment = 1;
      activeAreas.forms = 1;
      activeAreas.resources = 0;
      updateCards();
      showPopup("popupChallenge");
      break;
    case 6:
      console.log("updateScenario: No content loaded for 6.");
      break;
    default:
      console.log("updateScenario: Invald challenge value.");
      break;
  }
  //updateHealth();
  if (score==6) {
    endScenario();
  }
  updateCards();
}

function updateCards () {
  for (var area in activeAreas) {
    if(activeAreas[area]==1) {
      document.getElementById(area+"-card").classList.add("glow");
    }
    else if(activeAreas[area]==0){
      document.getElementById(area+"-card").classList.remove("glow");
    }
  }
}

function updateChoice (choice) {
  if (choice > 0 && choice < 5) {
    switch (currentChallenge) {
      case 1:
        choices.challenge01 = choice;
        break;
      case 2:
        choices.challenge02 = choice;
        break;
      case 3:
        choices.challenge03 = choice;
        break;
      case 4:
        choices.challenge04 = choice;
        break;
      case 5:
        choices.challenge05 = choice;
        break;
      default:
        console.log("updateChoice: Invalid challenge number.");
        return;
        break;
    }
    hideCurrentPopup();
    showPopup("popupFeedback0"+choice);
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

/*INTERFACE CONTROL */
function userAction (input) {
/* Primary user action handler. Checks for type of input as some are currently inline pasing strings.
   Depending on action, triggers/toggles CSS clases or styles to effect 3D movement. */
    var cube = document.querySelector('#scene1');
    var orientation = cube.classList[1];
    var afssDoor = document.querySelector('#afssDoor01');
    var uAction = "";

    if (typeof(input)==='object') {
      if(input.type="click"){
        uAction = input.path[0].dataset.targetDir;
      }
    }
    //if input is from onclick, not listener
    else if (typeof(input)==='string') {
        uAction = input;
    }
  if (uAction !== "") {
    //Primary Orientations
    if (orientation=="face-front") {
      if(uAction === "ArrowLeft") {
        updateOrientation("face-left");
      }
      else if (uAction === "ArrowRight"){
        updateOrientation("face-right");
      }
    }
    else if (orientation=="face-left"){
      if(uAction === "ArrowLeft") {
        updateOrientation("face-lBack");
      }
      else if (uAction === "ArrowRight"){
        updateOrientation("face-front");
      }
    }
    else if (orientation=="face-lBack"){
      cube.addEventListener("transitionend",switchOrientation);
      if(uAction === "ArrowLeft") {
        updateOrientation("face-lRight");
      }
      else if (uAction === "ArrowRight"){
        updateOrientation("face-left");
      }
    }
    else if (orientation=="face-right"){
      if(uAction === "ArrowLeft") {
        updateOrientation("face-front");
      }
      else if (uAction === "ArrowRight"){
        updateOrientation("face-rBack");
      }
    }
    else if (orientation=="face-rBack"){
      cube.addEventListener("transitionend",switchOrientation);
      if(uAction === "ArrowLeft") {
        updateOrientation("face-right");
      }
      else if (uAction === "ArrowRight"){
        updateOrientation("face-rLeft");
      }
    }
    else if (orientation=="face-equipment"){
      if(uAction === "ArrowLeft") {}
      else if (uAction === "ArrowRight"){}
    }
    else if (orientation=="face-resources"){
      if(uAction === "ArrowLeft") {}
      else if (uAction === "ArrowRight"){}
    }
    else if (orientation=="face-computer"){
      if(uAction === "ArrowLeft") {
        updateOrientation("face-forms");
      }
      else if (uAction === "ArrowRight"){}
    }
    else if (orientation=="face-forms"){
      if(uAction === "ArrowLeft") {}
      else if (uAction === "ArrowRight"){
        updateOrientation("face-computer");
      }
    }
    if(uAction.search("face-")==0){
      // If returning to the main area from one of the focus areas
      if(uAction == "face-front"||uAction == "face-right"||uAction == "face-left"){
        updateOrientation(uAction);
        document.getElementById("cards").style.visibility="visible";
        document.getElementById("backButton").style.opacity="0";
        if (uAction=="face-front" && document.getElementById("afssDoor01").classList.contains("afssDoor-open")){
          document.getElementById("afssDoor01").classList.remove("afssDoor-open");
        }
      }
      else {
        document.getElementById("backButton").dataset.targetDir = cube.classList[1];
        updateOrientation(uAction);
        document.getElementById("cards").style.visibility="hidden";
        document.getElementById("backButton").style.opacity=1;
        if(uAction=="face-equipment") {
          currentPopup = "popupOption03"
          afssDoor.classList.add("afssDoor-open");
          afssDoor.addEventListener("transitionend",transitionPopup);
          
          cube.addEventListener("transitionend",transitionPopup);
        }
        if(uAction=="face-computer") {
          currentPopup = "popupOption01"
          cube.addEventListener("transitionend",transitionPopup);
        }
        if(uAction=="face-forms") {
          currentPopup = "popupOption02"
          cube.addEventListener("transitionend",transitionPopup);
        }
        if(uAction=="face-resources") {
          currentPopup = "popupOption04"
          cube.addEventListener("transitionend",transitionPopup);
        }
      }
    }
  }
}

function updateOrientation(newOrientation) {
  var cube = document.querySelector('#scene1');
  console.log(newOrientation);
  cube.classList.remove(findInList(cube.classList,"face-"));
  cube.classList.add(newOrientation);
  if(newOrientation == "face-front"||newOrientation == "face-right"||newOrientation == "face-left"){
    console.log("face-mains");
    document.getElementById("cards").style.visibility="visible";
    document.getElementById("backButton").style.opacity="0";
    if (newOrientation=="face-front" && document.getElementById("afssDoor01").classList.contains("afssDoor-open")){
      document.getElementById("afssDoor01").classList.remove("afssDoor-open");
    }
  }
}

function switchOrientation(e) {
  //Sneaky. Resolves the continuous rotation issue by disabling transitions during a quick orientation reset.
  var cube = document.querySelector('#scene1');
  var orientation = cube.classList[1];

  if (orientation=="face-lRight"){
    cube.classList.add("notransition");
    cube.classList.remove("face-lRight");
    cube.classList.add("face-right");
    cube.offsetHeight;
    cube.classList.remove("notransition");
    }
  if (orientation=="face-rLeft"){
    cube.classList.add("notransition");
    cube.classList.remove("face-rLeft");
    cube.classList.add("face-left");
    cube.offsetHeight;
    cube.classList.remove("notransition");
    }
}

function transitionPopup(event) {
  var cube = document.querySelector('#scene1');
  if (event.propertyName=="transform"){
    showPopup(currentPopup);
    cube.removeEventListener("transitionend",transitionPopup);
  }
}

/*CONTENT */
function updateContentView(content) {
  //contentCollection[content]=1;
  updateMessages();
}

function updateMessages() {
  if (contentCollection.resources==1) {
    $("#message")[0].innerHTML="<b>Next Step:</b><br>Review the forms in the document cabinet on the table to the right.</span>";
  }
  else if (contentCollection.resources==1 && contentCollection.forms==1) {
    $("#message")[0].innerHTML="<b>Next Step:</b><br>Review the presentation on the computer screen to the right.</span>";
  }
  else if (contentCollection.resources==1 && contentCollection.forms==1 && contentCollection.computer==1) {
    $("#message")[0].innerHTML="<b>Next Step:</b><br>Great Job! You've completed the training content. You may review some more, or start the scenario.</span>";
  }
}

function loadContent (contentId, contentLoc, targetId, fileName, css) {
  /* Load content from local folder directory to target element ID */
  var newElementCode = $('<div id="'+contentId+'" class="loaded">');
  var myFileName = fileName;
  var styleName = "";
  
  if (myFileName=="index"){
    styleName = "style";
  }
  
  newElementCode.load(contentLoc + myFileName + ".html");
  
  $('#'+targetId).append(newElementCode);

  if(css) {
    $("head").append('<link rel="stylesheet" href="' + contentLoc + styleName+'.css" />');
  }
}

function removeContent(targetId) {
  document.getElementById(targetId).remove();
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
  //var plugCode1 = $('<div id="plug01" class="c3dContainer">');
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
  //plugCode1.load(baseUrl+"models/plug/plugDom.html");
  afssBodyCode1.load(baseUrl+"models/afssBody/afssBodyDom.html");
  afssDoorCode1.load(baseUrl+"models/afssDoor/afssDoorDom.html");
  afssStandCode1.load(baseUrl+"models/afssStand/afssStandDom.html");
  afssStandCode2.load(baseUrl+"models/afssStand/afssStandDom.html");
  cubeHeart1.load(baseUrl+"models/cubeHeart/cubeHeartDom.html");
  cubeHeart2.load(baseUrl+"models/cubeHeart/cubeHeartDom.html");
  cubeHeart3.load(baseUrl+"models/cubeHeart/cubeHeartDom.html");
  manualSm1.load(baseUrl+"models/manualSm/manualSmDom.html");
  $("#scene1").append(tableCode1,tableCode2,docCabCode,flLightCode1,flLightCode2,flLightCode3,monitorCode1,afssBodyCode1,afssDoorCode1,afssStandCode1,afssStandCode2);
  $("#health").append(cubeHeart1,cubeHeart2,cubeHeart3);
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/table/tableStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/documentCabinet/docCabStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/flLight/flLightStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/monitor/monitorStyle.css" />');
  //$("head").append('<link rel="stylesheet" href="'+baseUrl+'models/plug/plugStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/afssBody/afssBodyStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/afssDoor/afssDoorStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/afssStand/afssStandStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/cubeHeart/cubeHeartStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/manualSm/manualSmStyle.css" />');
}

/* Inline click funcions, need to set up with listeners */
function showPopup (popupId) {
  document.getElementById(popupId).style.display="flex";
  currentPopup = document.getElementById(popupId);
}

function hidePopup (popupId) {
    document.getElementById(popupId).style.display="none";
  currentPopup = "";
}
function hideCurrentPopup () {
    currentPopup.style.display="none";
  currentPopup = "";
}
function browserCheck() {
  // Uses computed style to detect browser. If browser if Moz, blocks interaction with popup.
  
  var prefix = (Array.prototype.slice
    .call(window.getComputedStyle(document.documentElement, ""))
    .join("") 
    .match(/-(moz|webkit|ms)-/))[1];

  if (prefix == "moz") {
    document.getElementById("browser-error").style.display="flex";
  }
}

function findInList (list, term, exact) {
  // searches array items for search term. If exact search, returns true if exact term is found. If not exact, returns any matching items in list.
  var results = "";
  var resultsArr = [];
    
  list.forEach(item => {
    if(exact){
      if(item==term){results = item;}
      else {results=false;}
    }
    else {
      if(item.search(term)>=0){
        if(results=="") {
          results = item;
        }
        else {
          if(resultsArr==""){
            resultsArr.push(results);
          }
          resultsArr.push(item);
        }
      }
    }
  })
  return results;
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