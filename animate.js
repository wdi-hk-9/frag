window.addEventListener('load', function () {
  var
    // game specific parameters
    IMG_PATH = "image/GA/images/ShipStrip.png",
    FPS = 50,
    DISTANCE_PER_SECOND = 150, // in px
    ROTATE_PER_SECOND = 135, // in degrees
    SPRITE_SRC_SIZE = 128,
    spriteIndexArr = [3],
    // universal quantities
    MS_PER_SECOND = 1000,
    ANIMATION_SPEED = MS_PER_SECOND/FPS,
    // base ship straight-line velocity
    VELOCITY = Math.floor(DISTANCE_PER_SECOND/FPS),
    OMEGA = Math.floor(ROTATE_PER_SECOND/FPS),
    // initial game values for parameters
    i = 0,
    MOVE_FORWARD = false,
    MOVE_BACKWARD = false,
    ROTATE_CLOCK = false,
    ROTATE_ANTI = false,
    STRAFE_LEFT = false,
    STRAFE_RIGHT = false,
    sprite, spriteObj, theCanvas, context;


  // this generic code allows for the use of sprite strips to animate
  function xPosition(index) {
    return 0;
  }

  function yPosition(index) {
    return index;
  }

  function drawScreen() {
    var angleInRadians = spriteObj.angle * Math.PI / 180;

    if (MOVE_FORWARD) {
      spriteObj.x += spriteObj.speed * Math.cos(angleInRadians);
      spriteObj.y += spriteObj.speed * Math.sin(angleInRadians);
    };
    if (MOVE_BACKWARD) {
      spriteObj.x -= spriteObj.speed * Math.cos(angleInRadians);
      spriteObj.y -= spriteObj.speed * Math.sin(angleInRadians);
    };
    if (STRAFE_LEFT) {
      spriteObj.x += spriteObj.speed * Math.sin(angleInRadians);
      spriteObj.y -= spriteObj.speed * Math.cos(angleInRadians);
    };
    if (STRAFE_RIGHT) {
      spriteObj.x -= spriteObj.speed * Math.sin(angleInRadians);
      spriteObj.y += spriteObj.speed * Math.cos(angleInRadians);
    };
    if (ROTATE_CLOCK) spriteObj.angle += spriteObj.omega;
    if (ROTATE_ANTI) spriteObj.angle -= spriteObj.omega;

    context.fillStyle = '#000000';
    context.fillRect(0, 0, 900, 500);

    // for rotation, translate the canvas to center of image then rotate
    angleInRadians = spriteObj.angle * Math.PI / 180;
    context.save();
    context.setTransform(1,0,0,1,0,0);
    context.translate(spriteObj.x + .5 * spriteObj.width, spriteObj.y + .5 * spriteObj.height);
    context.rotate(angleInRadians);

    // draw ship
    context.drawImage(
      // sprite sheet
      spriteObj.image,
      // src position on sprite sheet
      SPRITE_SRC_SIZE * xPosition(spriteIndexArr[i]), SPRITE_SRC_SIZE * yPosition(spriteIndexArr[i]),
      // src dimensions
      SPRITE_SRC_SIZE, SPRITE_SRC_SIZE,
      // dest poition on canvas
      (0 - spriteObj.halfWidth), (0 - spriteObj.halfHeight),
      // dest dimensions
      spriteObj.width, spriteObj.height);
    context.restore();

    i++;
    if (i >= spriteIndexArr.length) {
      i = 0;
    }
  }

  function animateSprite() {
    setInterval(drawScreen, ANIMATION_SPEED);
  }

  document.addEventListener(
    'keydown',
    function(e) {
      if (e.keyCode === 87) MOVE_FORWARD = true; // w
      if (e.keyCode === 83) MOVE_BACKWARD = true; // s
      if (e.keyCode === 68) ROTATE_CLOCK = true; // d
      if (e.keyCode === 65) ROTATE_ANTI = true; // a
      if (e.keyCode === 81) STRAFE_LEFT = true; // q
      if (e.keyCode === 69) STRAFE_RIGHT = true; // e
    });

  document.addEventListener(
    'keyup',
    function(e) {
      if (e.keyCode === 87) MOVE_FORWARD = false; // w
      if (e.keyCode === 83) MOVE_BACKWARD = false; // s
      if (e.keyCode === 68) ROTATE_CLOCK = false; // d
      if (e.keyCode === 65) ROTATE_ANTI = false; // a
      if (e.keyCode === 81) STRAFE_LEFT = false; // q
      if (e.keyCode === 69) STRAFE_RIGHT = false; // e
    });

  // initialize canvas
  theCanvas = document.getElementById("canvas"),
  context = theCanvas.getContext("2d"),

  sprite = new Image();
  sprite.src = IMG_PATH;
  sprite.addEventListener('load', animateSprite);

  spriteObj = {
    image: sprite,
    x: 50,
    y: 50,
    angle: 0,
    width: 64,
    height: 64,
    halfWidth: 32,
    halfHeight: 32,
    omega: OMEGA, // 90degrees in a sec
    speed: VELOCITY // 100px in a sec
  }

});