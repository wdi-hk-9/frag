/*global window, console, document, Image
*/

// Game object constructor
// "Revealing module pattern"
function createGame () {
  'use strict';
  var
    currentGameStateFunction, playerOne, playerTwo,
    theCanvas = $("#canvas").get(0),
    context = theCanvas.getContext("2d"),
    //application states
    GAME_STATE_TITLE = 0,
    GAME_STATE_INIT = 1,
    GAME_STATE_PLAY = 2,
    GAME_STATE_GAME_OVER = 3,
    explosionArr = [],
    // game level parameters
    BASE = {
      FPS: 50,
      DISTANCE_PER_SECOND: 150, // px moved in 1sec
      ROTATE_PER_SECOND: 135, // angular velocity in degrees/sec
      CANVAS_BACKGROUND: '#000000',
      CANVAS_WIDTH: 900,
      CANVAS_HEIGHT: 500,
      MS_PER_SECOND: 1000
    };
    BASE.ANIMATION_SPEED = BASE.MS_PER_SECOND/BASE.FPS;
    BASE.VELOCITY = Math.floor(BASE.DISTANCE_PER_SECOND/BASE.FPS);
    BASE.OMEGA = Math.floor(BASE.ROTATE_PER_SECOND/BASE.FPS);

  // gameloop functions corresponding to application states
  function gameStateTitle() {
    // draw background and text
    context.fillStyle = BASE.CANVAS_BACKGROUND;
    context.fillRect(0, 0, BASE.CANVAS_WIDTH, BASE.CANVAS_HEIGHT);
    context.fillStyle = '#ffffff';
    context.font = '20px sans-serif';
    context.textBaseline = 'top';
    context.fillText ("FRAG", 50, 90);
    context.fillText ("Press Space To Play", 50, 200);

    window.setTimeout(function(){
      switchGameState(GAME_STATE_INIT);
    }, 1000);
  }

  function gameStateInit() {
    context.fillStyle = BASE.CANVAS_BACKGROUND;
    context.fillRect(0, 0, BASE.CANVAS_WIDTH, BASE.CANVAS_HEIGHT);
    context.fillStyle = '#ffffff';
    context.font = '20px sans-serif';
    context.textBaseline = 'top';
    context.fillText ("Initializing", 50, 90);

    // initialize ship objects
    playerOne = new Ship(utils.shipConfig[0]);
    playerTwo = new Ship(utils.shipConfig[1]);

    // bind game keys
    utils.bindKeys(playerOne, playerTwo);

    setTimeout(function() {
      switchGameState(GAME_STATE_PLAY);
    },2000);
  }

  function gameStatePlay() {
    context.fillStyle = BASE.CANVAS_BACKGROUND;
    context.fillRect(0, 0, BASE.CANVAS_WIDTH, BASE.CANVAS_HEIGHT);
    playerOne.update();
    playerOne.render(context);
    playerTwo.update();
    playerTwo.render(context);
    checkCollision(playerOne, playerTwo);
  }

  function gameStateGameOver() {
    console.log("appStateGameOver");
  }

  // function to switch application states
  function switchGameState(newState) {
    switch (newState) {
      case GAME_STATE_TITLE:
        currentGameStateFunction = gameStateTitle;
        break;
      case GAME_STATE_INIT:
        currentGameStateFunction = gameStateInit;
        break;
      case GAME_STATE_PLAY:
        currentGameStateFunction = gameStatePlay;
        break;
      case GAME_STATE_GAME_OVER:
        currentGameStateFunction = gameStateGameOver;
        break;
    }
  }

  // this function checks if any of player i's ammo has collided with
  // player j. If so, it sets the "remove" flag on the ammo to "true"
  // and produces an explosion at the location of the ammo
  function checkCollision(player1, player2) {
    playerOne.liveAmmo
      .filter(function (e) {
        return utils.hasCollided(e, playerTwo);
      })
      .forEach(function (e) {
        // explosion at the center of ammo
        explosionArr.push(new Explosion(e.x+e.halfWidth, e.y+e.halfHeight));
        e.remove = true;
      });

    playerTwo.liveAmmo
      .filter(function (e) {
        return utils.hasCollided(e, playerOne);
      })
      .forEach(function (e) {
        explosionArr.push(new Explosion(e.x+e.halfWidth, e.y+e.halfHeight));
        e.remove = true;
      });

    explosionArr = explosionArr.filter(
      function(e) {
        return (!e.remove);
      });

    explosionArr.forEach(
      function(e) {
        e.render(context);
    })

  }

  //
  function gameLoop() {
    currentGameStateFunction();
    window.setTimeout(gameLoop, BASE.ANIMATION_SPEED);
  }

  // initialize the game
  function init () {
    switchGameState(GAME_STATE_TITLE);
    gameLoop();
  }

  return {
    init: init,
    switchGameState: switchGameState,
    BASE: BASE,
    context: context
  };
}