/*global window, console, document, Image
*/

// Game object constructor
// JavaScript: The Good Parts Chapter 5
// variation of the functional pattern for object creation
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

    //initialize game objects
    playerOne = createShip({
      x: 50,
      y: 50,
      angle: 0,
      spriteIndexArr: [4],
      omega: BASE.OMEGA,
      speed: BASE.VELOCITY,
      isPlayerOne: true
    });
    playerOne.setKeys();

    playerTwo = createShip({
      x: 750,
      y: 300,
      angle: 180,
      spriteIndexArr: [2],
      omega: BASE.OMEGA,
      speed: BASE.VELOCITY,
      isPlayerOne: false
    });
    playerTwo.setKeys();

    window.setTimeout(function(){
      switchGameState(GAME_STATE_PLAY);
    }, 1000);

  }

  function gameStatePlay() {
    context.fillStyle = BASE.CANVAS_BACKGROUND;
    context.fillRect(0, 0, BASE.CANVAS_WIDTH, BASE.CANVAS_HEIGHT);
    playerOne.update();
    playerOne.render(context);
    playerTwo.update();
    playerTwo.render(context);
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
    context: context,
    createShip: createShip
  };
}
















