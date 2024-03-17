class DeadPlayerObject extends ImageObject {
    velocity = new Vector(0, config.jumpForce);

    constructor(pos, rot) {
        super(
            "images/FB_Player.png",
            new Rect(pos.x, pos.y, 0.075, 0.075 * dimensions.heightToWidthRatio)
        );
        this.rotation = rot;
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Apply gravity
        this.velocity.y -= config.gravity * deltaTime;

        this.y -= this.velocity.y * deltaTime;

        if (!this.isOnScreen()) {
            keyObjects.deadPlayer = null;
            game.removeGameObject(this);

            game.end();
        }
    }

    render(canvas) {
        // Move rotation towards target rotation, but don't exceed maxRotChange
        const targetRot = -this.velocity.y;
        const maxRotChange = config.playerMaxRotChange; // radians per frame
        const prevRot = this.rotation;

        if (targetRot > prevRot)
            this.rotation += Math.min(targetRot - prevRot, maxRotChange);
        else if (targetRot < prevRot)
            this.rotation -= Math.min(prevRot - targetRot, maxRotChange);

        super.render(canvas);
    }
}
