console.log("main.js loaded");

const dimensions = generateDimensions(8 / 6);
const game = new Game();
const keyObjects = {
    background: createBackground(),
    mountains: createMountains(),
    ground: createGround(),
    player: null,
    deadPlayer: null,
    pipes: [],
    scoreCounter: createScoreCounter(),
    // fpsCounter: createFpsCounter(),
};

game.setLevel(0);

game.start();

window.addEventListener("keydown", (event) => {
    console.log(`Keydown: ${event.key}`);

    for (const key in keybinds) {
        if (keybinds[key].includes(event.key)) {
            event.preventDefault();
            break;
        }
    }

    game.keyDown(event.key);

    if (keybinds.quit.includes(event.key)) {
        console.log("Quitting game...");
        keyObjects.player?.die();
    }
});

game.canvas.canvas.addEventListener("click", () => {
    game.onClick();
});

game.canvas.canvas.addEventListener("mousemove", (event) => {
    game.onMouseMove(getMousePos(game.canvas.canvas, event));
});

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x:
            ((event.clientX - rect.left) / (rect.right - rect.left)) *
            canvas.width,
        y:
            ((event.clientY - rect.top) / (rect.bottom - rect.top)) *
            canvas.height,
    };
}

game.startLoop();
