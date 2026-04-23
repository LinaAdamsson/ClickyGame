// Click a button or object to earn points so that I can increase my score.
// See my current score during the game so that I know how well I am doing.
// See a countdown timer so that I know how much time is left. setInterval();

// Variables
let score = 0;
let timeLeft = 5;
let gameStarted = false;
let gameEnded = false;
let interval = null;

// HTML DOM
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const label1 = document.getElementById('label1');
const input1 = document.getElementById('name');
const nameSection = document.getElementById('nameSection');
const scoreboardSection = document.getElementById('scoreboardSection');
const scoreboard = document.getElementById('scoreboardList');
const message = document.getElementById('message');
const timerCircle = document.getElementById('timerCircle');

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

// Här döljs namnfält, label och submit-knapp tills spelet är slut.
nameSection.style.display = 'none';
scoreboardSection.style.display = 'none';

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
}

// Här markerar jag spelet som avslutat när tiden är slut.
function endGame() {
  gameEnded = true; // Här sätter jag spelet som avslutat.
  clearInterval(interval); // Här stoppas timern.
  scoreDisplay.innerHTML = `<span class="label">Your final score is </span>
  <span class="score">${score}</span>`

  // Här visas min slutliga poäng när spelet är klart.
  button1.style.display = 'none'; // // Här göms click me-knappen efter att tiden är slut. (disabled = true hade
  // inneburit att knappen syntes men inte skulle gå att klicka på.)
  // Här visas input och submit-knapp så att jag kan spara och skicka in mina poäng och namn.
  nameSection.style.display = 'block'; // Här visas nameSection med namnfält och submit-knapp.
  // TODO: Addera spärr på input.
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
