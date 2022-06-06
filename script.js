/* TO DO

1. Update score/health (waiting for feedback from charles)
- Refactor popup system to use array/object and allow for tracking the last popup and close it or close all popups
Might also be able to use an object to load and track all popup info at once and load/unload individual ones
- Refactor to have transition listener on transition between challenges. Maybe refactor to have a function that handles start/stop of listener.
- Refactor to have relevant areas tracked in objects (i.e. all 3d cards have state stored in object and updated)
- Refactor (someday!) to use React for state mgmt, etc. This would interfere with the SCORM/embedability.
*/

window.onload = function(){
  let viewCards = document.getElementsByClassName('popup3d');
  let viewCardsArr = Array.prototype.slice.call(viewCards);
  
  viewCardsArr.forEach(function(item){
    item.addEventListener("click",userAction);
  });
  //$("#cancelStart")[0].addEventListener("click",userAction);

  browserCheck();
  
  loadContent (popups.intro.id,popups.intro.loc,popups.intro.target,popups.intro.fName,true);
  showPopup(popups.intro.target);
  
  window.addEventListener("message", (event) => {
    switch (event.data) {
      case "start":
        startScenario();
        break;
      case "restart":
        resetScenario();
        break;
      case "end":
        break;
    }
  }, false);

  //document.getElementById("backButton").addEventListener("click",userAction);
  loadModels();
}

// Used when working from different server, doesn't always work that well
const baseUrl = "";
//global vars
var currentChallenge = 1;
var currentPopup = "";
var score = 5;
var resets = 0;
var started = 0;

// Data Objects
var activeAreas = {
  challenge01: {
    resources:0,
    forms:1,
    computer:1,
    equipment:1,
  },
  challenge02: {
    resources:0,
    forms:1,
    computer:1,
    equipment:1,
  },
  challenge03: {
    resources:0,
    forms:1,
    computer:1,
    equipment:1,
  },
  challenge04: {
    resources:1,
    forms:0,
    computer:1,
    equipment:1,
  },
  challenge05: {
    resources:0,
    forms:0,
    computer:0,
    equipment:0,
  },
};
var currentStep = {
  challenge01: "",
  challenge02: "",
  challenge03: "",
  challenge04: "",
  challenge05: "",
};
var choices = {
  challenge01:0,
  challenge02:0,
  challenge03:0,
  challenge04:0,
  challenge05:0,
};
var allChoices = {};
var answers = {
  challenge01:1,
  challenge02:1,
  challenge03:2,
  challenge04:4,
  challenge05:1,
};
const messages = {
  1:"<br><span>What is the first step in the equipment repair process once you've received a request? Look around the room, pay attention to the areas with a glowing card.</span>",
  2:"<br><span>You need to be timely, economical, and professional. What will help you process the equipment this way?</span>",
  3:"<br><span>You're able to see that the costs are not going to exceed the MEL. What now?</span>",
  4:"<br><span>You have received the equipment back. What do you do now?</span>",
  5:"<br><span>There are still a few deficiencies with the equipment. What should you do?</span>",
};
const messages02 = {
  1:"<br><span>What is the first step in the equipment repair process once you've received a request? Look around the room, pay attention to the areas with a glowing card.</span>",
  2:"<br><span>You need to be timely, economical, and professional. What will help you process the equipment this way?</span>",
  3:"<br><span>You're able to see that the costs are not going to exceed the MEL. What now?</span>",
  4:"<br><span>You have received the equipment back. What do you do now?</span>",
  5:"<br><span>There are still a few deficiencies with the equipment. What should you do?</span>",
};
var popups = {
  chal: {
    loc: "popups/challenges/challenge0",
    id: "challenge0",
    target: "popupChallenge",
    fName: "challenge0",
  },
  opt: {
    loc: "popups/challenges/challenge0",
    id: "option0",
    target: "popupOption0",
    fName: "option0",
  },
  fdbk: {
    loc: "popups/challenges/challenge0",
    id: "option0",
    target: "popupFeedback0",
    fName: "option0",
  },
  intro: {
    loc: "popups/intro/",
    id: "intro",
    target: "popupIntro",
    fName: "index",
  },
  gameOverS: {
    loc: "popups/gameOverSuccess/",
    id: "gameOverSuccess",
    target: "popupGameOver01",
    fName: "index",
  },
  gameOverF: {
    loc: "popups/gameOverFail/",
    id: "gameOverFail",
    target: "popupGameOver02",
    fName: "index",
  },
};
var heartsState = {
  cubeHeart01: {
    topState: "",
    childState: "",
  },
  cubeHeart02: {
    topState: "",
    childState: "",
  },
  cubeHeart03: {
    topState: "",
    childState: "",
  },
};

// Ref to main scene
var cube = "";

/* Scenarios */
function startScenario() {
  hideCurrentPopup();
  removeContent(popups.intro.id);
  
  if (started == 0) {
    cube = document.getElementById('scene1');
    updateHealth();
    // initiate any starting sequence
    updateScenario();
  }

  started = 1;
}

function relaunchIntro() {
  loadContent (popups.intro.id,popups.intro.loc,popups.intro.target,popups.intro.fName,true);
  hideCurrentPopup();
  showPopup("popupIntro");
}

function updateScenario(){
  var cards = document.getElementsByClassName('popup3d');

  if (currentChallenge > 1) {
    removeContent(popups.chal.id+(currentChallenge-1));
    
    for (var i=1;i<=4;i++) {
      removeContent(popups.opt.id+i);
      removeContent(popups.fdbk.id+i);
    }
  }
   loadContent(popups.chal.id+currentChallenge,popups.chal.loc+currentChallenge+"/",popups.chal.target,popups.chal.fName+currentChallenge);
  
  for (var i = 1;i <= 4;i++) {
    loadContent(popups.opt.id+i,popups.opt.loc + currentChallenge + "/",popups.opt.target+i,popups.opt.fName+i);
    loadContent(popups.fdbk.id+i,popups.fdbk.loc + currentChallenge + "/",popups.fdbk.target+i,popups.fdbk.fName + i + "FB")
  }
  if (currentChallenge==1 && resets == 0) {
    loadContent(popups.gameOverS.id,popups.gameOverS.loc,popups.gameOverS.target,popups.gameOverS.fName);
    loadContent(popups.gameOverF.id,popups.gameOverF.loc,popups.gameOverF.target,popups.gameOverF.fName);
    }
  
  updateMessages();
  if (currentChallenge > 1) {
    hideCurrentPopup();
  }
  cube.addEventListener("transitionend",showPopup(popups.chal.target));
  updateCards();
}

function updateCards () {
  var chal = "challenge0"+currentChallenge;
  for (var area in activeAreas[chal]) {
    if(activeAreas[chal][area]==1) {
      document.getElementById(area+"-card").classList.add("glow");
    }
    else if(activeAreas[chal][area]==0){
      document.getElementById(area+"-card").classList.remove("glow");
    }
  }
}

function updateProcessMap () {
  var chal = "challenge0"+currentChallenge;
  
  for (var area in activeAreas[chal]) {
    if(activeAreas[chal][area]==1) {
      document.getElementById(area+"-card").classList.add("glow");
    }
    else if(activeAreas[chal][area]==0){
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
    checkAnswer(currentChallenge);
  }
}

function checkAnswer(challenge) {
  if(choices["challenge0"+challenge] == answers["challenge0"+challenge]){
    //console.log("correct");
  }
  else {
    score = score - 1;
    //console.log("Incorrect");
  }
  updateHealth();
  if (challenge == 5 && score >= 3) {
    hideCurrentPopup();
    showPopup(popups.gameOverS.target);
  }
  else if ((challenge == 5 && score < 3) || (score < 3)) {
    hideCurrentPopup();
    showPopup(popups.gameOverF.target);
  }
  else {
    hideCurrentPopup();
    showPopup(popups.fdbk.target+choices["challenge0"+currentChallenge]);
  }
}

function resetScenario(){
  removeContent("challenge0"+currentChallenge);
  removeContent("option01");
  removeContent("option02");
  removeContent("option03");
  removeContent("feedback01");
  removeContent("feedback02");
  removeContent("feedback03");
  loadContent (popups.intro.id,popups.intro.loc,popups.intro.target,popups.intro.fName,true);
  
  resets = resets + 1;
  started = 0
  score = 5;
  currentChallenge = 1;
  allChoices["attempt0"+(resets-1)]=choices;
  choices = {
    challenge01:0,
    challenge02:0,
    challenge03:0,
    challenge04:0,
    challenge05:0,
  };
  hideCurrentPopup();
  showPopup("popupIntro");
  updateOrientation("face-right");
  updateHealth();  
}

function loadResults(){
  // loads customized results in the #results div based on user choices
  var results = document.getElementById("results");
  results.innerHTML = "Results";
}

function endScenario(){
  parent.postMessage("scenario complete","*");
  window.alert("Scenario Complete. You've helped to save PFC Bosky!")
}

function updateHealth() {
  var heart01 = document.getElementById("cubeHeart01");
  var heart02 = document.getElementById("cubeHeart02");
  var heart03 = document.getElementById("cubeHeart03");
  
  switch(score) {
  // Cases 0-2 no longer valid;
    case 2:
      if (heart01.classList.contains("healthy")) {
        toggleHealth(heart01.id);
        
      }
      if (heart02.classList.contains("healthy")) {
        toggleHealth(heart02.id);
      }
      if (heart03.classList.contains("healthy")) {
        toggleHealth(heart03.id);
      }
      break;
    case 3:
      if (heart01.classList.contains("sick")) {
        toggleHealth(heart01.id);
      }
      if (heart02.classList.contains("healthy")) {
        toggleHealth(heart02.id);
      }
      if (heart03.classList.contains("healthy")) {
        toggleHealth(heart03.id);
      }
      break;
    case 4:
      if (heart01.classList.contains("sick")) {
        toggleHealth(heart01.id);
      }
      if (heart02.classList.contains("sick")) {
        toggleHealth(heart02.id);
      }
      if (heart03.classList.contains("healthy")) {
        toggleHealth(heart03.id);
      }
      break;
    case 5:
      if (heart01.classList.contains("sick")) {
        toggleHealth(heart01.id);
      }
      if (heart02.classList.contains("sick")) {
        toggleHealth(heart02.id);
      }
      if (heart03.classList.contains("sick")) {
        toggleHealth(heart03.id);
      }
      break;
  }
}

/*INTERFACE CONTROL */
function userAction (input) {
/* Primary user action handler. Checks for type of input as some are currently inline pasing strings.
   Depending on action, triggers/toggles CSS clases or styles to effect 3D movement. */
    //var cube = document.querySelector('#scene1');
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
    // Controls filtered for Orientations first, then user action
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
      cube.addEventListener("transitionend",switchOrientation); //accounts for end of 360 rotation
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
      cube.addEventListener("transitionend",switchOrientation); //accounts for end of 360 rotation
      if(uAction === "ArrowLeft") {
        updateOrientation("face-right");
      }
      else if (uAction === "ArrowRight"){
        updateOrientation("face-rLeft");
      }
    }
    // Primary logic for focus area returns
    else if (orientation=="face-equipment"){}
    else if (orientation=="face-resources"){}
    else if (orientation=="face-computer"){}
    else if (orientation=="face-forms"){}
    if(uAction.search("face-")==0){
      // If returning to the main area from one of the focus areas
      if(uAction == "face-front"||uAction == "face-right"||uAction == "face-left"){
        hideCurrentPopup();
        updateOrientation(uAction);
        $("#cards")[0].style.visibility="visible";
        //document.getElementById("backButton").style.opacity="0";
        if (uAction=="face-front" && $("#afssDoor01")[0].classList.contains("afssDoor-open")){
          $("#afssDoor01")[0].classList.remove("afssDoor-open");
        }
        if (uAction=="face-left"){
          toggleBook("#manualSm01");
        }
      }
      else {
        //document.getElementById("backButton").dataset.targetDir = cube.classList[1];
        updateOrientation(uAction);
        document.getElementById("cards").style.visibility="hidden";
        //document.getElementById("backButton").style.opacity=1;
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
          toggleBook("#manualSm01");
          currentPopup = "popupOption04"
          cube.addEventListener("transitionend",transitionPopup);
        }
      }
    }
  }
}

function updateOrientation(newOrientation) {
  //var cube = document.querySelector('#scene1');
  cube.classList.remove(findInList(cube.classList,"face-"));
  cube.classList.add(newOrientation);
  if(newOrientation == "face-front"||newOrientation == "face-right"||newOrientation == "face-left"){
    document.getElementById("cards").style.visibility="visible";
    //document.getElementById("backButton").style.opacity="0";
    if (newOrientation=="face-front" && document.getElementById("afssDoor01").classList.contains("afssDoor-open")){
      document.getElementById("afssDoor01").classList.remove("afssDoor-open");
    }
  }
}

function switchOrientation(e) {
  //Sneaky. Resolves the continuous rotation issue by disabling transitions during a quick orientation reset.
  //var cube = document.querySelector('#scene1');
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
  //var cube = document.querySelector('#scene1');
  if (event.propertyName=="transform"){
    showPopup(currentPopup);
    cube.removeEventListener("transitionend",transitionPopup);
  }
}

/*CONTENT */
function updateMessages() {
  $("#messageLabel")[0].innerHTML = "<b>Challenge " + currentChallenge + " of 5</b>";
  $("#message")[0].innerHTML = messages[currentChallenge];
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
  var cubeHeart1 = $('<div id="cubeHeart01" class="c3dContainer healthHeart healthy">');
  var cubeHeart2 = $('<div id="cubeHeart02" class="c3dContainer healthHeart healthy">');
  var cubeHeart3 = $('<div id="cubeHeart03" class="c3dContainer healthHeart healthy">');
  var manualSm1 = $('<div id="manualSm01" class="c3dContainer moveBackward">');
  var keyboardSimp1 = $('<div id="keyboardSimp01" class="c3dContainer">');
  var laptop1 = $('<div id="laptop01" class="c3dContainer">');
  var mouse1 = $('<div id="mouse01" class="c3dContainer">');
  var coffeeCup1 = $('<div id="coffeeCup01" class="c3dContainer">');

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
  keyboardSimp1.load(baseUrl+"models/keyboardSimp/keyboardSimpDom.html");
  laptop1.load(baseUrl+"models/laptop/laptopDom.html");
  mouse1.load(baseUrl+"models/mouse/mouseDom.html");
  coffeeCup1.load(baseUrl+"models/coffeeCup/coffeeCupDom.html");
  $("#scene1").append(tableCode1,tableCode2,docCabCode,flLightCode1,flLightCode2,flLightCode3,monitorCode1,afssBodyCode1,afssDoorCode1,afssStandCode1,afssStandCode2,manualSm1,keyboardSimp1,laptop1,mouse1,coffeeCup1);
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
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/keyboardSimp/keyboardSimpStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/laptop/laptopStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/mouse/mouseStyle.css" />');
  $("head").append('<link rel="stylesheet" href="'+baseUrl+'models/coffeeCup/coffeeCupStyle.css" />');
}

/* Inline click funcions, need to set up with listeners */
function showPopup (popupId) {
  $("#"+popupId)[0].style.display="flex";
  checkIsDisplayed(popupId,()=>{$("#"+popupId)[0].style.opacity=1;})
  currentPopup = $("#"+popupId)[0];
}

function checkIsDisplayed(elemId,funct) {
    if ($("#" + elemId)[0].style.display == "flex") {
        funct();
    } else {
        setTimeout(checkIsDisplayed, 500);
    }
}

function hidePopup (popupId) {
  document.getElementById(popupId).style.display="none";
  currentPopup = "";
}

function hideCurrentPopup () {
  var cPop = currentPopup;
  cPop.style.opacity=0;
  cPop.addEventListener("transitionend",dispNonePop(cPop));
  currentPopup = "";
}

function dispNonePop (pop) {
  pop.style.display="none";
  pop.removeEventListener("transitionend",transitionPopup);
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

// Animation Functions
function toggleHealth(elemId) {
var heart = document.getElementById(elemId).childNodes[0];
//console.log(heart);

if(heart.childNodes[1].childNodes[1].classList.contains("sick")){
  for (let i=1; i<16; i+=2) {
    for (let j=1; j<12; j+=2) {
      heart.childNodes[i].childNodes[j].classList.remove("sick");
      heart.childNodes[i].childNodes[j].classList.add("healthy");
    }
  }
  heartsState[elemId].childState = "healthy";
  heart.parentNode.classList.remove("sick");
  heart.parentNode.classList.add("healthy");
  heartsState[elemId].topState = "healthy";
}
else if (heart.childNodes[1].childNodes[1].classList.contains("healthy")) {
  for (let i=1; i<16; i+=2) {
    for (let j=1; j<12; j+=2) {
      heart.childNodes[i].childNodes[j].classList.remove("healthy");
      heart.childNodes[i].childNodes[j].classList.add("sick");
    }
  }
  heartsState[elemId].childState = "sick";
  heart.parentNode.classList.remove("healthy");
  heart.parentNode.classList.add("sick");
  heartsState[elemId].topState = "sick";
}
restartAnim(elemId);
}

function restartAnim (elemId) {
  var heart = document.getElementById(elemId);
  var newHeart = heart.cloneNode(true);
  heart.parentNode.replaceChild(newHeart, heart);
}

function restartAnims () {
  restartAnim("cubeHeart01");
  restartAnim("cubeHeart02");
  restartAnim("cubeHeart03");
}

function toggleBook (targetId) {
  var target = $(targetId)[0];
  if(target.classList.contains("moveBackward")) {
      target.classList.remove("moveBackward");
      target.children[1].classList.remove("closed");
      target.classList.add("moveForward");
      target.children[1].classList.add("opened");
  }
  else if (target.classList.contains("moveForward")) {
      target.classList.remove("moveForward");
      target.children[1].classList.remove("opened");
      target.classList.add("moveBackward");
      target.children[1].classList.add("closed");
  }
}


/* SLIDE CONTROLS */
  function nextSlide01() {
    var currentSlide = findInList($(".loadedPContainer:visible")[0].classList,"state",false);
    if(currentSlide=="state01"){
      $(".slide01")[0].style.display = "none";
      $(".slide02")[0].style.display = "block";
      $(".loadedPContainer")[0].classList.remove("state01");
      $(".loadedPContainer")[0].classList.add("state02");
    }
    else if(currentSlide=="state02"){
      $(".slide01")[0].style.display = "none";
      $(".slide02")[0].style.display = "none";
      $(".slide03")[0].style.display = "block";
      $(".loadedPContainer")[0].classList.remove("state02");
      $(".loadedPContainer")[0].classList.add("state03");
    }
  }

/* MEL Calc Functions */
    

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