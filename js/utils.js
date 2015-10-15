var utils = (function () {

var
  FONT_MENU = "20px 'Orbitron' sans-serif",
  shipConfig = [
    // medium fire, medium sized ammo, medium range, medium damage, gray ship (0)
    {
      spriteIndexArr: [0],
      omega: 3,
      speed: 3,
      firingDelay: 15,
      ammoSpec: {
        speed: 9, // multiples of 3
        size: 30,
        life: 40,
        damage: 10
      },
      text: "VINDICATOR: A balanced ship, with decent fire rate, range and damage"
    },
    // medium fire, medium sized ammo, medium range, medium damage, green ship (1)
    {
      spriteIndexArr: [1],
      omega: 3,
      speed: 3,
      firingDelay: 15,
      ammoSpec: {
        speed: 9, // multiples of 3
        size: 30,
        life: 40,
        damage: 10
      },
      text: "PHASOR: A balanced ship, with decent fire rate, range and damage"
    },
    // fast fire, big ammo, very short range, high damage red ship (2)
    {
      spriteIndexArr: [2],
      omega: 3,
      speed: 3,
      firingDelay: 2, // no of frames before next shot can be fired
      ammoSpec: {
        speed: 6, // multiples of 3
        size: 70, // ammo size in px
        life: 20, // ammo life in frames
        damage: 15 // damage dealt
      },
      text: "WARBIRD: Rapid fire and high damage but extremely short range"
    },
    // slow fire, big ammo, long range, high damage, purple ship (3)
    {
      spriteIndexArr: [3],
      omega: 3,
      speed: 3,
      firingDelay: 30,
      ammoSpec: {
        speed: 9, // multiples of 3
        size: 70,
        life: 80,
        damage: 15
      },
      text: "EXPLORER: Long ranged, high damage weapon but slow rate of fire"
    },
    // fast fire, small ammo, long range, low damage, yellow ship (4)
    {
      spriteIndexArr: [4],
      omega: 3,
      speed: 3,
      firingDelay: 5, // no of frames before next shot can be fired
      ammoSpec: {
        speed: 6, // multiples of 3
        size: 20, // ammo size in px
        life: 120, // ammo life in frames
        damage: 3 // damage dealt
      },
      text: "STINGER: Rapid fire, long ranged, light damage dealer"
    }
  ],
  currentMenuDisplay = "PLAYER 1",
  playerOneChoice = null,
  playerTwoChoice = null;


function bindKeys(playerOne, playerTwo) {
  // bind keys for playerOne
  $(document).on(
    'keydown',
    function(e) {
      if (e.keyCode === 87) playerOne.MOVE_FORWARD = true; // w
      if (e.keyCode === 83) playerOne.MOVE_BACKWARD = true; // s
      if (e.keyCode === 68) playerOne.ROTATE_CLOCK = true; // d
      if (e.keyCode === 65) playerOne.ROTATE_ANTI = true; // a
      if (e.keyCode === 81) playerOne.STRAFE_LEFT = true; // q
      if (e.keyCode === 69) playerOne.STRAFE_RIGHT = true; // e
      if (e.keyCode === 32) playerOne.fireAmmo(); // spacebar
    });
  $(document).on(
    'keyup',
    function(e) {
      if (e.keyCode === 87) playerOne.MOVE_FORWARD = false; // w
      if (e.keyCode === 83) playerOne.MOVE_BACKWARD = false; // s
      if (e.keyCode === 68) playerOne.ROTATE_CLOCK = false; // d
      if (e.keyCode === 65) playerOne.ROTATE_ANTI = false; // a
      if (e.keyCode === 81) playerOne.STRAFE_LEFT = false; // q
      if (e.keyCode === 69) playerOne.STRAFE_RIGHT = false; // e
    });
  // bind keys for playerTwo
  $(document).on(
    'keydown',
    function(e) {
      if (e.keyCode === 73) playerTwo.MOVE_FORWARD = true; // i
      if (e.keyCode === 75) playerTwo.MOVE_BACKWARD = true; // k
      if (e.keyCode === 76) playerTwo.ROTATE_CLOCK = true; // l
      if (e.keyCode === 74) playerTwo.ROTATE_ANTI = true; // j
      if (e.keyCode === 85) playerTwo.STRAFE_LEFT = true; // u
      if (e.keyCode === 79) playerTwo.STRAFE_RIGHT = true; // o
      if (e.keyCode === 8) playerTwo.fireAmmo(); // delete
    });
  $(document).on(
    'keyup',
    function(e) {
      if (e.keyCode === 73) playerTwo.MOVE_FORWARD = false; // w
      if (e.keyCode === 75) playerTwo.MOVE_BACKWARD = false; // s
      if (e.keyCode === 76) playerTwo.ROTATE_CLOCK = false; // d
      if (e.keyCode === 74) playerTwo.ROTATE_ANTI = false; // a
      if (e.keyCode === 85) playerTwo.STRAFE_LEFT = false; // q
      if (e.keyCode === 79) playerTwo.STRAFE_RIGHT = false; // e
    });
}

function hasCollided(object1, object2) {
  var
    left1 = object1.x,
    left2 = object2.x,
    right1 = object1.x + object1.width,
    right2 = object2.x + object2.width,
    top1 = object1.y,
    top2 = object2.y,
    bottom1 = object1.y + object1.height,
    bottom2 = object2.y + object2.height;

    if (bottom1 < top2) return(false);
    if (top1 > bottom2) return(false);
    if (right1 < left2) return(false);
    if (left1 > right2) return(false);
    return(true);
}

return {
  bindKeys: bindKeys,
  hasCollided: hasCollided,
  shipConfig: shipConfig,
  FONT_MENU: FONT_MENU,
  currentMenuDisplay: currentMenuDisplay,
  playerOneChoice: playerOneChoice,
  playerTwoChoice: playerTwoChoice
}

}());