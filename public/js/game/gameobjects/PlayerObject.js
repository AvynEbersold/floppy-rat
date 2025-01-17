class PlayerObject extends ImageObject {
    velocity = new Vector(0, 0);
    jumpOverload = null;

    static DEFAULT_IMG_PATH = "images/FB_Player.png";
    static FLIPPED_IMG_PATH = "images/Flipped_Rat.png";

    constructor() {
        super(
            PlayerObject.DEFAULT_IMG_PATH,
            new Rect(0.5 - (0.075 / 2), 0.3, 0.1, 0.1 * dimensions.heightToWidthRatio)
        );

        this.renderStep = RenderStep.Late;
    }

    update(deltaTime) {
        super.update(deltaTime);

        if (!game.gameplayStarted) return;

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
        const maxRotChange = config.playerMaxRotChange; // radians per frame
        const prevRot = this.rotation;

        if (targetRot > prevRot)
            this.rotation += Math.min(targetRot - prevRot, maxRotChange);
        else if (targetRot < prevRot)
            this.rotation -= Math.min(prevRot - targetRot, maxRotChange);

        super.render(canvas);
    }

    keyDown(key) {
        if (game.gameplayStarted && keybinds.jump.includes(key)) this.jump();
    }

    onClick() {
        this.jump();
    }

    jump() {
        if (this.jumpOverload) {
            this.jumpOverload(this);
            return;
        }
        
        this.velocity.y = config.jumpForce;
    }

    overlapCheck() {
        const toCheck = [keyObjects.ground, ...keyObjects.pipes];
        for (const obj of toCheck) {
            if (obj.overlaps(this)) {
                obj.onOverlap(this);
            }
        }
    }

    die() {
        game.level.end();

        game.removeGameObject(this);
        keyObjects.deadPlayer = new DeadPlayerObject(
            this,
            this.rotation
        );
        keyObjects.player = null;
    }
  flip() {
    this.setImage(this.image.src.endsWith(PlayerObject.DEFAULT_IMG_PATH) ? PlayerObject.FLIPPED_IMG_PATH : PlayerObject.DEFAULT_IMG_PATH);
  }
}
