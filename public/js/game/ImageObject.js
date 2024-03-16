/** An object that renders an image. */
class ImageObject extends GameObject {
    image = null;

    /** Used to specify what part of the image to draw. Will default to the whole image if not specified. */
    sourceSelectionDimensions = null;

    constructor(imagePath, rect, sourceSelectionDimensions = null) {
        super(rect);

        this.image = new Image();
        this.image.src = imagePath;
        this.image.onload = () => {
            if (!sourceSelectionDimensions) {
                this.sourceSelectionDimensions = {
                    x: 0,
                    y: 0,
                    width: this.image.width,
                    height: this.image.height,
                };
            }
        };

        if (sourceSelectionDimensions)
            this.sourceSelectionDimensions = sourceSelectionDimensions;
    }

    render(canvas) {
        const targetRect = this.toPixels();

        if (this.sourceSelectionDimensions)
            canvas.drawImage(
                this.image,
                this.sourceSelectionDimensions.x,
                this.sourceSelectionDimensions.y,
                this.sourceSelectionDimensions.width,
                this.sourceSelectionDimensions.height,
                targetRect.x,
                targetRect.y,
                targetRect.width,
                targetRect.height
            );
        else
            canvas.drawImage(
                this.image,
                targetRect.x,
                targetRect.y,
                targetRect.width,
                targetRect.height
            );
    }
}
