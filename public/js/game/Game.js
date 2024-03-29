class Game {
    gameObjects = [];
    lastTimeMs = 0;
    deltaTimeMs = 0;
    globalGameLoop = 0;
    mousePos = new Vector(0, 0);

    score = 0;
    highScore = localStorage.getItem("highScore") || 0;

    gameplayStarted = false;
    gameplayStartedCallbacks = [];

    constructor() {
        this.canvas = initCanvas();
        this.lastTimeMs = Date.now();
    }

    loop() {
        this.deltaTimeMs = Date.now() - this.lastTimeMs;
        this.lastTimeMs = Date.now();

        this.canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);

        this.render(RenderStep.Early);
        this.update();
        this.render(RenderStep.Main);
        this.render(RenderStep.Late);

        requestAnimationFrame(this.loop.bind(this));
    }

    update() {
        this.gameObjects.forEach((gameObject) => {
            gameObject.update(this.deltaTimeMs / 1000);
        });
    }

    render(renderStep) {
        this.gameObjects
            .filter((o) => o.renderStep === renderStep)
            .forEach((gameObject) => {
                gameObject.render(this.canvas);
            });
    }

    keyDown(key) {
        if (!this.gameplayStarted)
            this.level.start();
        this.gameplayStarted = true;
        
        this.gameObjects.forEach((gameObject) => {
            gameObject.keyDown(key);
        });
    }

    onClick() {
        if (!this.gameplayStarted)
            this.level.start();
        this.gameplayStarted = true;

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
        if (gameObject instanceof GameObject)
            this.gameObjects.push(gameObject);
    }

    removeGameObject(gameObject) {
        this.gameObjects = this.gameObjects.filter((obj) => obj !== gameObject);
    }

    start() {
        console.log("Starting game...");
        game.globalGameLoop++;
        console.log("Game Loop:" + game.globalGameLoop);
        keyObjects.player = new PlayerObject();
		keyObjects.scoreCounter.withRenderStep(RenderStep.Late);

        for (const step in RenderStep) {
            console.log(`Rendering step: ${step}`);
            this.render(step);
        }

        if (this.gameplayStarted) {
            for (const callback of this.gameplayStartedCallbacks) {
                callback();
            }

            this.level.start();
        }
    }

    startLoop() {
        console.log("Starting game loop...");
        // // Not sure why we can't just pass Game.instance.loop directly to setInterval
        // setInterval(() => game.loop(), 1000 / config.fps);
        requestAnimationFrame(this.loop.bind(this));

        for (const callback of this.gameplayStartedCallbacks) {
            callback();
        }

        if (this.gameplayStarted)
            this.level.start();
    }

    end() {
        console.log("Ending game...");

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem("highScore", this.highScore);
        }

        const fader = createFaderObject();
        const scoreText = createScoreText();
        const highScoreText = createHighScoreText();
        createPlayButtonObject(fader, scoreText, highScoreText);
		keyObjects.scoreCounter.withRenderStep("none");

        this.gameplayStartedCallbacks = [];

        this.setLevel(0);
        this.score = 0;
    }

    addGameplayStartedCallback(callback) {
        this.gameplayStartedCallbacks.push(callback);
    }

    setLevel(index) {
        this.levelIndex = index;
        this.level = levelList[index];
    }
}
