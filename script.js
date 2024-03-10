let pickedNumber; // to store the chosen difficulty
// main game start
let cards = [];     // array of cards
let couples = [];   // array of couples
let foundCouples; // couples needed to win
let stats = []; // to hold time spent per winned match

let time_of_start;  // for the comparison with a local end time variable to get the total time elapsed
let is_game_started = 'n'   // to check wheter is clicked the leaderboard button while in-match or from start

let leaderboardButtonClickedTime = 0; // Variable to store the timestamp when the leaderboard button is clicked

document.addEventListener('DOMContentLoaded', function () {
    const difficultyRange = document.getElementById('difficultyRange');
    const difficultyValue = document.getElementById('difficultyValue');
    const startButton = document.querySelector('.go'); // Select the start button
    const message = document.getElementById('message'); // Select the message element
    const diff = document.getElementById('d');

    difficultyRange.addEventListener('input', function () {
        difficultyValue.textContent = difficultyRange.value;
        if (difficultyRange.value >= 0 && difficultyRange.value <= 12) {
            diff.style.display = "inline"
            diff.innerHTML = `<p style="color: green;">BEGINNER</p>`
        } else if (difficultyRange.value <= 28) {
            diff.style.display = "inline"
            diff.innerHTML = `<p style="color: orange;">INTERMEDIATE</p>`

        } else if (difficultyRange.value <= 52) {
            diff.style.display = "inline"
            diff.innerHTML = `<p style="color: red;">ADVANCED</p>`

        } else {
            diff.style.display = "none"

        }
        pickedNumber = difficultyRange.value; // Store the picked number in the variable
        // Clear the message
        message.textContent = '';
    });
});

function start() {
    pickedNumber = null;
    document.getElementById('difficultyElement').style.display = "flex"

    document.getElementById("gameField").style.display = "none";
    document.getElementById("displayWin").style.display = "none";

    let difficultyElement = document.getElementById('difficultyElement');

    // Add the "visible" class to trigger the transition
    difficultyElement.classList.add('visible');

    // Reset the range value to default
    document.getElementById("difficultyRange").value = "select";
    difficultyValue.textContent =  "select"
    // disable the play button to prevent issues
    document.getElementById("pl").disabled = true;
}

function restart() {
    // restart the parameters
    is_game_started = 'n'
    document.getElementById("gameField").innerHTML = ""
    couples = [];
    cards = [];
    foundCouples = 0;
    message.textContent = '';
    document.querySelector(".start").style.display = "flex";    // to remove the start images
    document.getElementById("displayWin").style.display = "none"
    document.getElementById("pl").disabled = false; // reset the play buttion
    document.getElementById('d').style.display = 'none' // remove the difficulty text

    let difficultyElement = document.getElementById('difficultyElement');

    // Remove the "visible" class to hide the difficulty picker
    difficultyElement.classList.remove('visible');
}

function play() {
    if (!pickedNumber) {
        // Show a message to the user if no difficulty level is selected
        document.getElementById('message').style.display = "flex"
        document.getElementById('message').textContent = 'Please select a difficulty level first.';
        return; // Prevent further execution
    }

    is_game_started = 'y'
    time_of_start = Date.now()  // to save the time when the match start

    document.getElementById('d').style.display = 'none'
    document.getElementById("gameField").style.display = "flex"
    document.getElementById("gameField").innerHTML = ""
    couples = [];
    cards = [];
    foundCouples = 0;

    document.getElementById("gameField").style.display = "flex"
    document.querySelector(".start").style.display = "none";    // to remove the start images
    document.getElementById("difficultyElement").classList.remove('visible')    // to remove the difficulty range bar

    // populate the array with all the cards
    generate("clubs");
    generate("diamonds");
    generate("hearts");
    generate("spades");

    // populate the array with couples 
    populateCouples(pickedNumber); // Pass the picked number to populateCouples function
}

// function to insert the cards into the array
function generate(text) {
    for (let i = 1; i <= 13; i++) {
        cards.push(`card-${text}-${i}`); 
    }
}

// function to populate the couples 
function populateCouples(pickedNumber) {
    for (let i = 0; i < pickedNumber; i++) {
        let randNum;
        do {
            randNum = Math.floor(Math.random()*52);  // for the amount of cards in the array
        } while (!cards[ randNum ]) // to ensure to pick a number that hasn't yet pulled out

        // now pick two random numbers for the positioning of the couple
        let randPosition1;
        let randPosition2;

        do {
            randPosition1 = Math.floor(Math.random()*(pickedNumber*2));  // the array length is double to host the couples
        } while (couples[ randPosition1 ]) // until positions are occupied
        couples[ randPosition1 ] = cards[ randNum ]; // insert the card chosen to the random position

        do {
            randPosition2 = Math.floor(Math.random()*(pickedNumber*2)); 
        } while (couples[ randPosition2 ]) 
        couples[ randPosition2 ] = cards[ randNum ];

        cards[ randNum ] = null; // remove the card from the array
    }

    // call to the function to place images
    placeImages();
}

// function to place the images on the screen
function placeImages() {
    let gameField = document.getElementById("gameField");   // the game field
    
    for (let i = 0; i < couples.length; i++) {
        gameField.innerHTML += `<img src="carte/card-back4.png" class="${couples[i]}" alt="carta da gioco" width="130px" onclick="see(this)">`
    }
}

let lastCard = null;   // to track the last card flipped
// function to see the card
let active = false; // to prevent the user to see multiple cards at once if clicked

function see(self) {
    // disable the functionalities if the user "multiple-clicks" everywhere
    if (!active) {
        self.src = "carte/"+self.className+".png"

        // check if is not null; another card has been clicked
        if (lastCard) {
            // check if is not the same card
            if (lastCard===self) {
                // do nothing
            } else {
                active = true;
                // check if the other card has the same class (it's of the same type)
                if (lastCard.className==self.className) {
                    setTimeout( function () {   // delay before removing card
                        lastCard.style.visibility = "hidden";
                        self.style.visibility = "hidden";
                        active = false;
                        foundCouples++;
                        lastCard = null; // reset the couple
                        if (foundCouples==couples.length/2) {
                            document.getElementById("gameField").style.display = "none"
                            document.getElementById("displayWin").style.display = "flex"
                            
                            // get the totoal elapsed time of the match
                            let time_of_end = Date.now()
                            let total_elapsed = time_of_end - time_of_start
                            let match_stats = [pickedNumber, total_elapsed-leaderboardButtonClickedTime]
                            stats.push(match_stats)

                            // make again the play button available
                            document.getElementById("pl").disabled = false;

                            is_game_started = 'n';
                        }
                    }, 1200)
                } else {
                    setTimeout( function () {   // just cover again
                        lastCard.src = "carte/card-back4.png";
                        self.src = "carte/card-back4.png";
                        lastCard = null; // reset the couple
                        active = false;
                    }, 1200)
                }
            }
        } else {
            lastCard = self // update the last card clicked
        }   
    }
}
function leaderboard() {
    // check the value of the button
    let button_value = document.getElementById('l').value;

    document.getElementById('difficultyElement').style.display = "none" // ensure the difficulty bar is hidden
    document.getElementById('d').style.display = "none"
    document.getElementById('message').style.display = "none"

    if (button_value === "Leaderboard") {
        if (is_game_started === 'y') {
            // get the total amount of time spent in the leaderboard
            leaderboardButtonClickedTime = Date.now();
        }
        document.getElementById('pl').disabled = true
        document.getElementById('r').disabled = true

        // whether to hide or not the start images
        if (is_game_started === 'n') {
            document.querySelector('.start').style.display = "none";
        }
        // change the button to "resume"
        document.getElementById('l').value = "Resume";

        // hide the game field and win text
        document.getElementById("gameField").style.display = "none";
        document.getElementById("displayWin").style.display = "none";

        let table_area = document.getElementById('leaderboard');
        table_area.style.display = "table";
        let tableHTML = `<table id="leaderboardContainer" style="border: 1px solid black;"> 
            <caption style="font-weight: bold;">Leaderboard</caption>    
            <tr>
                <td>MATCH</td>
                <td>DIFFICULTY</td>
                <td>TIME</td>
            </tr>`; // open the table

        for (let i = 0; i < stats.length; i += 1) {
            let games = i + 1; // Calculate the game number
            let elapsedTime = formatElapsedTime(stats[i][1]); // Format elapsed time
            tableHTML += `<tr>
                <td>${games}</td>
                <td>${stats[i][0]}</td> <!-- Accessing the difficulty level from the stats array -->
                <td>${elapsedTime}</td> <!-- Display formatted elapsed time -->
            </tr>`; // generate the table
        }

        tableHTML += `</table>`; // close the table
        table_area.innerHTML = tableHTML; // Set the HTML content once
    } else {    // resume button
        if (is_game_started === 'y'){
            leaderboardButtonClickedTime = Date.now() - leaderboardButtonClickedTime    // calculate how much time spent in the leaderboard
         }
        document.getElementById('pl').disabled = false
        document.getElementById('r').disabled = false

        if (is_game_started === 'n') {
            document.querySelector('.start').style.display = "flex";
        }
        document.getElementById('l').value = "Leaderboard"; // reset the value of the button
        if (is_game_started === 'y'){
            document.getElementById("gameField").style.display = "flex";
        }
        // hide the leaderboard
        document.getElementById('leaderboard').style.display = "none";
    }
}


// function to display the elapsed time with a human-readable format
function formatElapsedTime(elapsedTime) {
    // Convert elapsed time from milliseconds to seconds
    let totalSeconds = Math.floor(elapsedTime / 1000);

    // Calculate hours, minutes, and seconds
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    // Format the time components into a human-readable string
    let formattedTime = "";
    if (hours > 0) {
        formattedTime += hours + "h ";
    }
    if (minutes > 0) {
        formattedTime += minutes + "m ";
    }
    if (seconds > 0 || formattedTime === "") {
        formattedTime += seconds + "s";
    }

    return formattedTime;
}


