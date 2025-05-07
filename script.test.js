/**
 * @jest-environment jsdom
 */
const script = require('./script');

beforeEach(() => {
    document.body.innerHTML = `
    <div id="score-display" class="mb-4">Score : 0</div>
    <button id="button-clicker" class="btn btn-primary">Click</button>
    <button id="button-reset" class="btn btn-secondary ms-2">Reset</button>
    <div class="timer-section d-flex justify-content-center flex-column align-items-center">
        <select id="timer-select" class="form-select w-50 mb-3" aria-label="Sélection du temps de jeu">
            <option value="5">5 secondes</option>
            <option value="10" selected>10 secondes</option>
            <option value="15">15 secondes</option>
            <option value="30">30 secondes</option>
        </select>
        <div id="timer" class="mb-4">10</div>
    </div>
    `;
});
test('clic on "Click" button',() => {
    const gameState = {
        count: 0,
        timeLeft: 0,
        timer: null,
        isGameStarted: false
    };
    const elements = {
        buttonClicker : document.getElementById('button-clicker'),
        scoreDisplay : document.getElementById('score-display'),
        timerSelect : document.getElementById('timer-select'),
    }

    script.handleClick(gameState,elements);
    expect(elements.scoreDisplay.textContent).toBe('Score : 1');
});

test('Select timer disabled',() => {
    const gameState = {
        count: 0,
        timeLeft: 0,
        timer: null,
        isGameStarted: false
    };
    const elements = {
        buttonClicker : document.getElementById('button-clicker'),
        scoreDisplay : document.getElementById('score-display'),
        timerSelect : document.getElementById('timer-select'),
    }
    script.startTimer(gameState,elements);
    expect(elements.timerSelect.disabled).toBe(true);
});

test('"Click" button disabled when no time left',() => {
    const gameState = {
        count: 0,
        timeLeft: 0,
        timer: null,
        isGameStarted: false
    };
    const elements = {
        buttonClicker : document.getElementById('button-clicker'),
        scoreDisplay : document.getElementById('score-display'),
        timerSelect : document.getElementById('timer-select'),
    }
    script.startTimer(gameState,elements);

    expect(elements.buttonClicker.disabled).toBe(true);
});

test('clic on Reset button',() => {
    const gameState = {
        count: 5,
        timeLeft: 0,
        timer: null,
        isGameStarted: false
    };
    const elements = {
        buttonClicker : document.getElementById('button-clicker'),
        scoreDisplay : document.getElementById('score-display'),
        timerSelect : document.getElementById('timer-select'),
        timerDisplay : document.getElementById('timer')
   };
   script.resetGame(gameState, elements);
   expect(elements.scoreDisplay.textContent).toBe('Score : 0');
});

test('timer change value',() => {
    const elements = {
        buttonClicker : document.getElementById('button-clicker'),
        scoreDisplay : document.getElementById('score-display'),
        timerSelect : document.getElementById('timer-select'),
        timerDisplay : document.getElementById('timer')
   };
    const event = { target: { value: 15 } };
    script.handleTimerChange(event, elements);
    expect(elements.timerDisplay.textContent).toBe('15');
});

test('timer start',() => {
    const state = {
        count: 5,
        timeLeft: 0,
        timer: null,
        isGameStarted: false
    };
    const elements = {
        buttonClicker : document.getElementById('button-clicker'),
        scoreDisplay : document.getElementById('score-display'),
        timerSelect : document.getElementById('timer-select'),
        timerDisplay : document.getElementById('timer')
   };

   script.startTimer(state,elements)
   expect(state.isGameStarted).toBe(true);
});

test('Score update on button click',() => {
    const state = {
        count: 5,
        timeLeft: 0,
        timer: null,
        isGameStarted: false
    };
    const elements = {
        buttonClicker : document.getElementById('button-clicker'),
        scoreDisplay : document.getElementById('score-display'),
        timerSelect : document.getElementById('timer-select'),
        timerDisplay : document.getElementById('timer')
   };
    script.updateScore(elements.scoreDisplay,state.count);
    script.handleClick(state,elements);
    expect(elements.scoreDisplay.textContent).toBe('Score : 6');
});

test('Game init', () => {
    const state = {
        count: 5,
        timeLeft: 0,
        timer: null,
        isGameStarted: false
    };
    // Capturer le retour de la fonction dans une variable
    const result = script.initGame(state);
    
    // Vérifier que result contient tous les éléments attendus
    expect(result).toEqual({
        buttonClicker: expect.any(HTMLElement),
        buttonReset: expect.any(HTMLElement),
        timerDisplay: expect.any(HTMLElement),
        timerSelect: expect.any(HTMLElement),
        scoreDisplay: expect.any(HTMLElement)
    });
});