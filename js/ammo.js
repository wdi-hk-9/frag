// Ammo object constructor. Argument map example given:
// argmap = {
//   x: 50,
//   y: 50,
//   angle: 0,
//   ammoIndexArr: [3],
//   speed: 2
// }
function createAmmo(argmap) {
  'use strict';
  var
    width = 40,
    height = 40,
    halfWidth = 20,
    halfHeight = 20,
    // argmap.x and argmap.y is the center of the ship. we realign the center of the
    // ammo to the ship center
    x = argmap.x - halfWidth,
    y = argmap.y - halfHeight,
    angle = argmap.angle,
    ammoIndexArr = argmap.ammoIndexArr, // position of ship on the sprite sheet
    speed = argmap.speed,
    srcPath = "resources/images/BulletStrip.png",
    srcSpriteSize = 64,
    angleInRadians = angle * Math.PI / 180,
    i = 0,
    image = new Image(),
    max_x = 2000,
    max_y = 2000,
    min_x = -width,
    min_y = -height,
    ammoLifeInFrames = 5,
    ammoLifeElapsedInFrames = 0;

  image.src = srcPath;

  function update() {
    ammoLifeElapsedInFrames++;
    x = x + speed * Math.cos(angleInRadians);
    y = y + speed * Math.sin(angleInRadians);
  }

  function xPosition(index) {
    return 0;
  }

  function yPosition(index) {
    return index;
  }

  function render(context) {
    // for rotation, translate the canvas to center of image then rotate
    angleInRadians = angle * Math.PI / 180;
    context.save();
    context.setTransform(1,0,0,1,0,0);
    context.translate(x + halfWidth, y + halfHeight);
    context.rotate(angleInRadians);

    // draw ship
    context.drawImage(
      // sprite sheet
      image,
      // src position on sprite sheet
      srcSpriteSize * xPosition(ammoIndexArr[i]), srcSpriteSize * yPosition(ammoIndexArr[i]),
      // src dimensions
      srcSpriteSize, srcSpriteSize,
      // dest poition on canvas
      (0 - halfWidth), (0 - halfHeight),
      // dest dimensions
      width, height);
    context.restore();

    i++;
    if (i >= ammoIndexArr.length) {
      i = 0;
    }
  }

  return {
    ammoLifeInFrames: ammoLifeInFrames,
    ammoLifeElapsedInFrames: ammoLifeElapsedInFrames,
    update: update,
    render: render,
    x: x,
    y: y,
    max_x: max_x,
    max_y: max_y,
    min_x: min_x,
    min_y: min_y
  }

}