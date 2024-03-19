class Level {
    startCallbacks = [];
    endCallbacks = [];

    constructor(pipeCount, pipeSpacing, gapSize, gapRange, maxGapYChange) {
        this.pipeCount = pipeCount;
        this.pipeSpacing = pipeSpacing;
        this.pipeGap = gapSize;
        this.gapRange = gapRange;
        this.maxGapYChange = maxGapYChange;
    }

    start() {
        console.log(`Starting level...`);

        for (const callback of this.startCallbacks) {
            callback(this);
        }

        this.spawnPipes();
    }

    spawnPipes() {
        function generatePipeGapY(level) {
            return Math.min(
                Math.max(
                    Math.random() * (1 - level.pipeGap),
                    level.gapRange[0]
                ),
                level.gapRange[1]
            );
        }

        let pipeGapY = generatePipeGapY(this);
        let prevPipeGapY = pipeGapY;
        let pipeX = 1.2;

        for (let i = 0; i < this.pipeCount; i++) {
            const pipe = new PipeObject(pipeX, pipeGapY, this.pipeGap);
            game.addGameObject(pipe);

            pipeX += this.pipeSpacing;

            prevPipeGapY = pipeGapY;
            pipeGapY = generatePipeGapY(this);

            // Ensure that the gap between pipes doesn't change too much
            if (pipeGapY - prevPipeGapY > this.maxGapYChange) {
                pipeGapY = prevPipeGapY - this.maxGapYChange;
            }

            if (pipeGapY - prevPipeGapY < -this.maxGapYChange) {
                pipeGapY = prevPipeGapY + this.maxGapYChange;
            }

            // Ensure that the gap between pipes doesn't go out of bounds
            pipeGapY = Math.min(pipeGapY, 1 - this.pipeGap);
            pipeGapY = Math.max(pipeGapY, this.pipeGap);

            if (i == this.pipeCount - 1) {
                pipe.withPassedByPlayerCallback(this.swapToNextLevel);
            }
        }
    }

    swapToNextLevel() {
        for (const callback of game.level.endCallbacks) {
            callback(game.level);
        }

        console.log("Swapping to next level...");
        game.setLevel(Math.min(game.levelIndex + 1, levelList.length - 1));
        game.level.start();
    }

    withStartCallback(callback) {
        this.startCallbacks.push(callback);
        return this;
    }

    withEndCallback(callback) {
        this.endCallbacks.push(callback);
        return this;
    }
}

const levelList = [
    new Level(5, 0.5, 0.3, [0.1, 0.3], 0.4),
    new Level(5, 0.4, 0.275, [0.075, 0.325], 0.4),
    new Level(5, 0.25, 0.4, [0.1, 0.3], 0.2),
    new Level(5, 0.5, 0.3, [0.1, 0.3], 0.4)
        .withStartCallback((level) => {
            config.gravity *= -1;
            config.jumpForce *= -1;
        })
        .withEndCallback((level) => {
            config.gravity *= -1;
            config.jumpForce *= -1;
        }),
    new Level(1, 0.5, 0.3, [0.1, 0.3], 0.4)
        .withStartCallback((level) => {
            config.scrollSpeed *= 4;
        })
        .withEndCallback((level) => {
            config.scrollSpeed /= 4;
        }),
    new Level(5, 0.4, 0.275, [0.075, 0.3], 0.4),
];
