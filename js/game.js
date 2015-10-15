/*global window, console, document, Image
*/

// Game object constructor
// "Revealing module pattern"
function createGame () {
  'use strict';
  var
    currentGameStateFunction, playerOne, playerTwo,
    playerOneLife, playerTwoLife,
    winner,
    playerOneSound, playerTwoSound, impactSound,
    playerOneMenu, playerTwoMenu, currentMenu,
    gameInitialized,
    theCanvas = $("#canvas").get(0),
    context = theCanvas.getContext("2d"),
    //application states
    GAME_STATE_TITLE = 0,
    GAME_STATE_INIT = 1,
    GAME_STATE_PLAY = 2,
    GAME_STATE_GAME_OVER = 3,
    START_POS_ONE = {x:50, y:50, angle:0},
    START_POS_TWO = {x:750, y:300, angle:180},
    explosionArr = [],
    // game level parameters
    BASE = {
      FPS: 50,
      DISTANCE_PER_SECOND: 150, // px moved in 1sec
      ROTATE_PER_SECOND: 135, // angular velocity in degrees/sec
      CANVAS_BACKGROUND: '#000000',
      CANVAS_FONT: "20px 'Orbitron' sans-serif",
      CANVAS_TEXTCOLOR: '#ffffff',
      CANVAS_WIDTH: 900,
      CANVAS_HEIGHT: 500,
      MS_PER_SECOND: 1000
    };
    BASE.ANIMATION_SPEED = BASE.MS_PER_SECOND/BASE.FPS;
    BASE.VELOCITY = Math.floor(BASE.DISTANCE_PER_SECOND/BASE.FPS);
    BASE.OMEGA = Math.floor(BASE.ROTATE_PER_SECOND/BASE.FPS);

  // gameloop functions corresponding to application states
  function gameStateTitle() {
    // draw background
    context.fillStyle = BASE.CANVAS_BACKGROUND;
    context.fillRect(0, 0, BASE.CANVAS_WIDTH, BASE.CANVAS_HEIGHT);
    // render text
    // context.fillStyle = BASE.CANVAS_TEXTCOLOR;
    // context.font = BASE.CANVAS_FONT;
    // context.textBaseline = 'top';
    // context.fillText ("FRAG", 50, 90);
    // context.fillText ("Shoot to kill!!", 50, 200);
    if (!currentMenu) {
      playerOneMenu = new Menu();
      currentMenu = playerOneMenu;
      // this allows for the ship selection to be entered,
      // as well as the switch to PlayerTwo's menu
      bindKeyGameMenu();
    }
    currentMenu.render(context);
  }

  function gameStateInit() {
    if (!gameInitialized) {
      var P1 = utils.playerOneChoice, P2 = utils.playerTwoChoice;

      context.fillStyle = BASE.CANVAS_BACKGROUND;
      context.fillRect(0, 0, BASE.CANVAS_WIDTH, BASE.CANVAS_HEIGHT);
      context.fillStyle = '#ffffff';
      context.font = BASE.CANVAS_FONT;
      context.textBaseline = 'top';
      context.fillText ("LOADING", 200, 200);

      // initialize sounds object pools using AudioFX
      // https://github.com/jakesgordon/javascript-audio-fx
      playerOneSound = AudioFX('resources/audio/shot' + P1 + '.wav', { volume: 1, pool: 10 });
      playerTwoSound = AudioFX('resources/audio/shot' + P2 + '.wav', { volume: 1, pool: 10 });
      impactSound = AudioFX('resources/audio/impact.wav', { volume: 1, pool: 10 });

      // initialize ship objects
      playerOne = new Ship(START_POS_ONE, utils.shipConfig[P1], playerOneSound);
      playerTwo = new Ship(START_POS_TWO, utils.shipConfig[P2], playerTwoSound);

      // initialize player lives
      playerOneLife = new Life(1);
      playerTwoLife = new Life(2);

      // bind game keys
      utils.bindKeys(playerOne, playerTwo);
      // bind enter key to enable restart after game end
      bindKeyRestart(switchGameState);
      gameInitialized = true;
      // hack to remove flicker between game state transitions
      setTimeout(function() {
        switchGameState(GAME_STATE_PLAY);
      },2000);
    }
  }

  function gameStatePlay() {
    context.fillStyle = BASE.CANVAS_BACKGROUND;
    context.fillRect(0, 0, BASE.CANVAS_WIDTH, BASE.CANVAS_HEIGHT);
    playerOne.update();
    playerOne.render(context);
    playerTwo.update();
    playerTwo.render(context);
    checkCollision(playerOne, playerTwo);
    checkGameEnd();
  }

  function gameStateGameOver() {
    context.fillStyle = BASE.CANVAS_BACKGROUND;
    context.fillRect(0, 0, BASE.CANVAS_WIDTH, BASE.CANVAS_HEIGHT);
    // render text
    context.fillStyle = BASE.CANVAS_TEXTCOLOR;
    context.font = BASE.CANVAS_FONT;
    context.textBaseline = 'top';
    context.fillText (winner + ' wins!!', 50, 90);
    context.fillText ("Press Enter To Replay", 50, 200);
    // reset menu
    currentMenu = null;
    utils.playerOneChoice = null;
    utils.playerTwoChoice = null;
    utils.currentMenuDisplay = "PLAYER 1";
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
        impactSound.play();
        e.remove = true;
        playerTwoLife.update(e.damage);
      });

    playerTwo.liveAmmo
      .filter(function (e) {
        return utils.hasCollided(e, playerOne);
      })
      .forEach(function (e) {
        explosionArr.push(new Explosion(e.x+e.halfWidth, e.y+e.halfHeight));
        impactSound.play();
        e.remove = true;
        playerOneLife.update(e.damage);
      });

    explosionArr = explosionArr.filter(
      function(e) {
        return (!e.remove);
      });

    explosionArr.forEach(
      function(e) {
        e.render(context);
    })
    playerOneLife.render(context);
    playerTwoLife.render(context);
  }

  function checkGameEnd() {
    if (playerOneLife.score <= 0) {
      winner = 'Player 2'
      switchGameState(GAME_STATE_GAME_OVER);
    }

    if (playerTwoLife.score <= 0) {
      winner = 'Player 1'
      switchGameState(GAME_STATE_GAME_OVER);
    }
  }

  function bindKeyRestart(switchGameState) {
    $(document).on(
      'keydown',
      function(e) {
        if (currentGameStateFunction == gameStateGameOver && e.keyCode === 13) { // enter
          switchGameState(GAME_STATE_TITLE);
        }
      });
  }
  //
  function gameLoop() {
    currentGameStateFunction();
    window.setTimeout(gameLoop, BASE.ANIMATION_SPEED);
  }

  function bindKeyGameMenu() {
    $(document).on('keydown', switchMenu);
  }

  function switchMenu(e) {
    // spacebar triggers the next ship to display
    if (e.keyCode === 32) currentMenu.update();

    // enter - player choice entered
    if (e.keyCode === 13) {
      if (currentMenu === playerOneMenu) {
        // enter PlayerOne's choice
        utils.playerOneChoice = currentMenu.currShipIndex;

        // initialize PlayerTwo's menu
        playerTwoMenu = new Menu();
        // if PlayerOne chose the first ship (index 0), remove it from
        // PlayerTwo's menu
        if (utils.playerOneChoice === 0) playerTwoMenu.currShipIndex = 1;
        // this allows for the menu to correctly display the current player choosing
        utils.currentMenuDisplay = "PLAYER 2";
        currentMenu = playerTwoMenu;
      }  else {
        // enter PlayerTwo's choice
        utils.playerTwoChoice = currentMenu.currShipIndex;
        // unbind the menu keys
        $(document).off('keydown', switchMenu);
        // allow game to initialize in the next GAME STATE
        gameInitialized = false;
        switchGameState(GAME_STATE_INIT);
      }
    }
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