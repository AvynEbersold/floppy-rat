/** Base class for all objects in the game. */
class GameObject extends Rect {
    updateCallback = [];
    overlapCallback = [];
    keyDownCallback = [];
    onClickCallback = [];

    constructor(rect) {
        super(rect.x, rect.y, rect.width, rect.height);

        game.addGameObject(this);
    }

    update(deltaTime) {
        for (const callback of this.updateCallback) {
            callback(this, deltaTime);
        }
    }

    render(canvas) {}

    keyDown(key) {
        for (const callback of this.keyDownCallback) {
            callback(this, key);
        }
    }
    onClick() {
        for (const callback of this.onClickCallback) {
            callback(this);
        }
    }

    withUpdateCallback(callback) {
        this.updateCallback.push(callback);
        return this;
    }

    withOverlapCallback(callback) {
        this.overlapCallback.push(callback);
        return this;
    }

    withKeyDownCallback(callback) {
        this.keyDownCallback.push(callback);
        return this;
    }

    withOnClickCallback(callback) {
        this.onClickCallback.push(callback);
        return this;
    }

    overlaps(other) {
        if (other instanceof Rect)
            return (
                this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y
            );

        if (other instanceof Vector)
            return (
                this.x < other.x &&
                this.x + this.width > other.x &&
                this.y < other.y &&
                this.y + this.height > other.y
            );
    }

    onOverlap(other) {
        for (const callback of this.overlapCallback) {
            callback(this, other);
        }
    }

    isOnScreen() {
        return (
            this.x + this.width > 0 &&
            this.x < 1 &&
            this.y + this.height > 0 &&
            this.y < dimensions.heightToWidthRatio
        );
    }
}

function scrollLeftUpdateCallback(speed) {
    return (obj, deltaTime) => {
        if (obj instanceof TiledImageObject) obj.offset.x -= speed * deltaTime;
        else obj.x -= speed * deltaTime;
    };
}
