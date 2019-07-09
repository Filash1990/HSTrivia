let expansionsData;
let expansions = [];
const notExpansions = [
  "Basic",
  "Promo",
  "Hall of Fame",
  "Tavern Brawl",
  "Taverns of Time",
  "Hero Skins",
  "Missions",
  "Credits",
  "System",
  "Debug"
];
const answerInput = document.getElementById("answer");
let receivedAnswers = [];
const showCard = document.getElementById("show-card");
const showDiv = document.getElementById("card");
let count = 0;

// loading data
const cards = new XMLHttpRequest();
cards.onreadystatechange = function() {
  if (this.readyState === 4 && this.status === 200) {
    hideLoader();
    loadData(cards);
  } else if (this.readyState === 4 && this.status !== 200) {
    alert("Server not Responding");
  }
};
cards.open("GET", "https://omgvamp-hearthstone-v1.p.rapidapi.com/cards", true);
cards.setRequestHeader(
  "X-RapidAPI-Host",
  "omgvamp-hearthstone-v1.p.rapidapi.com"
);
cards.setRequestHeader(
  "X-RapidAPI-Key",
  "29423ea1c1mshc4b3fa0fd989a42p1fc85fjsnc36c23b4d104"
);
cards.send();

// after loader
function loadData(cards) {
  expansionsData = JSON.parse(cards.responseText);
  // list expansions
  for (var expansion in expansionsData) {
    if (notExpansions.indexOf(expansion) === -1) {
      expansions.push(expansion);
    }
  }
  console.log(expansions);

  showCard.addEventListener("click", () => cardDisplay()); //card display activation
}

//enterkey event
answerInput.addEventListener("keyup", function() {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("enter").click();
  }
});

document.getElementById("enter").addEventListener("click", checkAnswer);
//check answer

function checkAnswer() {
  const answer = answerInput.value.toLowerCase();
  if (receivedAnswers.includes(answer)) {
    //was before?
    document.getElementById("announce").innerHTML = "Already got this one!";
    flashColor("blue");
  } else {
    const isCorrectAnswer = expansions
      .map(expansion => expansion.toLowerCase())
      .includes(answer);
    isCorrectAnswer ? showCorrectAnswer(answer) : showWrongAnswer();
  }
}

function showWrongAnswer() {
  document.getElementById("announce").innerHTML = "Wrong answer!";
  flashColor("red");
}

//display answer
function showCorrectAnswer(answer) {
  receivedAnswers.push(answer); //add to was before?

  let node = document.createElement("li");
  let nodeText = document.createTextNode(answer);
  node.appendChild(nodeText); //current right answer
  document.getElementById("gotIt").appendChild(node);

  document.getElementById("counter").innerText = receivedAnswers.length;
  count++;

  expansions.splice(
    expansions.map(expansion => expansion.toLowerCase()).indexOf(answer),
    1
  ); //update array
  console.log("still missing", expansions);
  document.getElementById("announce").innerHTML = "That's right!";
  flashColor("green");
}

function cardDisplay() {
  const expansionName =
    expansions[Math.floor(Math.random() * expansions.length)]; // name of a random expansion
  cardsNumber = Math.floor(
    Math.random() * expansionsData[expansionName].length
  ); //number of a random card
  rndmCard = expansionsData[expansionName][cardsNumber].img; // display random card of random missing expansion
  showDiv.src = `${rndmCard}`;
  testImage(rndmCard);
}

function testImage(URL) {
  var tester = new Image();
  tester.onload = imageFound;
  tester.onerror = imageNotFound;
  tester.src = URL;
}

function imageFound() {
  showDiv.style.opacity = "1";
  document.getElementById("announce").innerText = "Image Loaded";
  flashColor("green");
}

function imageNotFound() {
  showDiv.style.opacity = "0";
  document.getElementById("announce").innerText =
    "Sorry, server failed to load image. Try again!";
  flashColor("red");
}

function hideLoader() {
  document.getElementById("loader-container").style.display = "none";
}

function flashColor(color) {
  document.getElementById("announce").style.backgroundColor = color;
  setTimeout(() => {
    document.getElementById("announce").style.backgroundColor = "transparent";
  }, 400);
}
