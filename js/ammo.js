// Ammo object constructor. Argument map example given:

var Ammo = function (x, y, speed, angle, ammoIndexArr) {

    this.width = 100,
    this.height = 100,
    this.ammoLifeFramesLeft = 30,

    this.halfWidth = (this.width / 2),
    this.halfHeight = (this.height / 2),
    this.srcPath = "resources/images/BulletStrip.png",
    this.srcSpriteSize = 64,

    // x and y provided as arguments denote the center of the ship. we realign the center of the
    // ammo to the ship center
    this.x = x - this.halfWidth,
    this.y = y - this.halfHeight,
    this.angle = angle,
    this.ammoIndexArr = ammoIndexArr, // position of ship on the sprite sheet
    this.speed = 2 * speed,
    this.angleInRadians = this.angle * Math.PI / 180,
    this.i = 0,
    this.image = new Image(),
    this.max_x = 2000,
    this.max_y = 2000,
    this.min_x = -this.width,
    this.min_y = -this.height,
    this.remove = false;

  this.image.src = this.srcPath;
}

Ammo.prototype.update = function () {
  if (this.ammoLifeFramesLeft <= 0
      || this.x < this.min_x
      || this.x > this.max_x
      || this.y < this.min_y
      || this.y > this.max_y) {
    this.remove = true;
  } else {
    this.ammoLifeFramesLeft--;
    this.x = this.x + this.speed * Math.cos(this.angleInRadians);
    this.y = this.y + this.speed * Math.sin(this.angleInRadians);
  }
}

Ammo.prototype.xPosition = function (index) {
  return 0;
}

Ammo.prototype.yPosition = function (index) {
  return index;
}

Ammo.prototype.render = function (context) {
  // for rotation, translate the canvas to center of image then rotate
  this.angleInRadians = this.angle * Math.PI / 180;
  context.save();
  context.setTransform(1,0,0,1,0,0);
  context.translate(this.x + this.halfWidth, this.y + this.halfHeight);
  context.rotate(this.angleInRadians);

  // draw ship
  context.drawImage(
    // sprite sheet
    this.image,
    // src position on sprite sheet
    this.srcSpriteSize * this.xPosition(this.ammoIndexArr[this.i]),
    this.srcSpriteSize * this.yPosition(this.ammoIndexArr[this.i]),
    // src dimensions
    this.srcSpriteSize, this.srcSpriteSize,
    // dest poition on canvas
    (0 - this.halfWidth), (0 - this.halfHeight),
    // dest dimensions
    this.width, this.height);
  context.restore();

  this.i++;
  if (this.i >= this.ammoIndexArr.length) this.i = 0;
}
