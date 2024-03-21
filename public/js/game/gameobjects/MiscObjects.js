function createBackground() {
    return new ImageObject(
        "images/FB_Background.png",
        new Rect(0, 0, 1, dimensions.heightToWidthRatio)
    ).withRenderStep(RenderStep.Early);
}

function createMountains() {
    return new TiledImageObject(
        "images/FB_Mountains.png",
        new Rect(
            0,
            0.3 * dimensions.heightToWidthRatio,
            1,
            0.2 * dimensions.heightToWidthRatio
        )
    )
        .withUpdateCallback(scrollLeftUpdateCallback(config.scrollSpeed / 2))
        .withRenderStep(RenderStep.Early);
}

function createGround() {
    return new TiledImageObject(
        "images/FB_Ground.png",
        new Rect(
            0,
            0.85 * dimensions.heightToWidthRatio,
            1,
            0.15 * dimensions.heightToWidthRatio
        )
    )
        .withUpdateCallback(scrollLeftUpdateCallback(config.scrollSpeed*2))
        .withOverlapCallback((obj, other) => {
            if (other instanceof PlayerObject) {
                other.die();
            }
        });
}

function createFpsCounter() {
    let prevFramerates = [];
    new TextObject(0.85, 0.02, "FPS: 0", { align: "right" })
        .withUpdateCallback((obj, deltaTime) => {
            prevFramerates.push(1 / deltaTime);
            if (prevFramerates.length > 10) prevFramerates.shift();

            // Calculate average framerate
            const avg =
                prevFramerates.reduce((a, b) => a + b, 0) /
                prevFramerates.length;

            obj.text = `FPS: ${avg > 0 ? Math.round(avg) : "1000+"}`;
        })
        .withRenderStep(RenderStep.Late);
}

function createFaderObject() {
    return new VisibleObject(
        new Rect(0, 0, 1, 1),
        new Color(0, 0, 0, 0)
    ).withUpdateCallback((obj, deltaTime) => {
        obj.color.a = Math.min(0.5, obj.color.a + deltaTime);
    });
}

function createPlayButtonObject(fader, scoreText, highScoreText) {
    const newGame = (obj) => {
        game.removeGameObject(obj);
        game.removeGameObject(fader);
        game.removeGameObject(scoreText);
        game.removeGameObject(highScoreText);

        game.start();
    };


    return new ImageObject(
        "images/FB_Start.png",
        new Rect(0.4, (dimensions.heightToWidthRatio - 0.2) / 2, 0.2, 0.2)
    )
        .withUpdateCallback((obj, deltaTime) => {
            obj.color.a = obj.overlaps(game.mousePos) ? 0.5 : 1;
        })
        .withOnClickCallback((obj) => {
            if (obj.overlaps(game.mousePos)) newGame(obj);
        })
        .withKeyDownCallback((obj, key) => newGame(obj));
}

function createScoreText() {
    return new TextObject(0.5, 0.55, `score: ${game.score}`, {
        size: 40,
        align: "center",
    });
}

function createHighScoreText() {
    return new TextObject(0.5, 0.6, `high score: ${game.highScore}`, {
        size: 40,
        align: "center",
    });
}

function createScoreCounter() {
    new TextObject(0.97, 0.05, "0", { size: 35, align: "right" })
        .withUpdateCallback((obj, deltaTime) => {
            obj.text = `${game.score} / ${game.levelIndex + 1}`;
        })
        .withRenderStep(RenderStep.Late);
}
