// Une fois que le HTML ressemble à ce que vous voulez : 
document.addEventListener('DOMContentLoaded', function() {
    let count = 0;
    const buttonClicker = document.querySelector("#button-clicker");
    const buttonReset = document.querySelector("#button-reset");
    const timerDisplay = document.querySelector("#timer");
    const timerSelect = document.querySelector("#timer-select");
    const scoreDisplay = document.querySelector("#score-display"); // Ajout
    let timeLeft;
    let timer; // Pour pouvoir clear l'intervalle depuis n'importe où

    // Mettre à jour l'affichage initial du timer
    timerDisplay.textContent = timerSelect.value;

    // Mise à jour du timer quand on change la valeur
    timerSelect.addEventListener('change', function() {
        timerDisplay.textContent = this.value;
    });

    function updateScore() {
        scoreDisplay.textContent = `Score : ${count}`;
    }

    function resetGame() {
        // Arrêter le timer s'il est en cours
        if (timer) {
            clearInterval(timer);
        }
        
        // Réinitialiser les variables
        count = 0;
        timeLeft = parseInt(timerSelect.value);
        updateScore(); // Mise à jour du score
        
        // Réactiver les éléments
        buttonClicker.disabled = false;
        timerSelect.disabled = false;
        
        // Réinitialiser l'affichage
        timerDisplay.textContent = timerSelect.value;
    }

    function startTimer() {
        timeLeft = parseInt(timerSelect.value);
        timerSelect.disabled = true; // Désactive le select pendant le jeu
        
        timer = setInterval(function() {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                buttonClicker.disabled = true;
                alert(`Temps écoulé ! Score final : ${count} clics`);
                timerSelect.disabled = false; // Réactive le select après la fin du jeu
            }
        }, 1000);
    }

    // Event Listeners
    buttonClicker.addEventListener("click", function() {
        if (count === 0) {
            startTimer();
        }
        count += 1;
        updateScore(); // Mise à jour du score
    });

    buttonReset.addEventListener("click", resetGame);
});
