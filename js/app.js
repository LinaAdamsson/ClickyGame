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
const scoreboard = document.getElementById('scoreboard');
const message = document.getElementById('message');

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
input1.style.display = 'none';
label1.style.display = 'none';
button2.style.display = 'none';
scoreboard.style.display = 'none';

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
  clearInterval(interval);   // Här stoppas timern.
  scoreDisplay.innerText = `Final score: ${score}`;   // Här visas min slutliga poäng när spelet är klart.
  button1.style.display = 'none'; // // Här göms click me-knappen efter att tiden är slut. (disabled = true hade
  // inneburit att knappen syntes men inte skulle gå att klicka på.)
  // Här visas input och submit-knapp så att jag kan spara och skicka in mina poäng och namn.
  input1.style.display = 'block'; // Här blir namnfältet synligt.
  label1.style.display = 'block'; // Här visas texten "Name (3 to 16 characters):"
  button2.style.display = 'block'; // Här visas submit-knappen.
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
    if (response.ok) { // Här kollar jag om requesten lyckades ...
      message.innerText = "Dina poäng har registrerats!";
    } else { // ... eller inte (requesten har gått fram men servern svarar med ett fel).
      message.innerText = "Något gick tyvärr fel, dina poäng kan inte visas.";
    }
    getScoreBoardData(); // Här hämtas den aktuella scoreboarden när spelet är slut, efter att min data skickats/Post
    // requesten är klar.
    scoreboard.style.display = 'block';
  } catch (error) { // Här säger jag att om requesten kraschar/något går fel ska det fångas i catch och ge ett felmeddelande.
  console.error(error);
  message.innerText = "Något gick tyvärr fel, dina poäng kunde inte registreras."; // Här visas ett meddelande om något
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
      // TODO: Sortera listan baserat på poäng innan loopen körs så index användas för att visa placering.
      data.forEach((player, index) => { // Här säger jag att funktionen ska loopa genom alla spelare i scoreboarden.
        scoreboard.innerHTML += `<p>${player.name}: ${player.score}</p>`; // Här görs varje namn och poäng synlig.
      });
    })
    .catch(error => {
      console.error('Fetch error:', error); // Här loggas och visas eventuella fel på fetchen.
    });
}
