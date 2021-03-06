var Explosion = function (x, y) {
  // x and y is the location of the colliding ammo
  this.x = x ;
  this.y = y ;
  this.width = 80;
  this.height = 80;
  this.halfWidth = (this.width / 2);
  this.halfHeight = (this.height / 2);
  this.srcSpriteSize = 64;
  this.spriteIndexArr = [0,1,2,3,4];
  this.frameCtr = 0;
  this.numExplosionFrames = 5;
  this.image = new Image(),
  this.image.src = "resources/images/ExplosionStrip.png";
  this.remove = false;
}

Explosion.prototype.render = function(context) {
  if (this.frameCtr < this.numExplosionFrames) {
    context.save();
    // draw explosion
    context.drawImage(
      // sprite sheet
      this.image,
      // src position on sprite sheet
      0, this.srcSpriteSize * this.frameCtr,
      // src dimensions
      this.srcSpriteSize, this.srcSpriteSize,
      // dest poition on canvas
      this.x - this.halfWidth, this.y - this.halfHeight,
      // dest dimensions
      this.width, this.height);
    context.restore();

    this.frameCtr++;
  } else {
    this.remove = true;
  }
}
