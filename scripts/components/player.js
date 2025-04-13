export function createPlayer(character = 'Momo') {
  return {
    x: 100,
    y: 350,
    width: 60,
    height: 60,
    vy: 0,
    gravity: 1.5,
    jumpForce: -18,
    grounded: true,
    update() {
      this.vy += this.gravity;
      this.y += this.vy;
      if (this.y >= 350) {
        this.y = 350;
        this.vy = 0;
        this.grounded = true;
      }
    },
    jump() {
      if (this.grounded) {
        this.vy = this.jumpForce;
        this.grounded = false;
      }
    },
    draw(ctx) {
      const img = window[`${character}Img`];
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
    }
  };
}
