class PipeObject extends ImageObject {
    passedByPlayer = false;
    passedByPlayerCallbacks = [];

    constructor(x, gapY, gapHeight, gameLoop) {
        super("images/FB_Tubes.png", new Rect(x, 0, 0.2, gapY));

        this.gapY = gapY;
        this.gapHeight = gapHeight;
        this.gameLoop = gameLoop;
        keyObjects.pipes.push(this);

        this.updateCallbacks.push(scrollLeftUpdateCallback(config.scrollSpeed));
    }

    update(deltaTime) {
        super.update(deltaTime);
      if(this.gameLoop != game.globalGameLoop){
        this.destroy();
      }
        if (!keyObjects.player && !keyObjects.deadPlayer) {
            this.gapY -= deltaTime;
            this.gapHeight += deltaTime * 2;

            if (
                this.gapY < 0 &&
                this.gapY + this.gapHeight > dimensions.heightToWidthRatio
            )
                this.destroy();
        }

        if (this.x < -this.width) {
            this.destroy();
        }

        // Make sure to check if the player object exists first!
        if (
            keyObjects.player &&
            this.x + this.width < keyObjects.player.x &&
            !this.passedByPlayer
        ) {
            this.passedByPlayer = true;
            game.score++;

            for (const callback of this.passedByPlayerCallbacks) {
                callback(this);
            }
        }
    }

    render(canvas) {
        this.preRender(canvas);

        const gapHeight = this.gapHeight * dimensions.width;
        const gapY = this.gapY * dimensions.width;
        const rectPixels = this.toPixels();

        const source = {
            x: 0,
            y: 0,
            width: this.image.width,
            height: this.image.height,
        };

        const pipeRect = {
            // preRender translate for us, so we can just draw at 0, 0.
            // Only draw at another pos if we want to offset from the obj's x or y
            x: 0,
            width: this.width * dimensions.width,
        };

        // Stretch the pipes vertically to cover the screen
        const verticalStretch = 2.3;

        // Draw top pipe
        const topRect = {
            y:
                rectPixels.y -
                source.height +
                gapY -
                source.height * (verticalStretch - 1),
            height: source.height * verticalStretch,
        };

        canvas.drawImage(
            this.image,
            source.x,
            source.y,
            source.width,
            source.height,
            pipeRect.x,
            topRect.y,
            pipeRect.width,
            topRect.height
        );

        // Draw bottom pipe
        const bottomRect = {
            y: rectPixels.y + gapHeight + gapY,
            height: source.height * verticalStretch,
        };

        canvas.drawImage(
            this.image,
            source.x,
            source.y,
            source.width,
            source.height,
            pipeRect.x,
            bottomRect.y,
            pipeRect.width,
            bottomRect.height
        );

        this.postRender(canvas);
    }

    destroy() {
        super.destroy();
        keyObjects.pipes = keyObjects.pipes.filter((pipe) => pipe !== this);
    }

    overlaps(rect) {
        // Compute top and bottom pipe rects
        const topRect = new Rect(this.x, this.y, this.width, this.gapY);

        const bottomRect = new Rect(
            this.x,
            this.gapY + this.gapHeight,
            this.width,
            1
        );

        return topRect.overlaps(rect) || bottomRect.overlaps(rect);
    }

    onOverlap(other) {
        if (other instanceof PlayerObject) {
            other.die();
        }
    }

    withPassedByPlayerCallback(callback) {
        this.passedByPlayerCallbacks.push(callback);
        return this;
    }
}
