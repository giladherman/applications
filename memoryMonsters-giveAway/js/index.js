var audioWin = new Audio('sound/win.mp3');
var replayCount = 0;

//Play Audio button's function
function playAudio() {
    var play = prompt('Are you sure (type: yes or no)?');
    
    //yes - play the audio
    if (play == 'yes' || play == 'Yes' || play == 'YES') {
        replayCount++; //counts how many times audio has played
        audioWin.play();

        if (replayCount == 1) {
            alert('This is the first time the audio is playing');
         }
        else {
            alert('The audio replayed ' + replayCount + ' times');
        }
    }
    
    //no - don't play the audio
    else if (play == 'no' || play == 'No' || play == 'NO') {
            alert('Ok not playing');
        }
    else {
            alert('Improper input');
            playAudio(); //retry getting input
   }
}
