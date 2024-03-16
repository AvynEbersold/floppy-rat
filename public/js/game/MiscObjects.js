function createBackground() {
    new ImageObject(
        "images/FB_Background.png",
        new Rect(0, 0, 1, dimensions.heightToWidthRatio)
    );
}

function createMountains() {
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
    });
}

function createGround() {
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
