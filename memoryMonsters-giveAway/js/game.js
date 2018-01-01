// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null; // used to recognize first card flipped
var flippedCouplesCount = 0; // counts how many cards have been flipped in order to recognize a winner
var startTime; // gets starting time to calculate total game time
var finishTime; // gets finish time to calculate total game time
var firstCard = true; // used to check if the card clicked is the first card in order to start game timer
var user1; // stors user name in order to welcome and compare to new user
var isProcessing = false; // used to managed proccessing time so avoid bugs such as flipping 3 cards

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 3;

// Load an audio file
var audioWin = new Audio('sound/win.mp3');
var audioRight = new Audio('sound/right.mp3');
var audioWrong = new Audio('sound/wrong.mp3');

// This function get's user name when game is loaded
function getUser () {
    
    //present best time from local memory when loading
    bestTime = localStorage.getItem('bestTime');
    if (bestTime!=null) {
        document.getElementById("bestTime").innerHTML = 'Best Time = ' + bestTime;
    } 

    user1 = localStorage.getItem('user1'); // check if user name is stored in local memory

    if (user1 == null) { //first game - no user name stored in local memory
        userName = prompt('Enter user name:');
        localStorage.setItem('user1', userName);
        user1 = localStorage.getItem('user1');
                      }
    else { //not first game - get new user's name from local memory
        userName = localStorage.getItem('user1');
        }
    
    //welcome display
    alert('Welcome ' + userName);
    document.getElementById("currentUser").innerHTML = 'Current User Name: ' + userName;
}

// This function is called when switch user button is clicked
function switchUser () {
    userName = prompt('Enter user name:');

    if (userName!=user1) { //compare to current user's name
    localStorage.setItem('user1',userName);
    user1 = localStorage.getItem('user1');
    alert('Welcome ' + userName);
    document.getElementById("currentUser").innerHTML = 'Current User Name: ' + userName;
    }
}

// This function is called whenever the user click a card
function cardClicked(elCard) {    

    // start game timer on first click
    if (firstCard == true) {
        startTime = Date.now();
        firstCard = false; //penetrate first card alert var
    }

    // If the user clicked an already flipped card - do nothing and return from the function
    if (elCard.classList.contains('flipped')) {
        return;
    }

    if (isProcessing == false) // check card hasn't been clicked while processing - to prevent flipping 3 cards
    {
        isProcessing = true; // we are in process until we leave the function

            // Flip it
        elCard.classList.add('flipped');

        // This is a first card, only keep it in the global variable
        if (elPreviousCard === null) {
            elPreviousCard = elCard;
            isProcessing = false; 
        } else {
            // get the data-card attribute's value from both cards
            var card1 = elPreviousCard.getAttribute('data-card');
            var card2 = elCard.getAttribute('data-card');

            // No match, schedule to flip them back in 1 second
            if (card1 !== card2){
                setTimeout(function () {
                    elCard.classList.remove('flipped');
                    elPreviousCard.classList.remove('flipped');
                    elPreviousCard = null;
                    audioWrong.play();
                    isProcessing = false;
                }, 1000)

            } else {
                // Yes! a match!
                flippedCouplesCount++;
                elPreviousCard = null;
                audioRight.play();
                
                // All cards flipped!
                if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                    audioWin.play();
                    toggle_visibility('replay'); //show replay button
                    finishTime = Date.now (); // get fish time to calculate total game time
                    var totalTime = finishTime - startTime;
                    
                    // check if total time is best time
                    var bestTime = localStorage.getItem('bestTime');
                    if (bestTime == null || totalTime < bestTime) {
                        localStorage.setItem('bestTime', totalTime);
                    }     
                    // display best time
                    bestTime = localStorage.getItem('bestTime');
                    document.getElementById("bestTime").innerHTML = 'Best Time = ' + bestTime;
                }
            isProcessing = false;
            }
        }
    }
   

}    

// This function is used to make the replay button appear to disappear
function toggle_visibility(id) {
    var e = document.getElementById(id);
    if(e.style.display == 'block')
       e.style.display = 'none';
    else
       e.style.display = 'block';
}

// This function restarst the game - it is activated by the replay button 
 function reload () {
    //reset variables
    elPreviousCard = null;
    flippedCouplesCount = 0;
    firstCard = true;
    toggle_visibility('replay'); // hide replay button

        // flip all the cards
        var divs = document.querySelectorAll('div');
        for (var i = 0; i < divs.length; ++i) {
        divs[i].classList.remove('flipped');
        }
        
        // shuffle the cards
        var board = document.querySelector('.board');
        for (var i = board.children.length; i >= 0; i--) {
        board.appendChild(board.children[Math.random() * i | 0]);
        }
}