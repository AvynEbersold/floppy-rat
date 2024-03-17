class Game {
    gameObjects = [];
    lastTimeMs = 0;
    deltaTimeMs = 0;
    mousePos = new Vector(0, 0);

    constructor() {
        this.canvas = initCanvas();
        this.lastTimeMs = Date.now();
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

    keyDown(key) {
        this.gameObjects.forEach((gameObject) => {
            gameObject.keyDown(key);
        });
    }

    onClick() {
        this.gameObjects.forEach((gameObject) => {
            gameObject.onClick();
        });
    }

    onMouseMove(pos) {
        this.mousePos = new Vector(
            pos.x / dimensions.width,
            pos.y / dimensions.width
        );
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }

    removeGameObject(gameObject) {
        this.gameObjects = this.gameObjects.filter((obj) => obj !== gameObject);
    }

    start() {
        console.log("Starting game...");

        keyObjects.player = new PlayerObject();
    }
}
