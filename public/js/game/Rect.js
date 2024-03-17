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

    isOnScreen() {
        return (
            this.x + this.width > 0 &&
            this.x < 1 &&
            this.y + this.height > 0 &&
            this.y < dimensions.heightToWidthRatio
        );
    }

    overlaps(other) {
        if (other instanceof Rect)
            return (
                this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y
            );

        if (other instanceof Vector)
            return (
                this.x < other.x &&
                this.x + this.width > other.x &&
                this.y < other.y &&
                this.y + this.height > other.y
            );
    }
}
