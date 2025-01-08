/** An ImageObject that will repeat the image to fill the game object's space */
class TiledImageObject extends ImageObject {
    /** Only make this negative and only use x */
    offset = new Vector(0, 0);

    constructor(imagePath, rect, tiling) {
        super(imagePath, rect);
        this.tiling = tiling;
    }

    render(canvas) {
        if (!this.image.complete) {
            return;
        }

        const targetRect = this.toPixels();
        const tileRect = new Vector(
            targetRect.width / this.tiling.x,
            targetRect.height / this.tiling.y
        );

        // Offset implementation is super hacky and limited, but it works for now
        const offset = this.offset.toPixels();
        offset.x %= targetRect.width;
        offset.y %= targetRect.height;

        this.offset = new Vector(
            this.offset.x % (targetRect.width / dimensions.width),
            this.offset.y % (targetRect.height / dimensions.width)
        );

        for (let x = offset.x; x < targetRect.width; x += tileRect.x) {
            for (let y = offset.y; y < targetRect.height; y += tileRect.y) {
                canvas.drawImage(
                    this.image,
                    targetRect.x + x,
                    targetRect.y + y,
                    tileRect.x,
                    tileRect.y
                );
            }
        }
    }
}
