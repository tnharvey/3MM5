/* TO DO
- Add load service to check for loaded items, show load icon/animation, until items load. Currently finding occassional 404(-ish) errors on loaded items with slower servers
*/

window.onload = function () {
  let viewCards = document.getElementsByClassName("popup3d");
  let viewCardsArr = Array.prototype.slice.call(viewCards);

  viewCardsArr.forEach(function (item) {
    item.addEventListener("click", userAction);
  });
  //$("#cancelStart")[0].addEventListener("click",userAction);

  browserCheck();

  loadContent(
    popups.intro.id,
    popups.intro.loc,
    popups.intro.target,
    popups.intro.fName,
    true
  );
  showPopup(popups.intro.target);

  window.addEventListener(
    "message",
    (event) => {
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
    },
    false
  );

  //document.getElementById("backButton").addEventListener("click",userAction);
  loadModels();
};

// Used when working from different server, doesn't always work that well
const baseUrl = "";
//global vars
var currentChallenge = 1;
var currentPopup = "";
var currentModal = "";
var currentOrientation = "face-right";
var score = 5;
var resets = 0;
var started = 0;

// Data Objects
const activeAreas = {
  challenge01: {
    resources: 0,
    forms: 1,
    computer: 1,
    equipment: 1
  },
  challenge02: {
    resources: 0,
    forms: 1,
    computer: 1,
    equipment: 1
  },
  challenge03: {
    resources: 0,
    forms: 1,
    computer: 1,
    equipment: 1
  },
  challenge04: {
    resources: 1,
    forms: 0,
    computer: 1,
    equipment: 1
  },
  challenge05: {
    resources: 0,
    forms: 0,
    computer: 0,
    equipment: 0
  }
};
var currentStep = {
  challenge01: 1,
  challenge02: 3,
  challenge03: 5,
  challenge04: 11,
  challenge05: 13
};
var choices = {
  challenge01: 0,
  challenge02: 0,
  challenge03: 0,
  challenge04: 0,
  challenge05: 0
};
var allChoices = {};
var choiceTypes = {
  quickRepair: 0,
  process: 0
};
const answers = {
  challenge01: 1,
  challenge02: 1,
  challenge03: 2,
  challenge04: 4,
  challenge05: 4
};
const termAnswers = {
  challenge01: 2,
  challenge02: 3,
  challenge03: 3,
  challenge04: 0,
  challenge05: 3
};
const feedbackMessages = {
  part01: {
    a1b1:
      "<h2>Feedback</h2><p><span class='left'>These are both excellent decisions, however remember that, if you don't review the work request in GCSS-A first, this can cause issues with the documentation of the work order.</span></p>",
    a1b2:
      "<h2>Feedback</h2><p><span class='left'>Excellent decision to review the work request.</span><br /><span class='left'>Remember that you should conduct a visual inspection as well as calculate the MEL before processing the device.</span></p>",
    a1b3:
      "<h2>Feedback</h2><p><span class='left'>Great decision to review the work request in GCSS-A.</span><br /><span class='left'>Remember that you should calculate the MEL and conduct a visual inspection before procesing the device for repair.</span><br /><span class='left'>By skipping these steps, you could have issues down the line when getting the repair paid for, as well as missing documentation.</span></p>",
    a2:
      "<h2>Feedback</h2><p><span class='left'>Hold your horses.</span><br /><span class='left'>Remember to follow the process because, if you send the device off without completing a visual inspection or determining the MEL, you could cost your unit and the Army a lot of money down the line.</span></p>",
    a3b1:
      "<h2>Feedback</h2><p><span class='left'>These are both excellent decisions.</span><br /><span class='left'>However, if you don't review the work request in GCSS-A first, this can cause issues with the documentation of the work order.</span></p>",
    a3b2:
      "<h2>Feedback</h2><p><span class='left'>It is important to conduct the visual inspection and the MEL. You may not necessarily need DA form 2404 if you have access to GCSS-A.</span><br /><span class='left'>By not reviewing the work request first in GCSS-A, there could be problems down the line with the documentation of the repair.</span></p>",
    a3b3:
      "<h2>Feedback</h2><p><span class='left'>It is important to conduct a visual inspection of the device, however, before you send the device off for repair, remember to review the work request in GCSS-A.</span><br /><span class='left'>By not having a look at the work order it could cause issues down the line when documenting the repair.</span></p>"
  },
  part02: {
    a1b1:
      "<h2>Feedback</h2><p><span class='left'>Excellent decision to document the device.</span><br /><span class='left'>However, before you approve the release of the device, you must conduct a function check.</span><br /><span class='left'>Also, remember that every part of the work request should be entered in GCSS-A.</span></p>",
    a1b3:
      "<h2>Feedback</h2><p><span class='left'>Wait just a second.</span><br /><span class='left'>It is great that you were able to document the device in GCSS-A, however, remember that you should conduct a function check before releasing the device.</span><br /><span class='left'>This is important to do because there could still be potential issues with the device that could cost lives.</span></p>",
    a1b4:
      "<h2>Feedback</h2><p><span class='left'>Excellent decision to document the device and return it back to the customer after conducting a function check.</span><br /><span class='left'>Also, remember that every part of the work request should be entered in GCSS-A.</span></p>",
    a2b1:
      "<h2>Feedback</h2><p><span class='left'>Great call to enter the paperwork in GCSS-A and to send the device off for repair.</span><br /><span class='left'>Don't forget to conduct a function check before releasing the device back to the customer.</span><br /><span class='left'>Without conducting the function check, you could potentially send back a device that is not functioning correctly, which could malfunction while in the field (and cost a life!).</span></p>",
    a2b3:
      "<h2>Feedback</h2><p><span class='left'>Great call to enter the paperwork into GCSS-A and to send the device off for repair.</span><br /><span class='left'>Remember to conduct a function check before releasing the device back to the customer.</span></p>",
    a2b4:
      "<h2>Feedback</h2><p><span class='left'>Great call to enter the paperwork in GCSS-A and to send the device off for repair.</span><br /><span class='left'>Fantastic choice to conduct a function check using the manufacturer's manual.</span></p>",
    a3:
      "<h2>Feedback</h2><p><span class='left'>If you send the device immediately off for repair without ensuring that the paperwork is entered in GCSS-A, you could have issues when the device is returned for not following the SOP.</span><br /><span class='left'>Remember that you manage the repair process and not necessarily conducting the repair.</span></p>"
  },
  part03: {
    a1:
      "<h2>Feedback</h2><p><span class='left'>This is definitely not the correct choice, as your job is to ensure that all medical devices are functioning properly.</span></p>",
    a3:
      "<h2>Feedback</h2><p><span class='left'>You should never release a device to the customer if it presents any type of danger.</span></p>",
    a4:
      "<h2>Feedback</h2><p><span class='left'>This is the correct path.</span><br /><span class='left'>Fortunately you were able to borrow the same device from another unit, so PFC Humble will make a full recovery.</span></p>"
  }
};
const debrief = {
  // 1-0 answers incorrect
  1: "<br><span class='left'>Awesome job! PFC Humble looks like he is going to make it after all.</span><br /><span class='left'>It looks like you really know the repair process flow. You're practically an expert now. From initially receiving the work request all the way to returning the device to the customer, you've got it down.</span>",
  // Skipping the process, avoiding GCSS-A, or not using SOP
  2: "<br><span class='left'>PFC Humble was just about to turn, but you saved him just in time.</span><br /><span class='left'>You have a pretty strong understanding of the process, however, there were some points where you wanted to skip ahead. Remember that:</span><ul><li>We have SOPs for a reason. Make sure that you are documenting everything in GCSS-A.</li></ul><span class='left'>Without doing this, you could cost the Army more money,</span><span class='center'><b>and potentially <u>lives</u>.</b></span>",
  // Sending equipment out too early
  3: "<br><span class='left'>Woah! You've got a really good grasp of what needs to happen as you process a work order.</span><br /><span class='left'>Don't forget to:</span><ul><li>Follow every step in the repair process and don't send the device either out for repair or back to the customer without completing the process. </li></ul><span class='left'>Sending the device out without calculating the MEL, entering information in GCSS-A, or giving the device back to the customer before following each step in the process</span><span class='center'>could cost someone their life.</span>",
  // Mix of 2 and 3
  4: "<br><span class='left'>PFC Humble looks drenched in sweat but fortunately still human.</span><span class='left'>You've got a pretty solid understanding of the repair process. There are a few areas that you should be aware of when you are processing a device for repair. Don't forget to:</span><ul><li>Follow the SOP<li></li>Document everything in GCSS-A<li></li>The higher unit shouldn't send the device back to the customer without conducting a function check.</li></ul>"
};
const messages = {
  1: "<br><span>What is the first step in the equipment repair process, once you've received a request? Look around the room, pay attention to the areas with a glowing card.</span>",
  2: "<br><span>You need to be timely, economical, and professional. What will help you process the equipment this way?</span>",
  3: "<br><span>You're able to see that the costs are not going to exceed the MEL. What now?</span>",
  4: "<br><span>You have received the equipment back. What do you do now?</span>",
  5: "<br><span>There are still a few deficiencies with the equipment. What should you do?</span>"
};
const messages02 = {
  1: "<br><span>All work requests should be reviewed first in GCSS-A. You can't send the repair off as it is above the 10/20 level.</span>",
  2: "<br><span>The next step in the process is to determine the MEL and to conduct a visual inspection of the device.</span>",
  3: "<br><span>Once you have entered all of the paperwork in GCSS-A, then you can send the device off to the next level for repair.</span>",
  4: "<br><span>Once you receive the device back, then you should conduct a function check before returning the device back to the customer.</span>",
  5: "<br><span>You should conduct another function check and repair the device or refer it to the next level. Once this is resolved, then you can release the device to the customer.</span>"
};
const popups = {
  chal: {
    loc: "popups/challenges/challenge0",
    id: "challenge0",
    target: "popupChallenge",
    fName: "challenge0"
  },
  opt: {
    loc: "popups/challenges/challenge0",
    id: "option0",
    target: "popupOption0",
    fName: "option0"
  },
  fdbk: {
    loc: "popups/challenges/challenge0",
    id: "option0",
    target: "popupFeedback0",
    fName: "option0"
  },
  intro: {
    loc: "popups/intro/",
    id: "intro",
    target: "popupIntro",
    fName: "index"
  },
  introVid: {
    loc: "popups/introVid/",
    id: "introVid",
    target: "popupIntroVid",
    fName: "index"
  },
  gameOverS: {
    loc: "popups/gameOverSuccess/",
    id: "gameOverSuccess",
    target: "popupGameOver01",
    fName: "index"
  },
  gameOverF: {
    loc: "popups/gameOverFail/",
    id: "gameOverFail",
    target: "popupGameOver02",
    fName: "index"
  }
};
const orientations = {
  right: {
    return: ""
  },
  left: {
    return: ""
  },
  front: {
    return: ""
  },
  back: {
    return: ""
  },
  rBack: {
    return: ""
  },
  lBack: {
    return: ""
  },
  rLeft: {
    return: ""
  },
  lRight: {
    return: ""
  },
  equipment: {
    return: "face-front"
  },
  computer: {
    return: "face-right"
  },
  forms: {
    return: "face-right"
  },
  resources: {
    return: "face-left"
  }
};
var heartsState = {
  cubeHeart01: {
    topState: "",
    childState: ""
  },
  cubeHeart02: {
    topState: "",
    childState: ""
  },
  cubeHeart03: {
    topState: "",
    childState: ""
  }
};

// Ref to main scene
var cube = "";

/* Scenarios */
function startScenario() {
  hideCurrentPopup();
  removeContent(popups.intro.id);

  if (started == 0) {
    cube = document.getElementById("scene1");
    updateHealth();
    // initiate any starting sequence
    updateScenario();
  }

  started = 1;
}

/*function relaunchIntro() {
  loadContent (popups.intro.id,popups.intro.loc,popups.intro.target,popups.intro.fName,true);
  hideCurrentPopup();
  showPopup("popupIntro");
}*/

function updateScenario() {
  var cards = document.getElementsByClassName("popup3d");

  if (currentChallenge > 1) {
    removeContent(popups.chal.id + (currentChallenge - 1));

    for (var i = 1; i <= 4; i++) {
      removeContent(popups.opt.id + i);
      //removeContent(popups.fdbk.id+i);
    }
  }
  loadContent(
    popups.chal.id + currentChallenge,
    popups.chal.loc + currentChallenge + "/",
    popups.chal.target,
    popups.chal.fName + currentChallenge
  );

  for (var i = 1; i <= 4; i++) {
    loadContent(
      popups.opt.id + i,
      popups.opt.loc + currentChallenge + "/",
      popups.opt.target + i,
      popups.opt.fName + i
    );
    loadContent(
      popups.fdbk.id + i,
      popups.fdbk.loc + currentChallenge + "/",
      popups.fdbk.target + i,
      popups.fdbk.fName + i + "FB"
    );
  }
  if (currentChallenge == 1 && resets == 0) {
    loadContent(
      popups.gameOverS.id,
      popups.gameOverS.loc,
      popups.gameOverS.target,
      popups.gameOverS.fName
    );
    loadContent(
      popups.gameOverF.id,
      popups.gameOverF.loc,
      popups.gameOverF.target,
      popups.gameOverF.fName
    );
    // delay setting event listener, refactor to listen for video load
    setTimeout(() => {
      document
        .querySelector(
          "#" + popups.gameOverF.id + " .loadedPContainer .slide01 video"
        )
        .addEventListener(
          "ended",
          function (e) {
            document.querySelector(
              "#" +
                popups.gameOverF.id +
                " .loadedPContainer .slide01 .slideBtn"
            ).style.opacity = 1;
          },
          false
        );
      document
        .querySelector(
          "#" + popups.gameOverS.id + " .loadedPContainer .slide01 video"
        )
        .addEventListener(
          "ended",
          function (e) {
            document.querySelector(
              "#" +
                popups.gameOverS.id +
                " .loadedPContainer .slide01 .slideBtn"
            ).style.opacity = 1;
          },
          false
        );
    }, 1000);
    loadContent(
      popups.introVid.id,
      popups.introVid.loc,
      popups.introVid.target,
      popups.introVid.fName
    );
  }

  updateMessages();
  if (currentChallenge > 1 && currentPopup != "") {
    hideCurrentPopup();
  }
  cube.addEventListener("transitionend", showPopup(popups.chal.target));
  updateCards();
  updateProcessMap();
}

function updateCards() {
  var chal = "challenge0" + currentChallenge;
  for (var area in activeAreas[chal]) {
    if (activeAreas[chal][area] == 1) {
      document.getElementById(area + "-card").classList.add("glow");
    } else if (activeAreas[chal][area] == 0) {
      document.getElementById(area + "-card").classList.remove("glow");
    }
  }
}

function updateProcessMap() {
  if (currentChallenge > 1) {
    $(
      ".pmap-icon" + currentStep["challenge0" + (currentChallenge - 1)] + " img"
    )[0].classList.remove("currentStep");
  }
  $(
    ".pmap-icon" + currentStep["challenge0" + currentChallenge] + " img"
  )[0].classList.add("currentStep");
}

function updateChoice(choice) {
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
    choiceCategory(choice);
  }
}

function checkAnswer(challenge) {
  //scoring
  if (choices["challenge0" + challenge] == answers["challenge0" + challenge]) {
  } else {
    score = score - 1;
  }
  updateHealth();
  //logic
  if (
    choices["challenge0" + challenge] == termAnswers["challenge0" + challenge]
  ) {
    if (challenge == 1) {
      document.getElementById("failResults").innerHTML =
        feedbackMessages.part01.a2;
    } else if (challenge == 2) {
      document.getElementById("failResults").innerHTML =
        feedbackMessages.part01.a1b3;
    } else if (challenge == 3) {
      document.getElementById("failResults").innerHTML =
        feedbackMessages.part02.a3;
    } else if (challenge == 5) {
      document.getElementById("failResults").innerHTML =
        feedbackMessages.part03.a4;
    }

    hideCurrentPopup();
    showPopup(popups.gameOverF.target);
    $(
      "#" + popups.gameOverF.id + " .loadedPContainer .slide01 video"
    )[0].play();
  } else if (challenge == 5 && score >= 3) {
    hideCurrentPopup();
    // debrief logic
    if ((score) => 4) {
      document.getElementById("successResults").innerHTML = debrief[1];
    } else {
      if (choiceTypes.process > 0 && choiceTypes.quickRepair == 0) {
        document.getElementById("successResults").innerHTML = debrief[2];
      } else if (choiceTypes.process == 0 && choiceTypes.quickRepair > 0) {
        document.getElementById("successResults").innerHTML = debrief[3];
      } else if (choiceTypes.process > 0 && choiceTypes.quickRepair > 0) {
        document.getElementById("successResults").innerHTML = debrief[4];
      }
    }
    showPopup(popups.gameOverS.target);
    $(
      "#" + popups.gameOverS.id + " .loadedPContainer .slide01 video"
    )[0].play();
  } else if ((challenge == 5 && score < 3) || score < 3) {
    if (choiceTypes.process > 0 && choiceTypes.quickRepair == 0) {
      document.getElementById("failResults").innerHTML = debrief[2];
    } else if (choiceTypes.process == 0 && choiceTypes.quickRepair > 0) {
      document.getElementById("failResults").innerHTML = debrief[3];
    } else if (choiceTypes.process > 0 && choiceTypes.quickRepair > 0) {
      document.getElementById("failResults").innerHTML = debrief[4];
    }
    hideCurrentPopup();
    showPopup(popups.gameOverF.target);
    $(
      "#" + popups.gameOverF.id + " .loadedPContainer .slide01 video"
    )[0].play();
  } else {
    hideCurrentPopup();
    loadFeedback();
  }
}

function choiceCategory(choice) {
  if (
    (currentChallenge == 1 && choice == 3) ||
    (currentChallenge == 2 && choice == 2) ||
    (currentChallenge == 5 && (choice == 1 || choice == 3))
  ) {
    choiceTypes.process = choiceTypes.process + 1;
  }
  if (
    (currentChallenge == 3 && choice == 1) ||
    (currentChallenge == 4 && (choice == 1 || choice == 3))
  ) {
    choiceTypes.process = choiceTypes.quickRepair + 1;
  }
}

function resetScenario() {
  removeContent("challenge0" + currentChallenge);
  removeContent("option01");
  removeContent("option02");
  removeContent("option03");
  removeContent("option04");

  loadContent(
    popups.intro.id,
    popups.intro.loc,
    popups.intro.target,
    popups.intro.fName,
    true
  );

  resets = resets + 1;
  started = 0;
  score = 5;
  currentChallenge = 1;
  allChoices["attempt0" + (resets - 1)] = choices;
  choices = {
    challenge01: 0,
    challenge02: 0,
    challenge03: 0,
    challenge04: 0,
    challenge05: 0
  };
  hideCurrentPopup();
  showPopup("popupIntro");
  updateOrientation("face-right");
  updateHealth();
}

function endScenario() {
  parent.postMessage("scenario complete", "*");
  console.log("iframe: Scenario Complete.");
}

function updateHealth() {
  var heart01 = document.getElementById("cubeHeart01");
  var heart02 = document.getElementById("cubeHeart02");
  var heart03 = document.getElementById("cubeHeart03");

  switch (score) {
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

/*INTERFACE and ORIENTATION CONTROL */

function userAction(input) {
  /* Primary user action handler. Checks for type of input as some are currently inline pasing strings.
   Depending on action, triggers/toggles CSS clases or styles to effect 3D movement. */
  //var cube = document.querySelector('#scene1');
  var orientation = cube.classList[1];
  var afssDoor = document.querySelector("#afssDoor01");
  var uAction = "";

  if (typeof input === "object") {
    if ((input.type = "click")) {
      uAction = input.currentTarget.dataset.targetDir;
    }
  }
  //if input is from onclick, not listener
  else if (typeof input === "string") {
    uAction = input;
  }
  if (uAction !== "") {
    // Controls filtered for Orientations first, then user action
    if (orientation == "face-front") {
      if (uAction === "ArrowLeft") {
        updateOrientation("face-left");
      } else if (uAction === "ArrowRight") {
        updateOrientation("face-right");
      }
    } else if (orientation == "face-left") {
      if (uAction === "ArrowLeft") {
        updateOrientation("face-lBack");
      } else if (uAction === "ArrowRight") {
        updateOrientation("face-front");
      }
    } else if (orientation == "face-lBack") {
      cube.addEventListener("transitionend", switchOrientation); //accounts for end of 360 rotation
      if (uAction === "ArrowLeft") {
        updateOrientation("face-lRight");
      } else if (uAction === "ArrowRight") {
        updateOrientation("face-left");
      }
    } else if (orientation == "face-right") {
      if (uAction === "ArrowLeft") {
        updateOrientation("face-front");
      } else if (uAction === "ArrowRight") {
        updateOrientation("face-rBack");
      }
    } else if (orientation == "face-rBack") {
      cube.addEventListener("transitionend", switchOrientation); //accounts for end of 360 rotation
      if (uAction === "ArrowLeft") {
        updateOrientation("face-right");
      } else if (uAction === "ArrowRight") {
        updateOrientation("face-rLeft");
      }
    }
    // Primary logic for focus area returns
    else if (orientation == "face-equipment") {
    } else if (orientation == "face-resources") {
    } else if (orientation == "face-computer") {
    } else if (orientation == "face-forms") {
    }
    if (uAction.search("face-") == 0) {
      // If returning to the main area from one of the focus areas
      if (
        uAction == "face-front" ||
        uAction == "face-right" ||
        uAction == "face-left"
      ) {
        hideCurrentPopup();
        updateOrientation(uAction);
        $("#cards")[0].style.visibility = "visible";
        //document.getElementById("backButton").style.opacity="0";
        if (
          uAction == "face-front" &&
          $("#afssDoor01")[0].classList.contains("afssDoor-open")
        ) {
          $("#afssDoor01")[0].classList.remove("afssDoor-open");
        }
      } else {
        //document.getElementById("backButton").dataset.targetDir = cube.classList[1];
        updateOrientation(uAction);
        document.getElementById("cards").style.visibility = "hidden";
        //document.getElementById("backButton").style.opacity=1;
        if (uAction == "face-equipment") {
          currentPopup = "popupOption03";
          //afssDoor.classList.add("afssDoor-open");
          //afssDoor.addEventListener("transitionend", transitionPopup);
          cube.addEventListener("transitionend", transitionPopup);
        }
        if (uAction == "face-computer") {
          currentPopup = "popupOption01";
          cube.addEventListener("transitionend", transitionPopup);
        }
        if (uAction == "face-forms") {
          currentPopup = "popupOption02";
          cube.addEventListener("transitionend", transitionPopup);
        }
        if (uAction == "face-resources") {
          toggleBook("#manualSm01");
          currentPopup = "popupOption04";
          cube.addEventListener("transitionend", transitionPopup);
        }
      }
    }
  }
}

function updateOrientation(newOrientation) {
  //var cube = document.querySelector('#scene1');
  cube.classList.remove(findInList(cube.classList, "face-"));
  cube.classList.add(newOrientation);
  if (
    newOrientation == "face-front" ||
    newOrientation == "face-right" ||
    newOrientation == "face-left"
  ) {
    document.getElementById("cards").style.visibility = "visible";
    /*if (
      newOrientation == "face-front" &&
      $("#afssDoor01")[0].classList.contains("afssDoor-open")
    ) {
      $("#afssDoor01")[0].classList.remove("afssDoor-open");
    }*/
    if (
      currentOrientation == "face-resources" &&
      newOrientation == "face-left"
    ) {
      toggleBook("#manualSm01");
    }
  }
  currentOrientation = newOrientation;
}

function switchOrientation(e) {
  //Sneaky. Resolves the continuous rotation issue by disabling transitions during a quick orientation reset.
  //var cube = document.querySelector('#scene1');
  var orientation = cube.classList[1];

  if (orientation == "face-lRight") {
    cube.classList.add("notransition");
    cube.classList.remove("face-lRight");
    cube.classList.add("face-right");
    cube.offsetHeight;
    cube.classList.remove("notransition");
  }
  if (orientation == "face-rLeft") {
    cube.classList.add("notransition");
    cube.classList.remove("face-rLeft");
    cube.classList.add("face-left");
    cube.offsetHeight;
    cube.classList.remove("notransition");
  }
}

function transitionPopup(event) {
  //var cube = document.querySelector('#scene1');
  if (event.propertyName == "transform") {
    showPopup(currentPopup);
    cube.removeEventListener("transitionend", transitionPopup);
  }
}

/*CONTENT */
function updateMessages() {
  if (resets >= 2) {
    $("#messageLabel")[0].innerHTML =
      "<b>Challenge " + currentChallenge + " of 5</b>";
    $("#message")[0].innerHTML = messages02[currentChallenge];
  } else {
    $("#messageLabel")[0].innerHTML =
      "<b>Challenge " + currentChallenge + " of 5</b>";
    $("#message")[0].innerHTML = messages[currentChallenge];
  }
}

function loadFeedback() {
  // loads customized feedback in the #feedbackText div based on user choices
  var feedback = document.getElementById("feedbackText");
  var tempOr = currentOrientation.substr(currentOrientation.search("-") + 1);
  if (orientations[tempOr].return == "") {
    updateOrientation(currentOrientation);
  } else {
    updateOrientation(orientations[tempOr].return);
  }

  if (currentChallenge == 2) {
    feedback.innerHTML =
      feedbackMessages.part01[
        "a" + choices.challenge01 + "b" + choices.challenge02
      ];
    showPopup("popupFeedback");
  } else if (currentChallenge == 4) {
    feedback.innerHTML =
      feedbackMessages.part02[
        "a" + choices.challenge03 + "b" + choices.challenge04
      ];
    showPopup("popupFeedback");
  } else if (currentChallenge == 5) {
    feedback.innerHTML = feedbackMessages.part03["a" + choices.challenge05];
    showPopup("popupFeedback");
  } else {
    currentChallenge = currentChallenge + 1;
    updateScenario();
  }
}

function loadResults() {
  // loads customized results in the #results div based on user choices
  var results = document.getElementById("results");
  results.innerHTML = "Results";
}

function loadContent(contentId, contentLoc, targetId, fileName, css) {
  /* Load content from local folder directory to target element ID */
  var newElementCode = $('<div id="' + contentId + '" class="loaded">');
  var myFileName = fileName;
  var styleName = "";

  if (myFileName == "index") {
    styleName = "style";
  }
  newElementCode.load(contentLoc + myFileName + ".html");
  $("#" + targetId).append(newElementCode);

  if (css) {
    $("head").append(
      '<link rel="stylesheet" href="' + contentLoc + styleName + '.css" />'
    );
  }
}

function removeContent(targetId) {
  document.getElementById(targetId).remove();
}

function loadModels(modelsJson) {
  /* takes a JSON model parsed from XML manifest of models and folder locations, loads those models into the HTML document, and adds initial transform data if none is present in main stylesheet */

  var tableCode1 = $('<div id="table01" class="c3dContainer">');
  var tableCode2 = $('<div id="table02" class="c3dContainer">');
  var tableCode3 = $('<div id="table03" class="c3dContainer">');
  var docCabCode = $('<div id="docCab01" class="c3dContainer">');
  var flLightCode1 = $('<div id="flLight01" class="c3dContainer">');
  var flLightCode2 = $('<div id="flLight02" class="c3dContainer">');
  var flLightCode3 = $('<div id="flLight03" class="c3dContainer">');
  var monitorCode1 = $('<div id="monitor01" class="c3dContainer">');
  //var plugCode1 = $('<div id="plug01" class="c3dContainer">');
  var fieldXRay1 = $('<div id="fieldXRay01" class="c3dContainer">');
  var toolkit1 = $('<div id="toolkit01" class="c3dContainer">');
  var cubeHeart1 = $(
    '<div id="cubeHeart01" class="c3dContainer healthHeart healthy">'
  );
  var cubeHeart2 = $(
    '<div id="cubeHeart02" class="c3dContainer healthHeart healthy">'
  );
  var cubeHeart3 = $(
    '<div id="cubeHeart03" class="c3dContainer healthHeart healthy">'
  );
  var manualSm1 = $('<div id="manualSm01" class="c3dContainer moveBackward">');
  var keyboardSimp1 = $('<div id="keyboardSimp01" class="c3dContainer">');
  var laptop1 = $('<div id="laptop01" class="c3dContainer">');
  var mouse1 = $('<div id="mouse01" class="c3dContainer">');
  var coffeeCup1 = $('<div id="coffeeCup01" class="c3dContainer">');

  tableCode1.load(baseUrl + "models/table/tableDom.html");
  tableCode2.load(baseUrl + "models/table/tableDom.html");
  tableCode3.load(baseUrl + "models/table/tableDom.html");
  docCabCode.load(baseUrl + "models/documentCabinet/docCabDom.html");
  monitorCode1.load(baseUrl + "models/monitor/monitorDom.html");
  //plugCode1.load(baseUrl+"models/plug/plugDom.html");
  fieldXRay1.load(baseUrl + "models/fieldXRay/fieldXRayDom.html");
  toolkit1.load(baseUrl + "models/toolkit/toolkitDom.html");
  cubeHeart1.load(baseUrl + "models/cubeHeart/cubeHeartDom.html");
  cubeHeart2.load(baseUrl + "models/cubeHeart/cubeHeartDom.html");
  cubeHeart3.load(baseUrl + "models/cubeHeart/cubeHeartDom.html");
  manualSm1.load(baseUrl + "models/manualSm/manualSmDom.html");
  keyboardSimp1.load(baseUrl + "models/keyboardSimp/keyboardSimpDom.html");
  laptop1.load(baseUrl + "models/laptop/laptopDom.html");
  mouse1.load(baseUrl + "models/mouse/mouseDom.html");
  coffeeCup1.load(baseUrl + "models/coffeeCup/coffeeCupDom.html");
  $("#scene1").append(
    tableCode1,
    tableCode2,
    tableCode3,
    docCabCode,
    monitorCode1,
    fieldXRay1,
    toolkit1,
    manualSm1,
    keyboardSimp1,
    laptop1,
    mouse1,
    coffeeCup1
  );
  $("#health").append(cubeHeart1, cubeHeart2, cubeHeart3);
  $("head").append(
    '<link rel="stylesheet" href="' +
      baseUrl +
      'models/table/tableStyle.css" />'
  );
  $("head").append(
    '<link rel="stylesheet" href="' +
      baseUrl +
      'models/documentCabinet/docCabStyle.css" />'
  );
  $("head").append(
    '<link rel="stylesheet" href="' +
      baseUrl +
      'models/monitor/monitorStyle.css" />'
  );
  //$("head").append('<link rel="stylesheet" href="'+baseUrl+'models/plug/plugStyle.css" />');
  $("head").append(
    '<link rel="stylesheet" href="' +
      baseUrl +
      'models/fieldXRay/fieldXRayStyle.css" />'
  );
  $("head").append(
    '<link rel="stylesheet" href="' +
      baseUrl +
      'models/toolkit/toolkitStyle.css" />'
  );
  $("head").append(
    '<link rel="stylesheet" href="' +
      baseUrl +
      'models/cubeHeart/cubeHeartStyle.css" />'
  );
  $("head").append(
    '<link rel="stylesheet" href="' +
      baseUrl +
      'models/manualSm/manualSmStyle.css" />'
  );
  $("head").append(
    '<link rel="stylesheet" href="' +
      baseUrl +
      'models/keyboardSimp/keyboardSimpStyle.css" />'
  );
  $("head").append(
    '<link rel="stylesheet" href="' +
      baseUrl +
      'models/laptop/laptopStyle.css" />'
  );
  $("head").append(
    '<link rel="stylesheet" href="' +
      baseUrl +
      'models/mouse/mouseStyle.css" />'
  );
  $("head").append(
    '<link rel="stylesheet" href="' +
      baseUrl +
      'models/coffeeCup/coffeeCupStyle.css" />'
  );
}

/* POPUPS and MODALS */
function showPopup(popupId) {
  $("#" + popupId)[0].style.display = "flex";
  checkIsDisplayed(popupId, () => {
    $("#" + popupId)[0].style.opacity = 1;
  });
  currentPopup = $("#" + popupId)[0];
}

function showModal(modalId) {
  $("#" + modalId)[0].style.display = "flex";
  checkIsDisplayed(modalId, () => {
    $("#" + modalId)[0].style.opacity = 1;
  });
  currentModal = $("#" + modalId)[0];
}

function checkIsDisplayed(elemId, funct) {
  if ($("#" + elemId)[0].style.display == "flex") {
    funct();
  } else {
    setTimeout(checkIsDisplayed, 1000);
  }
}

function hidePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
  currentPopup = "";
}

function hideModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  currentModal = "";
}

function hideCurrentPopup() {
  var cPop = currentPopup;
  cPop.style.opacity = 0;
  cPop.addEventListener("transitionend", dispNonePop(cPop));
  currentPopup = "";
}

function dispNonePop(pop) {
  pop.style.display = "none";
  pop.removeEventListener("transitionend", transitionPopup);
}

/* UTILITY */
function browserCheck() {
  // Uses computed style to detect browser. If browser if Moz, blocks interaction with popup.

  var prefix = Array.prototype.slice
    .call(window.getComputedStyle(document.documentElement, ""))
    .join("")
    .match(/-(moz|webkit|ms)-/)[1];

  if (prefix == "moz") {
    document.getElementById("browser-error").style.display = "flex";
  }
}

function findInList(list, term, exact) {
  // searches array items for search term. If exact search, returns true if exact term is found. If not exact, returns any matching items in list.
  var results = "";
  var resultsArr = [];

  list.forEach((item) => {
    if (exact) {
      if (item == term) {
        results = item;
      } else {
        results = false;
      }
    } else {
      if (item.search(term) >= 0) {
        if (results == "") {
          results = item;
        } else {
          if (resultsArr == "") {
            resultsArr.push(results);
          }
          resultsArr.push(item);
        }
      }
    }
  });
  return results;
}

// Animation Functions
function toggleHealth(elemId) {
  var heart = document.getElementById(elemId).childNodes[0];
  //console.log(heart);

  if (heart.childNodes[1].childNodes[1].classList.contains("sick")) {
    for (let i = 1; i < 16; i += 2) {
      for (let j = 1; j < 12; j += 2) {
        heart.childNodes[i].childNodes[j].classList.remove("sick");
        heart.childNodes[i].childNodes[j].classList.add("healthy");
      }
    }
    heartsState[elemId].childState = "healthy";
    heart.parentNode.classList.remove("sick");
    heart.parentNode.classList.add("healthy");
    heartsState[elemId].topState = "healthy";
  } else if (heart.childNodes[1].childNodes[1].classList.contains("healthy")) {
    for (let i = 1; i < 16; i += 2) {
      for (let j = 1; j < 12; j += 2) {
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

function restartAnim(elemId) {
  var heart = document.getElementById(elemId);
  var newHeart = heart.cloneNode(true);
  heart.parentNode.replaceChild(newHeart, heart);
}

function restartAnims() {
  restartAnim("cubeHeart01");
  restartAnim("cubeHeart02");
  restartAnim("cubeHeart03");
}

function toggleBook(targetId) {
  var target = $(targetId)[0];
  if (target.classList.contains("moveBackward")) {
    target.classList.remove("moveBackward");
    target.children[1].classList.remove("closed");
    target.classList.add("moveForward");
    target.children[1].classList.add("opened");
  } else if (target.classList.contains("moveForward")) {
    target.classList.remove("moveForward");
    target.children[1].classList.remove("opened");
    target.classList.add("moveBackward");
    target.children[1].classList.add("closed");
  }
}

/* SLIDE CONTROLS */
function nextSlide01() {
  var targetDiv = $(".loadedPContainer:visible")[0];
  var currentSlide = findInList(targetDiv.classList, "state", false);
  if (currentSlide == "state01") {
    targetDiv.children[0].style.display = "none";
    targetDiv.children[1].style.display = "block";
    targetDiv.classList.remove("state01");
    targetDiv.classList.add("state02");
  } else if (currentSlide == "state02") {
    targetDiv.children[0].style.display = "none";
    targetDiv.children[1].style.display = "none";
    targetDiv.children[2].style.display = "block";
    targetDiv.classList.remove("state02");
    targetDiv.classList.add("state03");
  }
}

function resetSlides() {
  var targetDiv = $(".loadedPContainer:visible")[0];
  var currentSlide = findInList(targetDiv.classList, "state", false).substr(6);

  targetDiv.children[currentSlide - 1].style.display = "none";
  targetDiv.children[0].style.display = "block";
  document.querySelector(
    "#" + popups.gameOverF.id + " .loadedPContainer .slide01 .slideBtn"
  ).style.opacity = 1;
  targetDiv.classList.remove("state0" + currentSlide);
  targetDiv.classList.add("state01");
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
