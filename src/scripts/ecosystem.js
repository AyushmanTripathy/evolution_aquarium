function ecoSystem() {
  this.plants = [];
  this.salmons = [];
  this.sharks = [];

  this.newplant = () => {
    const plant = new Plant();
    map[plant.x][plant.y] = makeGridCell("plant", plant, this.plants.length);
    this.plants.push(plant);
  };

  this.newSalmon = () => {
    const salmon = new Salmon();

    //check move for change
    map[salmon.x][salmon.y] = makeGridCell(
      "salmon",
      salmon,
      this.plants.length
    );
    this.salmons.push(salmon);
  };
}

function Plant() {
  this.x = random(0, gridSize - 1);
  this.y = random(0, gridSize - 1);
}

function Salmon(genes) {
  this.healthCap = salmon_health_cap;
  this.health = salmon_starting_health;
  this.viewRadius = 5;
  this.reproductionCoolDown = salmon_reproduction_cool_down;

  this.x = random(0, gridSize - 1);
  this.y = random(0, gridSize - 1);
  this.vel = {
    x: chooseRandom(1),
    y: chooseRandom(1),
  };

  //things to do per frame;
  this.frame = () => {
    //reduce health
    this.health--;
    if (this.health <= 0) return this.die();

    this.move();
    const found = this.checkEnv();

    //found something
    if (found) {
      switch (found.type) {
        case "plant":
          this.eat(found);
          break;
        case "salmon":
          this.reproduce(found);
          break;
      }
    }

    if (this.reproductionCoolDown != 0) this.reproductionCoolDown--;
    if (chooseRandom(salmon_velchange_prob)) this.changeVel();
  };

  this.checkEnv = () => {
    x = this.x;
    y = this.y;

    for (let i = 1; i <= this.viewRadius; i++) {
      if (map[x - i] != undefined && map[x + i] != undefined) {
        if (map[x][y - i]) return map[x][y - i];
        if (map[x][y + i]) return map[x][y + i];
        if (map[x - i][y]) return map[x - i][y];
        if (map[x + i][y]) return map[x + i][y];

        //corners
        if (map[x - i][y - i]) return map[x - i][y - i];
        if (map[x - i][y + i]) return map[x - i][y + i];
        if (map[x + i][y - i]) return map[x + i][y - i];
        if (map[x + i][y + i]) return map[x + i][y + i];
      }
    }
    return false;
  };

  this.move = () => {
    map[this.x][this.y] = 0;
    this.x += this.vel.x;
    this.y += this.vel.y;

    // teleport to other side
    // if they cross boundry
    if (this.x >= gridSize - 1) this.x = 1;
    else if (this.x <= 0) this.x = gridSize - 2;

    if (this.y >= gridSize - 1) this.y = 1;
    else if (this.y <= 0) this.y = gridSize - 2;

    map[this.x][this.y] = makeGridCell("salmon", this);
  };

  this.changeVel = () => {
    this.vel.x = random(-1, 1);
    this.vel.y = random(-1, 1);
  };

  this.eat = (plant) => {
    sys.plants[plant.index] = null;
    console.log("eated");
    map[plant.x][plant.y] = null;
    this.health = this.healthCap;
  };

  this.die = () => {
    map[this.x][this.y] = null;
    const index = sys.salmons.indexOf(this);
    sys.salmons.splice(index, 1);
  };

  this.reproduce = (found) => {
    if (this.reproductionCoolDown != 0) return;
    this.reproductionCoolDown = salmon_reproduction_cool_down;
    sys.newSalmon();
  };
}

function makeGridCell(type, thing, index) {
  return {
    type,
    x: thing.x,
    y: thing.y,
    index,
  };
}
