/** An object that renders an image. */
class ImageObject extends VisibleObject {
    image = null;

    /** Used to specify what part of the image to draw. Will default to the whole image if not specified. */
    sourceSelectionDimensions = null;

    constructor(imagePath, rect, sourceSelectionDimensions = null) {
        super(rect);

        if (sourceSelectionDimensions)
            this.sourceSelectionDimensions = sourceSelectionDimensions;

        this.setImage(imagePath);
    }

    setImage(imagePath) {
        this.image = new Image();
        this.image.src = imagePath;
        this.image.onload = () => {
            if (!this.sourceSelectionDimensions) {
                this.sourceSelectionDimensions = {
                    x: 0,
                    y: 0,
                    width: this.image.width,
                    height: this.image.height,
                };
            }
        };
    }

    render(canvas) {
        this.preRender(canvas);

        const targetRect = this.toPixels();

        if (this.sourceSelectionDimensions)
            canvas.drawImage(
                this.image,
                this.sourceSelectionDimensions.x,
                this.sourceSelectionDimensions.y,
                this.sourceSelectionDimensions.width,
                this.sourceSelectionDimensions.height,
                0,
                0,
                targetRect.width,
                targetRect.height
            );
        else
            canvas.drawImage(
                this.image,
                0,
                0,
                targetRect.width,
                targetRect.height
            );

        this.postRender(canvas);
    }
}
