// Click a button or object to earn points so that I can increase my score.
// See my current score during the game so that I know how well I am doing.
// See a countdown timer so that I know how much time is left. setInterval();

// Variables
const initialTime = 5;
let score = 0;
let timeLeft = initialTime;
let gameStarted = false;
let gameEnded = false;
let interval = null;
let starsRunning = false;
let starStartTimeout = null;

// HTML DOM
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const button3 = document.getElementById('button3');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const label1 = document.getElementById('label1');
const input1 = document.getElementById('name');
const nameSection = document.getElementById('nameSection');
const scoreboardSection = document.getElementById('scoreboardSection');
const scoreboard = document.getElementById('scoreboardList');
const message = document.getElementById('message');
const timerCircle = document.getElementById('timerCircle');
const starsLayer = document.getElementById('stars-layer');

// UI Functions & Events
// Här är knappen jag klickar på för att få poäng.
button1.addEventListener('click', () => { // Här ökas poängen för varje klick.
  if (!gameEnded) { // (!gameEnded = om spelet fortfarande är igång).
    increaseScore();
  }

// Här startas spelet och timern går igång.
  if (!gameStarted) {
    startGame();
  }
})

// Här skickas namnet och poängen in när submit-knappen klickas.
button2.addEventListener('click', () => {
  submitHighScore();
})

// Här startas spelet om när restart-knappen klickas.
button3.addEventListener('click', () => {
  restartGame();
})

// Här döljs namnfält, label och submit-knapp tills spelet är slut.
nameSection.style.display = 'none';
scoreboardSection.style.display = 'none';
button3.style.display = 'none';

// Functions
// Här ökas poängen för varje klick.
function increaseScore() {
  score++;   // Här ser jag till att poängen ska ökas en gång per klick.
  scoreDisplay.innerText = score; // Här visas mina poäng just nu.
}

// Här är timern.
function countdown() {
  timeLeft--;   // Här minskas tiden med en sekund i taget.
  timerDisplay.innerText = timeLeft;   // Här syns tiden (uppdaterad) på sidan.
  // Här stoppas spelet när det är 0 sekunder kvar.
  if (timeLeft <= 0) {
    timerDisplay.innerText = 0;
    endGame();
  }
  // TODO: Sida?
}

// Här säger jag vad som ska ske för att starta spelet.
function startGame() {
  // Här sätts nedräkningen igång och körs varje sekund.
  interval = setInterval(countdown,  1000);
  // Här ser jag till att spelet läses som redan startat så att det inte börjar om.
  gameStarted = true; // Här säger jag att spelet ska sättas som startat så att det inte startas flera gånger.
  button1.innerText = "Press"; // Här ändras texten på knappen när spelet startar.
  // Här väntar jag 4 sekunder efter att spelet startat innan stjärnorna börjar blinka.
  starStartTimeout = setTimeout(() => {
    if (!gameEnded) {
      startStarBlinking(); // Här startar stjärnorna när spelet börjar.
    }
  }, 4000);
}

// Här markerar jag spelet som avslutat när tiden är slut.
function endGame() {
  gameEnded = true; // Här sätter jag spelet som avslutat.
  clearInterval(interval); // Här stoppas timern.
  clearTimeout(starStartTimeout); // Här stoppas eventuell väntan på att stjärnorna ska börja blinka.
  starsRunning = false; // Här stoppas blinkande stjärnorna.
  scoreDisplay.innerHTML = `<span class="label">Your final score is </span>
  <span class="score">${score}</span>`

  // Här visas min slutliga poäng när spelet är klart.
  button1.style.display = 'none'; // // Här göms start game-knappen efter att tiden är slut. (disabled = true hade
  // inneburit att knappen syntes men inte skulle gå att klicka på.)
  // Här visas input och submit-knapp så att jag kan spara och skicka in mina poäng och namn.
  nameSection.style.display = 'block'; // Här visas nameSection med namnfält och submit-knapp.
  button3.style.display = 'block'; // Här visas restart-knappen när spelet är slut.
  // TODO: Addera spärr på input.
}

// Här startas spelet om från början.
function restartGame() {
  clearInterval(interval); // Här stoppas eventuell tidigare timer.
  clearTimeout(starStartTimeout); // Här stoppas eventuell väntan på att stjärnorna ska börja blinka.
  starsRunning = false; // Här stoppas blinkande stjärnorna.
  starsLayer.innerHTML = ""; // Här rensas eventuella stjärnor från sidan.

  // Här rensas scoreboarden när spelet startas om.
  scoreboard.innerHTML = "";

  button1.innerText = "Start game"; // Här återställs texten på knappen när spelet startas om.
  score = 0; // Här nollställs poängen.
  timeLeft = initialTime; // Här återställs starttiden.
  gameStarted = false; // Här sätts spelet tillbaka till ej startat.
  gameEnded = false; // Här sätts spelet tillbaka till ej avslutat.
  interval = null; // Här nollställs timer-variabeln.
  starStartTimeout = null; // Här nollställs timeout-variabeln för stjärnstart.

  scoreDisplay.innerText = score; // Här visas startpoängen igen.
  timerDisplay.innerText = timeLeft; // Här visas starttiden igen.
  message.innerText = ""; // Här rensas eventuellt statusmeddelande.
  input1.value = ""; // Här rensas namnfältet.

  button1.style.display = 'block'; // Här visas start game-knappen igen.
  nameSection.style.display = 'none'; // Här döljs nameSection igen tills spelet är slut.
  scoreboardSection.style.display = 'none'; // Här döljs scoreboarden igen när spelet startas om.
  button3.style.display = 'none'; // Här döljs restart-knappen igen.
}

// Här skapar jag en asynkron funktion som gör en POST-request för att skicka in min data till en endpoint och väntar på
// att requesten ska bli klar.
async function submitHighScore() {
  // TODO: Lägg till krav på ifyllt namnfält.
  try { // Här säger jag åt funktionen att försöka köra koden som skickar min POST request till en endpoint.
    const response = await fetch("https://hooks.zapier.com/hooks/catch/8338993/ujs9jj9/", { // Här
      // säger jag åt await fetch: (försök) skicka in min totala poäng.
      method: "POST", // Här säger jag att min data ska skickas (en POST request).
      body: JSON.stringify({ // Här görs namn och poäng om till JSON innan det skickas.
        name: input1.value,
        score: score
      }),
    });
    console.log(response);
    // Här säger jag att ett meddelande ska visas när man klickat på submit-knappen.
    if (response.ok) { // Här kollar jag om requesten lyckades.
      message.innerText = "Your score is registered!";

      setTimeout(() => {
        getScoreBoardData(); // Här hämtas den aktuella scoreboarden när spelet är slut, efter att min data skickats/Post
        // requesten är klar.
        scoreboardSection.style.display = 'block';
      }, 2000); // väntar 2 sek innan scoreboarden hämtas

    } else { // Om requesten har gått fram men servern svarar med ett fel får man detta svar.
      message.innerText = "Something went wrong, your score is not available.";
    }
  } catch (error) { // Här säger jag att om requesten kraschar/något går fel ska det fångas i catch och ge ett felmeddelande.
    console.error(error);
    message.innerText = "Something went wrong, your score could not be registered."; // Här visas ett meddelande om något
    // gick fel med tex nätverket och requesten inte går igenom.
  }
}

// Här skapar jag en funktion som gör en GET request med fetch för att hämta scoreboarden.
function getScoreBoardData() {
  const url = 'https://script.google.com/macros/s/AKfycbys5aEPMvNCutyhNYYCcQcCjzsi2UtqNspmKyCH-AicJxJbCJMrAoT0LUaYaXhTWA8n/exec';
  // Här sker GET requesten från url:en ovan.
  fetch(url)
    .then(response => {
      console.log('Response object:', response); // Här loggas "svaret" för att kunna debuggas.
      return response.json(); // Här säger jag att svaret ska göras om till JSON (för att kunna användas i JS).
    })
    .then(data => {
      console.log('Scoreboard data:', data); // Här loggas scoreboard-datan.
      scoreboard.innerHTML = ""; // Här rensas den gamla scoreboarden innan den nya skrivs ut.
      data.sort((a, b) => b.score - a.score); // Här sorterar jag listan baserat på högsta poäng först.
      const top10 = data.slice(0, 10); // Här tar jag ut topp 10.
      top10.forEach((player, index) => { // Här loopar jag genom topp 10 och skriver ut dem.
        scoreboard.innerHTML += `
          <li>
            <span class="name">${player.name}</span>
            <span class="score">${player.score}</span>
          </li>
        `;
      });
    })
    .catch(error => {
      console.error('Fetch error:', error); // Här loggas och visas eventuella fel på fetchen.
    });
}

// Här skapar jag en funktion som låter en stjärna blinka till slumpmässigt på sidan.
function createBlinkingStar() {
  const star = document.createElement('div');
  star.classList.add('star-blink');

  // Här slumpas stjärnans storlek.
  const size = Math.random() * 30 + 15;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;

  // Här slumpas positionen på sidan.
  star.style.left = `${Math.random() * window.innerWidth}px`;
  star.style.top = `${Math.random() * window.innerHeight}px`;

  starsLayer.appendChild(star);

  // Här tas stjärnan bort efter att animationen är klar.
  setTimeout(() => {
    star.remove();
  }, 800);
}

// Här skapar jag en funktion som låter stjärnor blinka med slumpmässiga intervall.
function startStarBlinking() {
  starsRunning = true;

  function scheduleNextStar() {
    if (!starsRunning) return; // Här stoppas stjärnorna om spelet är slut
    createBlinkingStar();

    // Här räknas hur långt spelet kommit så att stjärnorna kan blinka oftare ju längre spelet pågår.
    const progress = (initialTime - timeLeft) / initialTime;

    // Här sätts ett maxintervall som blir kortare över tid så att stjärnorna blir fler ju längre spelet pågår.
    const maxDelay = 2000 - (progress * 1400);

    // Här sätts ett minintervall som också blir kortare över tid så att stjärnorna kan blinka snabbare mot slutet.
    const minDelay = 200 - (progress * 100);

    // Här slumpas tiden tills nästa stjärna blinkar.
    const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
    setTimeout(scheduleNextStar, randomDelay);
  }

  scheduleNextStar();
}
