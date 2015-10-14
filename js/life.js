var Life = function (playerNumber) {

  this.playerNumber = playerNumber;
  this.MAXLIFE = 100;
  this.LIFEBAR_INIT_WIDTH = 300;
  this.LIFEBAR_HEIGHT = 20;
  this.GREEN = '#00FF00';
  this.AMBER = '#FD731F';
  this.RED = '#FF0000';
  this.P2_X_POSITION = 900 - this.LIFEBAR_INIT_WIDTH;

  // initialize score
  this.score = this.MAXLIFE;
  this.lifebarWidth = this.LIFEBAR_INIT_WIDTH;
  this.lifebarColor = this.GREEN;
};

Life.prototype.update = function (damage) {
  this.score -= damage;
  this.score = Math.max(0, this.score);
  if (this.score < 50) this.lifebarColor = this.AMBER;
  if (this.score < 20) this.lifebarColor = this.RED;

  this.lifebarWidth = this.score/this.MAXLIFE * this.LIFEBAR_INIT_WIDTH;
};

Life.prototype.render = function(context) {
  if (this.playerNumber === 1) {
    context.fillStyle = this.lifebarColor;
    context.fillRect(0, 0, this.lifebarWidth, this.LIFEBAR_HEIGHT);
  } else {
    context.fillStyle = this.lifebarColor;
    context.fillRect(this.P2_X_POSITION, 0, this.lifebarWidth, this.LIFEBAR_HEIGHT);
  }
};