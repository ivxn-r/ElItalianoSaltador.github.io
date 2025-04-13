export function createObstacle({ x, y, width, height, color }) {
  return {
    x,
    y,
    width,
    height,
    color,
    update(speed) {
      this.x -= speed;
    },
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
}
