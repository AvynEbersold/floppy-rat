const RenderStep = Object.freeze({
    Early: "early",
    Main: "main",
    Late: "late",
});

/** Base class for all objects in the game. */
class GameObject extends Rect {
    updateCallbacks = [];
    overlapCallbacks = [];
    keyDownCallbacks = [];
    onClickCallbacks = [];

    renderStep = RenderStep.Main;

    constructor(rect) {
        super(rect.x, rect.y, rect.width, rect.height);

        game.addGameObject(this);
    }

    update(deltaTime) {
        for (const callback of this.updateCallbacks) {
            callback(this, deltaTime);
        }
    }

    render(canvas) {}

    destroy() {
        game.removeGameObject(this);
    }

    keyDown(key) {
        for (const callback of this.keyDownCallbacks) {
            callback(this, key);
        }
    }
    onClick() {
        for (const callback of this.onClickCallbacks) {
            callback(this);
        }
    }

    withUpdateCallback(callback) {
        this.updateCallbacks.push(callback);
        return this;
    }

    withOverlapCallback(callback) {
        this.overlapCallbacks.push(callback);
        return this;
    }

    withKeyDownCallback(callback) {
        this.keyDownCallbacks.push(callback);
        return this;
    }

    withOnClickCallback(callback) {
        this.onClickCallbacks.push(callback);
        return this;
    }

    withRenderStep(renderStep) {
        this.renderStep = renderStep;
        return this;
    }

    onOverlap(other) {
        for (const callback of this.overlapCallbacks) {
            callback(this, other);
        }
    }
}

function scrollLeftUpdateCallback(speed) {
    return (obj, deltaTime) => {
        if (obj instanceof TiledImageObject) obj.offset.x -= speed * deltaTime;
        else obj.x -= speed * deltaTime;
    };
}
