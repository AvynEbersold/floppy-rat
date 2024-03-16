class PlayerObject extends ImageObject {
    velocity = new Vector(0, 0);

    constructor() {
        super(
            "images/FB_Player.png",
            new Rect(0, 0, 0.075, 0.075 * dimensions.heightToWidthRatio)
        );
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Apply gravity
        this.velocity.y -= config.gravity * deltaTime;

        this.y -= this.velocity.y * deltaTime;
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
}
