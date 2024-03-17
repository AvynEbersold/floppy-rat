class VisibleObject extends GameObject {
    /** In radians */
    rotation = 0;

    constructor(rect, color = new Color(255, 255, 255)) {
        super(rect);
        this.color = color;
    }

    render(canvas) {
        this.preRender(canvas);

        const targetRect = this.toPixels();

        canvas.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b})`;

        canvas.fillRect(
            targetRect.x,
            targetRect.y,
            targetRect.width,
            targetRect.height
        );

        this.postRender(canvas);
    }

    preRender(canvas) {
        const targetRect = this.toPixels();

        canvas.save();
        canvas.translate(targetRect.x, targetRect.y);
        canvas.rotate(this.rotation);
        canvas.globalAlpha = this.color.a;
    }

    postRender(canvas) {
        canvas.restore();
    }
}
