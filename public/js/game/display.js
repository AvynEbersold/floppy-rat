function generateDimensions(widthToHeightRatio) {
    let dimensions = new Vector(
        window.innerWidth,
        window.innerWidth / widthToHeightRatio
    );

    if (dimensions.y > window.innerHeight) {
        dimensions = new Vector(
            window.innerHeight * widthToHeightRatio,
            window.innerHeight
        );
    }

    dimensions = new Vector(Math.floor(dimensions.x), Math.floor(dimensions.y));

    console.log(`Generated dimensions: ${dimensions.x}x${dimensions.y}`);
    return {
        width: dimensions.x,
        height: dimensions.y,
        heightToWidthRatio: dimensions.y / dimensions.x,
    };
}

function initCanvas() {
    console.log(
        `Initting canvas... Width: ${dimensions.width}, Height: ${dimensions.height}`
    );

    const canvasContainer = document.getElementById("canvas-container");

    const canvas = document.createElement("canvas");

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    canvas.id = "game-canvas";

    canvasContainer.appendChild(canvas);

    console.log("Canvas initted");

    return canvas.getContext("2d");
}
