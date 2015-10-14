// Ship object constructor. posMap contains the initial starting positions
// configMap contains the ship/ammo configurations
// soundPool is the pool of HTML5 audio tags that  reference the shooting wav file for the ship

var Ship = function (posMap, configMap, soundPool) {
  // initialized from configMap
  this.x = posMap.x;
  this.y = posMap.y;
  this.angle = posMap.angle;
  this.spriteIndexArr = configMap.spriteIndexArr; // position of ship on the sprite shee;
  this.omega = configMap.omega;
  this.speed = configMap.speed;
  this.firingDelayInFrames = configMap.firingDelay;
  this.ammoSpec = configMap.ammoSpec; // ammo Size, Speed, Life, Damage
  this.soundPool = soundPool;
  // defaults
  this.width = 50;
  this.height = 50;
  this.MOVE_FORWARD = false;
  this.MOVE_BACKWARD = false;
  this.ROTATE_CLOCK = false;
  this.ROTATE_ANTI = false;
  this.STRAFE_LEFT = false;
  this.STRAFE_RIGHT = false;
  this.angleInRadians = this.angle * Math.PI / 180;
  this.i = 0;
  this.$canvas = $("#canvas");
  this.max_x = this.$canvas.width();
  this.max_y = this.$canvas.height();
  this.liveAmmo = [];
  this.framesSinceLastFired = Infinity;
  this.image = new Image();
  this.image.src = "resources/images/ShipStrip.png";
  this.srcSpriteSize = 128;
};

Ship.prototype.update = function () {
  this.framesSinceLastFired++;

  if (this.MOVE_FORWARD) {
    this.x = this.x + this.speed * Math.cos(this.angleInRadians);
    this.y = this.y + this.speed * Math.sin(this.angleInRadians);
  }
  if (this.MOVE_BACKWARD) {
    this.x = this.x - this.speed * Math.cos(this.angleInRadians);
    this.y = this.y - this.speed * Math.sin(this.angleInRadians);
  }
  if (this.STRAFE_LEFT) {
    this.x = this.x + this.speed * Math.sin(this.angleInRadians);
    this.y = this.y - this.speed * Math.cos(this.angleInRadians);
  }
  if (this.STRAFE_RIGHT) {
    this.x = this.x - this.speed * Math.sin(this.angleInRadians);
    this.y = this.y + this.speed * Math.cos(this.angleInRadians);
  }
  if (this.ROTATE_CLOCK) { this.angle += this.omega; }
  if (this.ROTATE_ANTI) { this.angle -= this.omega; }

  // code to handle collision with the sides
  if (this.x < 0) this.x = 0;
  if (this.x > this.max_x - this.width) this.x = this.max_x - this.width;
  if (this.y < 0) this.y = 0;
  if (this.y > this.max_y - this.height) this.y = this.max_y - this.height;

  // filter for live ammo
  this.liveAmmo = this.liveAmmo
  .filter(function (e) {
    return (!e.remove);
  })

  // update position of all live ammo
  this.liveAmmo
  .forEach(function (e) {
    e.update();
  });
};

Ship.prototype.xPosition = function (index) {
    return 0;
};

Ship.prototype.yPosition = function (index) {
    return index;
};

Ship.prototype.render = function (context) {
  // for rotation, translate the canvas to center of image then rotate
  this.angleInRadians = this.angle * Math.PI / 180;
  context.save();
  context.setTransform(1,0,0,1,0,0);
  context.translate(this.x + this.width / 2, this.y + this.height / 2);
  context.rotate(this.angleInRadians);

  // draw ship
  context.drawImage(
    // sprite sheet
    this.image,
    // src position on sprite sheet
    this.srcSpriteSize * this.xPosition(this.spriteIndexArr[this.i]),
    this.srcSpriteSize * this.yPosition(this.spriteIndexArr[this.i]),
    // src dimensions
    this.srcSpriteSize, this.srcSpriteSize,
    // dest poition on canvas
    (0 - this.width / 2), (0 - this.height/2),
    // dest dimensions
    this.width, this.height);
  context.restore();

  this.i++;
  if (this.i >= this.spriteIndexArr.length) {
    this.i = 0;
  }

  this.liveAmmo
  .forEach( function(e) {
    e.render(context);
  });
};

Ship.prototype.fireAmmo = function () {
  if (this.framesSinceLastFired > this.firingDelayInFrames) {

    var ammo = new Ammo({
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      angle: this.angle,
      ammoIndexArr: this.spriteIndexArr,
      speed: this.ammoSpec.speed,
      size: this.ammoSpec.size,
      life: this.ammoSpec.life,
      damage: this.ammoSpec.damage
    });

    this.liveAmmo.push(ammo);
    this.soundPool.play();
    this.framesSinceLastFired = 0;
  }
}