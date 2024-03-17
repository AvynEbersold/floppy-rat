class PlayerObject extends ImageObject {
    velocity = new Vector(0, 0);

    constructor() {
        super(
            "images/FB_Player.png",
            new Rect(0.1, 0.3, 0.075, 0.075 * dimensions.heightToWidthRatio)
        );
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Apply gravity
        this.velocity.y -= config.gravity * deltaTime;
        this.y -= this.velocity.y * deltaTime;

        // Clamp to top of screen
        if (this.y < 0) this.y = 0;

        this.overlapCheck();
    }

    render(canvas) {
        // Move rotation towards target rotation, but don't exceed maxRotChange
        const targetRot = -this.velocity.y;
        const maxRotChange = 0.02; // radians per frame
        const prevRot = this.rotation;

        if (targetRot > prevRot)
            this.rotation += Math.min(targetRot - prevRot, maxRotChange);
        else if (targetRot < prevRot)
            this.rotation -= Math.min(prevRot - targetRot, maxRotChange);

        super.render(canvas);
    }

    keyDown(key) {
        if (key in keybinds.jump) this.jump();
    }

    onClick() {
        this.jump();
    }

    jump() {
        this.velocity.y = config.jumpForce;
    }

    overlapCheck() {
        const toCheck = [keyObjects.ground];
        for (const obj of toCheck) {
            if (this.overlaps(obj)) {
                obj.onOverlap(this);
            }
        }
    }

    die() {
        game.removeGameObject(this);
        new DeadPlayerObject(new Vector(this.x, this.y), this.rotation);
    }
}
