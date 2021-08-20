const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const gridSize = 100;
const blockSize = canvas.height / gridSize;

const BG = "#202124";
let sys;
let map;

const frameRate = 200;
let running = false;

init(40);
function init(count) {
  map = makeMap(gridSize, null);

  sys = new ecoSystem();

  for (let i = 0; i < count; i++) {
    sys.newFood();
  }
  for (let i = 0; i < 5; i++) {
    sys.newSalmon();
  }

  running = true;

  draw(sys);
  console.log(sys);

  loop();
}

async function loop() {
  if (!running) return;

  await sleep(frameRate);
  console.log("loop");

  //logic
  sys.salmons.forEach((salmon) => {
    salmon.frame();
    if (chooseRandom(8)) sys.newFood();
  });

  draw(sys);
  return loop();
}

function makeMap(size, def) {
  let arr = [];

  for (let i = 0; i < size; i++) {
    arr[i] = new Array(size).fill(def);
  }

  return arr;
}

function draw(sys) {
  //reset
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //draw foods
  ctx.fillStyle = "green";
  sys.foods.forEach((food) => {
    if (food) {
      ctx.fillRect(
        food.x * blockSize,
        food.y * blockSize,
        blockSize,
        blockSize
      );
    }
  });

  //draw salmons
  ctx.fillStyle = "red";
  sys.salmons.forEach((salmon) => {
    if (salmon) {
      ctx.fillRect(
        salmon.x * blockSize,
        salmon.y * blockSize,
        blockSize,
        blockSize
      );
    }
  });
}

function random(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function chooseRandom(prob) {
  if (!Math.round(Math.random() * prob)) return 1;
  return 0;
}

function stop() {
  running = false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
