function createBackground() {
    return new ImageObject(
        "images/FB_Background.png",
        new Rect(0, 0, 1, dimensions.heightToWidthRatio)
    );
}

function createMountains() {
    return new TiledImageObject(
        "images/FB_Mountains.png",
        new Rect(
            0,
            0.5 * dimensions.heightToWidthRatio,
            1,
            0.2 * dimensions.heightToWidthRatio
        )
    ).withUpdateCallback(scrollLeftUpdateCallback(config.scrollSpeed / 2));
}

function createGround() {
    return new TiledImageObject(
        "images/FB_Ground.png",
        new Rect(
            0,
            0.925 * dimensions.heightToWidthRatio,
            1,
            0.2 * dimensions.heightToWidthRatio
        )
    )
        .withUpdateCallback(scrollLeftUpdateCallback(config.scrollSpeed))
        .withOverlapCallback((obj, other) => {
            if (other instanceof PlayerObject) {
                other.die();
            }
        });
}

function createFpsCounter() {
    new TextObject(0.85, 0.02, "FPS: 0", { align: "right" }).withUpdateCallback(
        (obj, deltaTime) => {
            obj.text = `FPS: ${
                deltaTime > 0 ? Math.round(1 / deltaTime) : "1000+"
            }`;
        }
    );
}

function createFaderObject() {
    return new VisibleObject(
        new Rect(0, 0, 1, 1),
        new Color(0, 0, 0, 0)
    ).withUpdateCallback((obj, deltaTime) => {
        obj.color.a = Math.min(0.5, obj.color.a + deltaTime);
    });
}

function createPlayButtonObject(fader) {
    return new ImageObject(
        "images/FB_Start.png",
        new Rect(0.4, (dimensions.heightToWidthRatio - 0.2) / 2, 0.2, 0.2)
    )
        .withUpdateCallback((obj, deltaTime) => {
            obj.color.a = obj.overlaps(game.mousePos) ? 0.5 : 1;
        })
        .withOnClickCallback((obj) => {
            if (obj.overlaps(game.mousePos)) {
                game.removeGameObject(obj);
                game.removeGameObject(fader);
                game.start();
            }
        });
}
