const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const plant_population = document.querySelector("#plant_population");
const salmon_population = document.querySelector("#salmon_population");
const shark_population = document.querySelector("#shark_population");

const blockSize = canvas.height / gridSize;
let count = {};

let sys;
let map;

let running = false;

init();
function init() {
  map = makeMap(gridSize, null);

  sys = new ecoSystem();

  for (let i = 0; i < init_plant_count; i++) {
    sys.newplant();
  }
  for (let i = 0; i < init_salmon_count; i++) {
    sys.newSalmon();
  }

  //init count
  count.plant = init_plant_count;
  count.salmon = init_salmon_count;
  count.shark = init_shark_count;

  running = true;

  draw(sys);
  console.log(sys);

  loop();
}

async function loop() {
  if (!running) return;

  //check if everyone died
  if (sys.salmons.length <= 0) return console.log("everyone dead");
  if (chooseRandom(plant_generation_prob)) sys.newplant();

  await sleep(frameRate);

  //logic
  sys.salmons.forEach((salmon) => {
    salmon.frame();
  });

  sys.sharks.forEach((shark) => {
    shark.frame();
  });

  //rendering
  draw(sys);
  shark_population.innerHTML = count.shark;
  salmon_population.innerHTML = count.salmon;
  plant_population.innerHTML = count.plant;

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

  //draw plants
  ctx.fillStyle = plant_color;
  sys.plants.forEach((plant) => {
    if (plant) {
      ctx.fillRect(
        plant.x * blockSize,
        plant.y * blockSize,
        blockSize,
        blockSize
      );
    }
  });

  //draw salmons
  ctx.fillStyle = salmon_color;
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
