var Menu = function () {
  // initial values
  this.x = 0;
  this.y = 0;
  this.currShipIndex = 0;
  this.displayText = utils.shipConfig[this.currShipIndex].text;
  this.width = 500;
  this.height = 500;
  this.image = new Image();
  this.image.src = "resources/images/ShipStrip.png";
  this.srcSpriteSize = 128;
}

Menu.prototype.render = function (context) {
  // display text; white for player 1, red for player 2
  context.fillStyle = (utils.currentMenuDisplay === "PLAYER 1")
    ? '#FFFFFF'
    : '#FF0000';
  context.font = utils.FONT_MENU;
  context.textBaseline = 'top';
  // display Player choosing
  context.fillText (utils.currentMenuDisplay,
    (this.x + this.width / 16),
    (this.y + this.width / 16)
  );
  context.fillText ("SPACE to view options",
    (this.x + this.width / 16),
    (this.y + this.width / 8)
  );
  context.fillText ("ENTER to choose ship",
    (this.x + this.width / 16),
    (this.y + this.width / 16 * 3)
  );
  // current ship description in green
  context.fillStyle = '#00FF00';
  context.fillText (this.displayText,
    (this.x + this.width / 16),
    (this.y + 3 * this.height / 4)
  );

  // ship image
  context.drawImage(
    // sprite sheet
    this.image,
    // src position on sprite sheet
    0,
    this.srcSpriteSize * this.currShipIndex,
    // src dimensions
    this.srcSpriteSize, this.srcSpriteSize,
    // dest poition on canvas
    (this.x + this.width / 4), (this.y + this.height * 3 / 8),
    // dest dimensions
    this.width / 4, this.height /4);

}

Menu.prototype.update = function () {
  var i = this.currShipIndex;

  if (utils.playerOneChoice === ((i+1)%5)){
    // don't allow for duplicate choices
    this.currShipIndex = (i+2) % 5;
  } else {
    this.currShipIndex = (i+1) % 5;
  }

  this.displayText = utils.shipConfig[this.currShipIndex].text;
}

