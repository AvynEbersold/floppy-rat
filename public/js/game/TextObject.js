class TextObject extends GameObject {
    /**
     * @param {*} options - Takes an object with the following properties:
     * @param {string} [options.font="Monospace"] - The font to use.
     * @param {number} [options.size=30] - The font size.
     * @param {string} [options.align="left"] - The text alignment.
     */
    constructor(x, y, text, options = {}) {
        super(new Rect(x, y, 0, 0));
        this.text = text;
        this.font = options.font ?? "Monospace";
        this.size = options.size ?? 30;
        this.align = options.align ?? "left";
    }

    render(canvas) {
        canvas.font = `${this.size}px ${this.font}`;

        const targetRect = this.toPixels();
        canvas.fillText(this.text, targetRect.x, targetRect.y);
        canvas.strokeText(this.text, targetRect.x, targetRect.y);
    }
}
