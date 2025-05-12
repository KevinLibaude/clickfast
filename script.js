// État du jeu
const gameState = {
    count: 0,
    timeLeft: 0,
    timer: null,
    isGameStarted: false
};
const player = {
    username : "",
    score : 0
}

let username = document.getElementById('pseudo');

// Fonction pour mettre à jour le score
function updateScore(scoreDisplay, count) {
    scoreDisplay.textContent = `Score : ${count}`;
}

function createPlayer(username){
    player.username = username
    player.score = 0;
    return player;
}

// Fonction pour réinitialiser le jeu
function resetGame(state, elements) {
    if (state.timer) {
        clearInterval(state.timer);
    }
    
    state.count = 0;
    state.timeLeft = parseInt(elements.timerSelect.value);
    state.isGameStarted = false;
    
    elements.buttonClicker.disabled = false;
    elements.timerSelect.disabled = false;
    elements.timerDisplay.textContent = state.timeLeft;
    
    updateScore(elements.scoreDisplay, state.count);
}

// Fonction pour démarrer le timer
function startTimer(state, elements) {
    state.timeLeft = parseInt(elements.timerSelect.value);
    elements.timerSelect.disabled = true;
    state.isGameStarted = true;
    
    state.timer = setInterval(() => {
        state.timeLeft--;
        elements.timerDisplay.textContent = state.timeLeft;
        
        if (state.timeLeft <= 0) {
            clearInterval(state.timer);
            elements.buttonClicker.disabled = true;
            alert(`Temps écoulé ! Score final : ${state.count} clics`);
            elements.timerSelect.disabled = false;
        }
    }, 1000);
}

// Gestionnaire de clic
function handleClick(state, elements) {
    if (!state.isGameStarted) {
        startTimer(state, elements);
    }
    state.count += 1;
    updateScore(elements.scoreDisplay, state.count);
}

function handleValidateButtonClick(elements) {
    const username = elements.pseudoInput.value.trim();
    
    if (!username) {
        alert('Veuillez entrer un pseudo');
        return;
    }

    try {
        const player = createPlayer(username);
        elements.pseudoInput.disabled = true;
        elements.buttonPseudo.disabled = true;
        elements.buttonClicker.disabled = false;  // Active le bouton de jeu
        return player;
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur lors de la création du joueur');
    }
}

// Gestionnaire de changement de timer
function handleTimerChange(event, elements) {
    elements.timerDisplay.textContent = event.target.value;
}

// Initialisation du jeu
function initGame(state) {
    const elements = {
        buttonClicker: document.querySelector("#button-clicker"),
        buttonReset: document.querySelector("#button-reset"),
        timerDisplay: document.querySelector("#timer"),
        timerSelect: document.querySelector("#timer-select"),
        scoreDisplay: document.querySelector("#score-display"),
        pseudoInput: document.querySelector("#pseudo"),
        buttonPseudo: document.querySelector("#button-pseudo") 
    };

    // Vérification des éléments
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Élément ${key} non trouvé`);
            return null;
        }
    }

    elements.timerDisplay.textContent = elements.timerSelect.value;
    
    elements.timerSelect.addEventListener('change', (e) => handleTimerChange(e, elements));
    elements.buttonClicker.addEventListener("click", () => handleClick(state, elements));
    elements.buttonReset.addEventListener("click", () => resetGame(state, elements));
    
    elements.buttonPseudo.addEventListener("click", () => handleValidateButtonClick(elements));

    createPlayer(username);

    return elements;
}

// Point d'entrée principal
document.addEventListener('DOMContentLoaded', () => {
    initGame(gameState);
});

module.exports = {
    gameState,
    updateScore,
    resetGame,
    startTimer,
    handleClick,
    handleTimerChange,
    initGame,
    createPlayer
}