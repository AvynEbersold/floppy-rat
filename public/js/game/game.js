function generateDimensions(widthToHeightRatio) {
    let dimensions = new Vector(
        window.innerWidth,
        window.innerWidth / widthToHeightRatio
    );

    if (dimensions.y > window.innerHeight) {
        dimensions = new Vector(
            window.innerHeight * widthToHeightRatio,
            window.innerHeight
        );
    }

    dimensions = new Vector(Math.floor(dimensions.x), Math.floor(dimensions.y));

    console.log(`Generated dimensions: ${dimensions.x}x${dimensions.y}`);
    return {
        width: dimensions.x,
        height: dimensions.y,
        heightToWidthRatio: dimensions.y / dimensions.x,
    };
}

function initCanvas() {
    console.log(
        `Initting canvas... Width: ${dimensions.width}, Height: ${dimensions.height}`
    );

    const canvasContainer = document.getElementById("canvas-container");

    const canvas = document.createElement("canvas");

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    canvas.id = "game-canvas";

    canvasContainer.appendChild(canvas);

    console.log("Canvas initted");
    return canvas.getContext("2d");
}

class Game {
    static instance = null;

    gameObjects = [];
    lastTimeMs = 0;
    deltaTimeMs = 0;

    constructor() {
        if (Game.instance) {
            return Game.instance;
        }
        Game.instance = this;

        this.canvas = initCanvas();
        this.loop();
    }

    loop() {
        this.deltaTimeMs = Date.now() - this.lastTimeMs;
        this.lastTimeMs = Date.now();
        this.update();
        this.render();
        requestAnimationFrame(this.loop.bind(this));
    }

    update() {
        this.gameObjects.forEach((gameObject) => {
            gameObject.update(this.deltaTimeMs / 1000);
        });
    }

    render() {
        this.canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.gameObjects.forEach((gameObject) => {
            gameObject.render(this.canvas);
        });
    }

    static addGameObject(gameObject) {
        this.instance.gameObjects.push(gameObject);
    }
}

console.log("Game.js loaded");
const dimensions = generateDimensions(8 / 6);

const game = new Game();

Game.addGameObject(
    new ImageObject(
        "images/FB_Background.png",
        new Rect(0, 0, 1, dimensions.heightToWidthRatio)
    )
);
Game.addGameObject(
    new TiledImageObject(
        "images/FB_Mountains.png",
        new Rect(
            0,
            0.5 * dimensions.heightToWidthRatio,
            1,
            0.2 * dimensions.heightToWidthRatio
        )
    ).withUpdateCallback((obj, deltaTime) => {
        obj.offset.x -= 0.065 * deltaTime;
    })
);
Game.addGameObject(
    new TiledImageObject(
        "images/FB_Ground.png",
        new Rect(
            0,
            0.925 * dimensions.heightToWidthRatio,
            1,
            0.2 * dimensions.heightToWidthRatio
        )
    ).withUpdateCallback((obj, deltaTime) => {
        obj.offset.x -= 0.1 * deltaTime;
    })
);

// console.log("Starting game loop...");
// // Not sure why we can't just pass Game.instance.loop directly to setInterval
setInterval(() => Game.instance.loop(), 1000 / 60);
