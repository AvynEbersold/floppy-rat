class Level {
    constructor(
        pipeCount,
        pipeSpacing,
        gapSize,
        gapRange,
        maxGapYChange,
        nextLevel = null
    ) {
        this.pipeCount = pipeCount;
        this.pipeSpacing = pipeSpacing;
        this.pipeGap = gapSize;
        this.gapRange = gapRange;
        this.maxGapYChange = maxGapYChange;
        this.nextLevel = nextLevel;
    }

    start() {
        console.log(`Starting level...`);
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
        console.log("Swapping to next level...");
        game.level = game.level.nextLevel ?? game.level;
        game.level.start();
    }
}

class LevelList {
    static level3 = new Level(5, 0.25, 0.4, [0.1, 0.5], 0.2);
    static level2 = new Level(
        5,
        0.4,
        0.275,
        [0.075, 0.6],
        0.4,
        LevelList.level3
    );
    static level1 = new Level(5, 0.5, 0.3, [0.1, 0.5], 0.4, LevelList.level2);
}
