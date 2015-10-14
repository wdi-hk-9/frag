var
  itemsToLoad = 10,
  loadCount = 0,
  $audio = $('<audio></audio>')
    .attr('src':'resources/audio/shot1.wav')
    .on('canplaythrough', itemloaded)
    .appendTo("body"),
  audioElem = audio.get(0);

function itemLoaded(event) {
loadCount++;
if (loadCount >= itemsToLoad) {
      canvasApp();
   }
}