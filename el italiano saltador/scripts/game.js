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

  if (distance % 2000 < 1000) {
    ctx.fillStyle = '#b0e0e6'; 
    day = true;
  } else {
    ctx.fillStyle = '#191970'; 
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
