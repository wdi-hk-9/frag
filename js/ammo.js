// Ammo object constructor. Argument map example given:

var Ammo = function (argmap) {

    // initialized from argmap
    this.width = argmap.size;
    this.height = argmap.size;
    this.ammoLifeFramesLeft = argmap.life;
    this.speed = argmap.speed;
    this.damage = argmap.damage;
    this.halfWidth = (this.width / 2),
    this.halfHeight = (this.height / 2),
    // x and y set such that bullet is initially centered on ship
    this.x = argmap.x - this.halfWidth,
    this.y = argmap.y - this.halfHeight,
    this.angle = argmap.angle,
    this.ammoIndexArr = argmap.ammoIndexArr, // position of ship on the sprite sheet

    // defaults
    this.angleInRadians = this.angle * Math.PI / 180;
    this.i = 0;
    this.max_x = 2000;
    this.max_y = 2000;
    this.min_x = -this.width;
    this.min_y = -this.height;
    this.remove = false;
    this.image = new Image();
    this.image.src = "resources/images/BulletStrip.png";
    this.srcSpriteSize = 64;
}

Ammo.prototype.update = function () {
  // remove ammo if life is up or if ammo goes off screen
  if (this.ammoLifeFramesLeft <= 0
      || this.x < this.min_x
      || this.x > this.max_x
      || this.y < this.min_y
      || this.y > this.max_y) {
    this.remove = true;
  } else {
    // decrement ammo life
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

  // draw ammo
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