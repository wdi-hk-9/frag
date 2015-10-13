// Ship object constructor. Argument map example given:
// argmap = {
//   x: 50,
//   y: 50,
//   angle: 0,
//   spriteIndexArr: [3],
//   omega: 3,
//   speed: 2,
//   isPlayerOne: true
// }
function createShip (argmap) {
  'use strict';
  var
    x = argmap.x,
    y = argmap.y,
    angle = argmap.angle,
    spriteIndexArr = argmap.spriteIndexArr, // position of ship on the sprite sheet
    omega = argmap.omega,
    speed = argmap.speed,
    isPlayerOne = argmap.isPlayerOne,
    srcPath = "resources/images/ShipStrip.png",
    srcSpriteSize = 128,
    width = 64,
    height = 64,
    halfWidth = 32,
    halfHeight = 32,
    MOVE_FORWARD = false,
    MOVE_BACKWARD = false,
    ROTATE_CLOCK = false,
    ROTATE_ANTI = false,
    STRAFE_LEFT = false,
    STRAFE_RIGHT = false,
    angleInRadians = angle * Math.PI / 180,
    i = 0,
    image = new Image(),
    $canvas = $("#canvas"),
    max_x = $canvas.width(),
    max_y = $canvas.height(),
    liveAmmo = [],
    firingDelayInFrames = 10,
    framesSinceLastFired = Infinity;


  image.src = srcPath;


  function update() {
    var new_x, new_y;

    framesSinceLastFired++;

    if (MOVE_FORWARD) {
      x = x + speed * Math.cos(angleInRadians);
      y = y + speed * Math.sin(angleInRadians);
    }
    if (MOVE_BACKWARD) {
      x = x - speed * Math.cos(angleInRadians);
      y = y - speed * Math.sin(angleInRadians);
    }
    if (STRAFE_LEFT) {
      x = x + speed * Math.sin(angleInRadians);
      y = y - speed * Math.cos(angleInRadians);
    }
    if (STRAFE_RIGHT) {
      x = x - speed * Math.sin(angleInRadians);
      y = y + speed * Math.cos(angleInRadians);
    }
    // code to handle collision with the sides
    if (x < 0) x = 0;
    if (x > max_x - width) x = max_x - width;
    if (y < 0) y = 0;
    if (y > max_y - height) y = max_y - height;
    if (ROTATE_CLOCK) { angle += omega; }
    if (ROTATE_ANTI) { angle -= omega; }

    // update the liveAmmo array
    liveAmmo = liveAmmo
      .filter(function(e) {
        // remove all ammo that have expired
        return e.ammoLifeElapsedInFrames <= e.ammoLifeInFrames;
      })
      .filter(function(e) {
        // remove all ammo that have travelled beyond screen
        return e.x < e.max_x && e.x > e.min_x && e.y < e.max_y && e.y > e.min_y;
      });

    // update the positions of each live ammo object
    liveAmmo
      .forEach(function(e) {
        e.update();
      })
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
      srcSpriteSize * xPosition(spriteIndexArr[i]), srcSpriteSize * yPosition(spriteIndexArr[i]),
      // src dimensions
      srcSpriteSize, srcSpriteSize,
      // dest poition on canvas
      (0 - halfWidth), (0 - halfHeight),
      // dest dimensions
      width, height);
    context.restore();

    i++;
    if (i >= spriteIndexArr.length) {
      i = 0;
    }

    liveAmmo
    .forEach(function(e) {
      e.render(context);
    });
  }

  function setKeys() {
    if (isPlayerOne) {
      $(document).on(
        'keydown',
        function(e) {
          if (e.keyCode === 87) MOVE_FORWARD = true; // w || i
          if (e.keyCode === 83) MOVE_BACKWARD = true; // s || k
          if (e.keyCode === 68) ROTATE_CLOCK = true; // d || l
          if (e.keyCode === 65) ROTATE_ANTI = true; // a || j
          if (e.keyCode === 81) STRAFE_LEFT = true; // q || u
          if (e.keyCode === 69) STRAFE_RIGHT = true; // e || o
          if (e.keyCode === 32) fireAmmo(); // spacebar
        });
      $(document).on(
        'keyup',
        function(e) {
          if (e.keyCode === 87) MOVE_FORWARD = false; // w
          if (e.keyCode === 83) MOVE_BACKWARD = false; // s
          if (e.keyCode === 68) ROTATE_CLOCK = false; // d
          if (e.keyCode === 65) ROTATE_ANTI = false; // a
          if (e.keyCode === 81) STRAFE_LEFT = false; // q
          if (e.keyCode === 69) STRAFE_RIGHT = false; // e
        });
    } else {
      $(document).on(
        'keydown',
        function(e) {
          if (e.keyCode === 73) MOVE_FORWARD = true; // i
          if (e.keyCode === 75) MOVE_BACKWARD = true; // k
          if (e.keyCode === 76) ROTATE_CLOCK = true; // l
          if (e.keyCode === 74) ROTATE_ANTI = true; // j
          if (e.keyCode === 85) STRAFE_LEFT = true; // u
          if (e.keyCode === 79) STRAFE_RIGHT = true; // o
          if (e.keyCode === 8) fireAmmo(); // delete
        });
      $(document).on(
        'keyup',
        function(e) {
          if (e.keyCode === 73) MOVE_FORWARD = false; // w
          if (e.keyCode === 75) MOVE_BACKWARD = false; // s
          if (e.keyCode === 76) ROTATE_CLOCK = false; // d
          if (e.keyCode === 74) ROTATE_ANTI = false; // a
          if (e.keyCode === 85) STRAFE_LEFT = false; // q
          if (e.keyCode === 79) STRAFE_RIGHT = false; // e
        });
    }
  }

  function fireAmmo() {
    // only allow fire if the delay between shots has been met
    if (framesSinceLastFired > firingDelayInFrames) {
      console.log(framesSinceLastFired);
      var ammo = createAmmo({
          x: x + halfWidth,
          y: y + halfHeight,
          angle: angle,
          ammoIndexArr: spriteIndexArr, // ammo sprite positions correspond to ship sprite positions
          speed: (100 * speed)
        });
      liveAmmo.push(ammo);
      framesSinceLastFired = 0;
    }
  }

  return {
    update: update,
    render: render,
    setKeys: setKeys,
    fireAmmo: fireAmmo
  };
}