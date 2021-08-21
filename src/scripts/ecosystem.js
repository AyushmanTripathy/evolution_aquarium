function ecoSystem() {
  this.plants = [];
  this.salmons = [];
  this.sharks = [];

  this.newplant = () => {
    count.plant++;

    const plant = new Plant();
    map[plant.x][plant.y] = makeGridCell("plant", plant, this.plants.length);
    this.plants.push(plant);
  };

  this.newSalmon = () => {
    count.salmon++;

    const salmon = new Salmon();
    salmon.index = this.salmons.length;

    //check move for change
    map[salmon.x][salmon.y] = makeGridCell("salmon", salmon, salmon.index);
    this.salmons.push(salmon);
  };

  this.newShark = () => {
    count.shark++;

    const shark = new Shark();

    //check move for change
    map[shark.x][shark.y] = makeGridCell("shark", shark);
    this.sharks.push(shark);
  };
}

function Plant() {
  this.x = random(0, gridSize - 1);
  this.y = random(0, gridSize - 1);
}

function Shark() {
  this.healthCap = shark_health_cap;
  this.age = shark_init_age;
  this.health = shark_starting_health;
  this.viewRadius = shark_view_radius;
  this.reproductionCoolDown = shark_reproduction_cool_down;

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
    this.age--;
    if (this.age <= 0) return this.die();


    this.move();
    const found = this.checkEnv();

    //found something
    if (found) {
      switch (found.type) {
        case "salmon":
          this.eat(found);
          break;
        case "shark":
          this.reproduce();
          break;
      }
    }

    if (this.reproductionCoolDown != 0) this.reproductionCoolDown--;
    if (chooseRandom(shark_velchange_prob)) this.changeVel();
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

  this.changeVel = () => {
    this.vel.x = random(-1, 1);
    this.vel.y = random(-1, 1);
  };

  this.move = () => {
    map[this.x][this.y] = null;
    this.x += this.vel.x;
    this.y += this.vel.y;

    // teleport to other side
    // if they cross boundry
    if (this.x >= gridSize - 1) this.x = 1;
    else if (this.x <= 0) this.x = gridSize - 2;

    if (this.y >= gridSize - 1) this.y = 1;
    else if (this.y <= 0) this.y = gridSize - 2;

    map[this.x][this.y] = makeGridCell("shark", this);
  };

  this.eat = (salmon) => {
    count.salmon--;

    //console.log(salmon);

    sys.salmons[salmon.index] = null;
    console.log("hunted");
    map[salmon.x][salmon.y] = null;

    this.health = this.healthCap;
  };

  this.die = () => {
    map[this.x][this.y] = null;
    const index = sys.sharks.indexOf(this);
    sys.sharks.splice(index, 1);

    count.shark--;
  };

  this.reproduce = () => {
    if (this.reproductionCoolDown != 0) return;
    this.reproductionCoolDown = shark_reproduction_cool_down;
    sys.newShark();
  };
}

function Salmon() {
  this.healthCap = salmon_health_cap;
  this.health = salmon_starting_health;
  this.viewRadius = salmon_view_radius;
  this.age = salmon_init_age;
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
    this.age--;
    if (this.age <= 0) return this.die();

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
    map[this.x][this.y] = null;
    this.x += this.vel.x;
    this.y += this.vel.y;

    // teleport to other side
    // if they cross boundry
    if (this.x >= gridSize - 1) this.x = 1;
    else if (this.x <= 0) this.x = gridSize - 2;

    if (this.y >= gridSize - 1) this.y = 1;
    else if (this.y <= 0) this.y = gridSize - 2;

    map[this.x][this.y] = makeGridCell("salmon", this, this.index);
  };

  this.changeVel = () => {
    this.vel.x = random(-1, 1);
    this.vel.y = random(-1, 1);
  };

  this.eat = (plant) => {
    count.plant--;

    sys.plants[plant.index] = null;
    console.log("eated");
    map[plant.x][plant.y] = null;
    this.health = this.healthCap;
  };

  this.die = () => {
    count.salmon--;

    sys.salmons[this.index] = null;
    map[this.x][this.y] = null;
  };

  this.reproduce = () => {
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
