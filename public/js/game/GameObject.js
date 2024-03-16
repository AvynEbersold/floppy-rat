/** Base class for all objects in the game. */
class GameObject extends Rect {
    updateCallback = null;

    constructor(rect) {
        super(rect.x, rect.y, rect.width, rect.height);

        Game.addGameObject(this);
    }

    update(deltaTime) {
        if (this.updateCallback) {
            this.updateCallback(this, deltaTime);
        }
    }

    render(canvas) {}

    withUpdateCallback(callback) {
        this.updateCallback = callback;
        return this;
    }
}
