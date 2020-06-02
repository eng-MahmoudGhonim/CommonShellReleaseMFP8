$.fn.swipe = function( callback ) {
  var touchDown = false,
    originalPosition = null,
    $el = $( this );

  function swipeInfo( event ) {
    if ('undefined' !== typeof event.originalEvent.pageX) {
      var x = event.originalEvent.pageX,
          y = event.originalEvent.pageY,
          dx, dy;
    }else{
      var x = event.originalEvent.touches[0].pageX,
          y = event.originalEvent.touches[0].pageY,
          dx, dy;
    }

    dx = ( x > originalPosition.x ) ? "right" : "left";
    dy = ( y > originalPosition.y ) ? "down" : "up";

    return {
      direction: {
        x: dx,
        y: dy
      },
      offset: {
        x: x - originalPosition.x,
        y: originalPosition.y - y
      }
    };
  }

  $el.on( "touchstart mousedown", function ( event ) {
    touchDown = true;

    if ('undefined' !== typeof event.originalEvent.pageX) {
      originalPosition = {
        x: event.originalEvent.pageX,
        y: event.originalEvent.pageY
      };
    }else{
      originalPosition = {
        x: event.originalEvent.touches[0].pageX,
        y: event.originalEvent.touches[0].pageY
      };
    }
  } );

  $el.on( "touchend mouseup", function () {
    touchDown = false;
    originalPosition = null;
  } );

  $el.on( "touchmove mousemove", function ( event ) {
    if ( !touchDown ) { return;}
    var info = swipeInfo( event );
console.log(info)
    callback( info.direction, info.offset );
  } );

  return true;
};