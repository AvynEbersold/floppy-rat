console.log("main.js loaded");
const dimensions = generateDimensions(8 / 6);

const game = new Game();

const keyObjects = {
    background: createBackground(),
    mountains: createMountains(),
    ground: createGround(),
    player: null,
};

game.start();

console.log("Starting game loop...");
// // Not sure why we can't just pass Game.instance.loop directly to setInterval
const loopIntervalId = setInterval(() => game.loop(), 1000 / config.fps);

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
        clearInterval(loopIntervalId);
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
