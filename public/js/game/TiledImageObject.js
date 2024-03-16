/** An ImageObject that will repeat the image to fill the game object's space */
class TiledImageObject extends ImageObject {
    /** Only make this negative and only use x */
    offset = new Vector(0, 0);

    constructor(imagePath, rect) {
        super(imagePath, rect);
    }

    render(canvas) {
        if (!this.image.complete) {
            return;
        }

        const targetRect = this.toPixels();

        // Offset implementation is super hacky and limited, but it works for now
        const offset = this.offset.toPixels();
        offset.x %= this.image.width;
        offset.y %= this.image.height;

        this.offset = new Vector(
            this.offset.x % (this.image.width / dimensions.width),
            this.offset.y % (this.image.height / dimensions.width)
        );

        for (let x = offset.x; x < targetRect.width; x += this.image.width) {
            for (
                let y = offset.y;
                y < targetRect.height;
                y += this.image.height
            ) {
                canvas.drawImage(
                    this.image,
                    targetRect.x + x,
                    targetRect.y + y,
                    this.image.width,
                    this.image.height
                );
            }
        }
    }
}
