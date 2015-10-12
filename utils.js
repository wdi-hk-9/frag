// adapted from O Reily HTML5 Canvas
function boundingBoxCollide(object1, object2) {
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
};

