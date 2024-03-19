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
        canvas.translate(targetRect.x + targetRect.width / 2, targetRect.y + targetRect.height / 2);
        canvas.rotate(this.rotation);
        canvas.translate(-targetRect.width / 2, -targetRect.height / 2);
        canvas.globalAlpha = this.color.a;
    }

    postRender(canvas) {
        canvas.restore();
    }
}
