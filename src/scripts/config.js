//rendering stuff
const gridSize = 100;
const frameRate = 200;

const BG = "#202124";
const plant_color = "#bbb";
const salmon_color = "green";
const shark_color = "red";

//plant
const init_plant_count = 30;
const plant_generation_prob = 2;

//salmon
const init_salmon_count = 10;
const salmon_reproduction_cool_down = 20;
const salmon_health_cap = 100;
const salmon_velchange_prob = 2;
const salmon_starting_health = salmon_reproduction_cool_down + 1;

//shark
const init_shark_count = 2;
const shark_health_cap = 150;
const shark_velchange_prob = 2;
const shark_reproduction_cool_down = 50;
