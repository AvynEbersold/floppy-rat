class Level {
    constructor(pipeCount, pipeSpacing, gapSize, gapRange, nextLevel = null) {
        this.pipeCount = pipeCount;
        this.pipeSpacing = pipeSpacing;
        this.pipeGap = gapSize;
        this.gapRange = gapRange;
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
        let pipeX = 1.2;

        for (let i = 0; i < this.pipeCount; i++) {
            const pipe = new PipeObject(pipeX, pipeGapY, this.pipeGap);
            game.addGameObject(pipe);

            pipeX += this.pipeSpacing;
            pipeGapY = generatePipeGapY(this);

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
    static level3 = new Level(5, 0.15, 0.4, [0.065, 0.65]);
    static level2 = new Level(5, 0.4, 0.275, [0.075, 0.6]);
    static level1 = new Level(5, 0.5, 0.3, [0.1, 0.5], LevelList.level2);
}
