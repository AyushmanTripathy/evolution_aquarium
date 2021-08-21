const canvas = document.querySelector("#ecosystem");
const chart = document.querySelector("#population_chart");
const chartCtx = chart.getContext("2d");
const ctx = canvas.getContext("2d");
const plant_population = document.querySelector("#plant_population");
const salmon_population = document.querySelector("#salmon_population");
const shark_population = document.querySelector("#shark_population");

const blockSize = canvas.height / gridSize;
let count = {};

let sys;
let map;

let running = false;
let plotingVars;

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

  for (let i = 0; i < init_shark_count; i++) {
    sys.newShark();
  }

  //init count
  count.plant = init_plant_count;
  count.salmon = init_salmon_count;
  count.shark = init_shark_count;

  //init chart
  initPlot();

  running = true;

  draw(sys);
  console.log(sys);

  loop();
}

async function loop() {
  if (!running) return;

  //check if everyone died
  if (chooseRandom(plant_generation_prob)) sys.newplant();

  await sleep(frameRate);

  //logic
  sys.salmons.forEach((salmon) => {
    if (salmon) salmon.frame();
  });

  sys.sharks.forEach((shark) => {
    shark.frame();
  });

  plot(count.salmon, count.shark, count.plant);

  //rendering
  draw(sys);
  shark_population.innerHTML = count.shark;
  salmon_population.innerHTML = count.salmon;
  plant_population.innerHTML = count.plant;

  if (count.shark == 0)
    if (count.salmon == 0) return console.log("everyone died");

  return loop();
}

function initPlot() {
  chartCtx.lineWidth = 1;

  plotingVars = {
    chartY: 0,
    salmon: count.salmon,
    shark: count.shark,
    plant: count.plant,
  };
}

function plot(salmonCount, sharkCount, plantCount) {
  if (plotingVars.chartY >= chart.width) {
    plotingVars.chartY = 0;
    chartCtx.fillStyle = BG;
    chartCtx.fillRect(0, 0, chart.width, chart.height);

    chartCtx.closePath();
    chartCtx.beginPath();
  }

  plotEach("salmon", salmonCount, salmon_scale, salmon_color);

  plotEach("shark", sharkCount, shark_scale, shark_color);

  plotEach("plant", plantCount, plant_scale, plant_color);

  plotingVars.salmon = count.salmon;
  plotingVars.shark = count.shark;
  plotingVars.plant = count.plant;

  plotingVars.chartY += 1;
}

function plotEach(type, current, scale, color) {
  chartCtx.strokeStyle = color;

  chartCtx.beginPath();

  const prevPos = chart.height - plotingVars[type] * scale;
  chartCtx.moveTo(plotingVars.chartY - 1, prevPos);

  //plorting
  current = chart.height - current * scale;

  chartCtx.lineTo(plotingVars.chartY, current);
  chartCtx.stroke();

  chartCtx.closePath();
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

  //draw sharks
  ctx.fillStyle = shark_color;
  sys.sharks.forEach((shark) => {
    if (shark) {
      ctx.fillRect(
        shark.x * blockSize,
        shark.y * blockSize,
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
function makeMap(size, def) {
  let arr = [];

  for (let i = 0; i < size; i++) {
    arr[i] = new Array(size).fill(def);
  }

  return arr;
}
