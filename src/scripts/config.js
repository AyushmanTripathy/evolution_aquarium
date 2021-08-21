//rendering stuff
const gridSize = 100;
const frameRate = 100;

//ploting
const salmon_scale = 5;
const shark_scale = 8;
const plant_scale = 1;

//drawing
const BG = "#202124";
const plant_color = "#bbb";
const salmon_color = "green";
const shark_color = "red";

//plant
const init_plant_count = 50;
const plant_generation_prob = 2;

//salmon
const init_salmon_count = 20;
const salmon_init_age = 600;
const salmon_view_radius = 5;
const salmon_health_regenration = 80;
const salmon_reproduction_cool_down = 20;
const salmon_health_cap = 100;
const salmon_velchange_prob = 2;
const salmon_starting_health = salmon_reproduction_cool_down + 1;

//shark
const init_shark_count = 4;
const shark_health_regenration = 200;
const shark_init_age = 800;
const shark_view_radius = 10;
const shark_health_cap = 250;
const shark_velchange_prob = 2;
const shark_reproduction_cool_down = 40;
const shark_starting_health = shark_reproduction_cool_down;
