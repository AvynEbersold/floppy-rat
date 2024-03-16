class Rect {
    x = 0;
    y = 0;
    width = 0;
    height = 0;

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /** Returns a new rect with values in pixels, assuming this rect has values in % of canvas width */
    toPixels() {
        return new Rect(
            this.x * dimensions.width,
            this.y * dimensions.width,
            this.width * dimensions.width,
            this.height * dimensions.width
        );
    }
}
