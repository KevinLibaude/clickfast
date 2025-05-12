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

// Fonction pour afficher les scores
async function displayScores() {
    const url = "https://672e1217229a881691eed80f.mockapi.io/scores";
    const tableBody = document.querySelector("#scores-table-body");
    const template = document.querySelector("#score-row");

    try {
        const response = await fetch(url);
        const scores = await response.json();
        
        // Tri des scores du plus élevé au plus bas
        scores.sort((a, b) => b.score - a.score);
        
        // Vide le tableau avant de le remplir
        while (tableBody.lastElementChild !== template) {
            tableBody.removeChild(tableBody.lastElementChild);
        }

        // Prendre les 10 meilleurs scores
        scores.slice(0, 10).forEach(score => {
            const clone = template.content.cloneNode(true);
            
            // Remplissage des données
            clone.querySelector(".player-name").textContent = score.username;
            clone.querySelector(".player-score").textContent = score.score;
            clone.querySelector(".player-date").textContent = new Date(score.createdAt).toLocaleDateString();
            clone.querySelector(".player-avatar").src = score.avatar;
            
            tableBody.appendChild(clone);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des scores:", error);
    }
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
    elements.buttonPseudo.addEventListener("click", () => handleClick(elements));

    createPlayer(username);

    // Affichage initial des scores
    displayScores();
    
    // Mise à jour des scores après reset
    elements.buttonReset.addEventListener('click', displayScores);

    return elements;
}

// Point d'entrée principal
document.addEventListener('DOMContentLoaded', () => {
    initGame(gameState);
});

const postData = async () => {
    const url = "https://672e1217229a881691eed80f.mockapi.io/scores";
  
    const data = {
      createdAt: new Date().toISOString(),
      username: username,
      avatar:
       "https://yoolk.ninja/wp-content/uploads/2020/06/Akira-Kaneda-1024x819.png",
      score: 0,
      website_url: "kevinlibaude.github.io/ClickFast",
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await response.json();
      console.log("Data posted successfully:", result);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const deleteUserByUsername = async (username) => {
    const url = "https://672e1217229a881691eed80f.mockapi.io/scores";
  
    try {
      // Étape 1 : Récupérer les utilisateurs avec le même username
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const users = await response.json();
      const usersToDelete = users.filter(
        (user) => user.username === username
      );
  
      // Étape 2 : Supprimer chaque utilisateur trouvé
      for (const user of usersToDelete) {
        const deleteResponse = await fetch(`${url}/${user.id}`, {
          method: "DELETE",
        });
  
        if (!deleteResponse.ok) {
          console.error(
            `Error deleting user with ID ${user.id}:`,
            deleteResponse.statusText
          );
        } else {
          console.log(`User with ID ${user.id} deleted successfully.`);
        }
      }
  
      // Étape 3 : Ajouter un nouvel utilisateur
      const newUserData = {
            createdAt: new Date().toISOString(),
            username: username,
            avatar:
             "https://yoolk.ninja/wp-content/uploads/2020/06/Akira-Kaneda-1024x819.png",
            score: 0,
            website_url: "kevinlibaude.github.io/ClickFast",
          };
  
      const postResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });
  
      if (!postResponse.ok) {
        throw new Error("Network response was not ok");
      }
  
      const newUserResult = await postResponse.json();
      console.log("New user posted successfully:", newUserResult);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getData = async () => {
    const url = "https://672e1217229a881691eed80f.mockapi.io/scores";
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log("Data retrieved successfully:", data);
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };
  
  getData();
  deleteUserByUsername(username);
  postData();

module.exports = {
    updateScore,
    resetGame,
    startTimer,
    handleClick,
    handleTimerChange,
    initGame,
    createPlayer
}