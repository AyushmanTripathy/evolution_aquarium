function ecoSystem() {
  this.foods = [];
  this.salmons = [];

  this.newFood = () => {
    const food = new Food();
    map[food.x][food.y] = makeGridCell("food", food, this.foods.length);
    this.foods.push(food);
  };

  this.newSalmon = () => {
    const salmon = new Salmon();

    //check move for change
    map[salmon.x][salmon.y] = makeGridCell("salmon", salmon, this.foods.length);
    this.salmons.push(salmon);
  };
}

function Food() {
  this.x = random(0, gridSize - 1);
  this.y = random(0, gridSize - 1);
}

function Salmon(genes) {
  this.healthCap = 100;
  this.health = 100;
  this.viewRadius = 5;

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
        case "food":
          this.eat(found);
          break;
        case "salmon":
          break;
      }
    }
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

  this.eat = (food) => {
    sys.foods[food.index] = null;
    console.log("eaten", food);
    map[food.x][food.y] = null;
    this.health = this.healthCap;
  };

  this.die = () => {
    console.log("dead", this);
    map[this.x][this.y] = null;
    const index = sys.salmons.indexOf(this);
    sys.salmons.splice(index, 1);
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
