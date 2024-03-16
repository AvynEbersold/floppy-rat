class Vector {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /** Returns a new vector with values in pixels, assuming this rect has values in % of canvas width */
    toPixels() {
        return new Vector(this.x * dimensions.width, this.y * dimensions.width);
    }
}
