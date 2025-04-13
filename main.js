// main.js
import { createGame } from './scripts/game.js';

window.onload = () => {
  createGame();
};

// scripts/game.js
import { loadAssets } from './utils/assets.js';
import { createPlayer } from './components/player.js';
import { createObstacle } from './components/obstacle.js';
import { createUI } from './components/ui.js';

let canvas, ctx;
let player;
let obstacles = [];
let distance = 0;
let gameSpeed = 5;
let day = true;
let availableCharacters = ['Momo', 'ElBana', 'Especial', 'Davo', 'MomoSkin2'];
let unlockedCharacters = ['Momo', 'ElBana', 'Especial', 'Davo'];
let selectedCharacter = 'Momo';

export function createGame() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 450;

  loadAssets().then(() => {
    player = createPlayer(selectedCharacter);
    createUI(canvas);
    generateObstacles();
    gameLoop();
  });
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo dinámico día/noche
  if (distance % 2000 < 1000) {
    ctx.fillStyle = '#b0e0e6'; // día
    day = true;
  } else {
    ctx.fillStyle = '#191970'; // noche
    day = false;
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  player.draw(ctx);

  for (let obs of obstacles) {
    obs.update(gameSpeed);
    obs.draw(ctx);
  }

  distance += 1;
  drawFantasmometro();
  manageObstacles();

  // Desbloqueo de personaje por nivel medio
  if (distance > 1500 && !unlockedCharacters.includes('MomoSkin2')) {
    unlockedCharacters.push('MomoSkin2');
  }
}

function drawFantasmometro() {
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px monospace';
  ctx.fillText(`FANTASMÓMETRO: ${distance}`, 10, 30);
}

function generateObstacles() {
  obstacles = [];
  for (let i = 0; i < 5; i++) {
    obstacles.push(createObstacle({
      x: 800 + i * 300 + Math.random() * 150,
      y: Math.random() > 0.5 ? 350 : 300,
      width: 40 + Math.random() * 40,
      height: 40 + Math.random() * 40,
      color: getRandomColor()
    }));
  }
}

function manageObstacles() {
  if (obstacles.length < 5) {
    obstacles.push(createObstacle({
      x: canvas.width + Math.random() * 300,
      y: Math.random() > 0.5 ? 350 : 300,
      width: 40 + Math.random() * 40,
      height: 40 + Math.random() * 40,
      color: getRandomColor()
    }));
  }
  obstacles = obstacles.filter(o => o.x + o.width > 0);
}

function getRandomColor() {
  const colors = ['#e63946', '#f1fa8c', '#8ecae6', '#ffb703', '#fb8500'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// utils/assets.js
export async function loadAssets() {
  const characterImages = ['Momo', 'ElBana', 'Especial', 'Davo', 'MomoSkin2'];
  for (const name of characterImages) {
    const img = new Image();
    img.src = `./assets/${name}.png`;
    await new Promise(resolve => {
      img.onload = resolve;
    });
    window[`${name}Img`] = img;
  }
}

// components/player.js
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

// components/obstacle.js
export function createObstacle(config) {
  return {
    x: config.x,
    y: config.y,
    width: config.width,
    height: config.height,
    color: config.color,
    update(speed) {
      this.x -= speed;
    },
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
}

// components/ui.js
export function createUI(canvas) {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      window.player.jump();
    }
  });
}
const bgMusic = new Audio('./assets/musica.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;
bgMusic.play();
