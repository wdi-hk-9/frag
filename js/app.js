/*global window, console, document, Image
*/
'use strict';
$(function () {
  // unselects the instructions button after modal is hidden
  // 10ms delay before blur is triggered
  $('#myModal').on('hidden.bs.modal', function() {
    setTimeout(function () {
      $('#instructions').trigger('blur');
    }, 10);
  })

  // initialize game
  var game = createGame();
  game.init();
});
