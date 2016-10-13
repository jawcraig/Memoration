/* TODO: Declare namespace to stop pollution */

var setupControls = function() {
  controls = {
    enabled: false,
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    canJump: false,
    floor_height: 10,
    gravity: 9.81,
    controls: undefined,
    prevTime: performance.now(),
    velocity: new THREE.Vector3(),
    raycaster: new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 ),

    jump: function() {
        if ( controls.canJump === true ) {
          controls.velocity.y += 350;
          controls.canJump = false;
        }
      }
  };

  return controls;
};

// Bind controls to camera & scene
var obtainPointerLock = function(element, blocker, instructions) {
    // http://www.html5rocks.com/en/tutorials/pointerlock/intro/ ; mrdoob in Three.js examples

    // Test for pointer lock API
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if ( havePointerLock ) {
      var pointerlockchange = function ( event ) {
        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
          controls.enabled = true;
          if ( controls.controls !== undefined ) {
            controls.controls.enabled = true;
          }

          blocker.style.display = 'none';
        } else {
          controls.enabled = false;
          if ( controls.controls !== undefined ) {
            controls.controls.enabled = false;
          }

          blocker.style.display = '-webkit-box';
          blocker.style.display = '-moz-box';
          blocker.style.display = 'box';

          instructions.style.display = '';
        }
      };

      var pointerlockerror = function ( event ) {
        instructions.style.display = '';
      };

      // Hook pointer lock state change events
      document.addEventListener( 'pointerlockchange', pointerlockchange, false );
      document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
      document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

      document.addEventListener( 'pointerlockerror', pointerlockerror, false );
      document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
      document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

      instructions.addEventListener( 'click', function ( event ) {
        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        if ( /Firefox/i.test( navigator.userAgent ) ) {
          var fullscreenchange = function ( event ) {
            if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
              document.removeEventListener( 'fullscreenchange', fullscreenchange );
              document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
              element.requestPointerLock();
            }
          };

          document.addEventListener( 'fullscreenchange', fullscreenchange, false );
          document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

          element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
          element.requestFullscreen();
        } else {
          element.requestPointerLock();
        }
      }, false );
    } else {
      instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }
};

// Bind controls to camera & scene
var bindControls = function(scene, camera, controls) {
  controls.camera = camera;
  controls.controls = new PointerLockControls( camera );
  controls.controls.enabled = controls.enabled;

  scene.add( controls.controls.getObject() );

  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  return controls;
};

var onKeyDown = function( event ) {
  console.log("KEYDOWN!");
    switch ( event.keyCode ) {
      case 38: // up
      case 87: // w
        controls.moveForward = true;
        break;

      case 37: // left
      case 65: // a
        controls.moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        controls.moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        controls.moveRight = true;
        break;

      case 32: // space
        controls.jump();
        grue();
        break;
    }
};

var onKeyUp = function( event ) {
  console.log("KEYUP!");
    switch( event.keyCode ) {
      case 38: // up
      case 87: // w
        controls.moveForward = false;
        break;

      case 37: // left
      case 65: // a
        controls.moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        controls.moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        controls.moveRight = false;
        break;
  }
};

var handleControls = function(controls, objects) {
  // Calculate frame time

  var time = performance.now();
  var delta = ( time - controls.prevTime ) / 1000;
  controls.prevTime = time;

  if ( !controls.enabled ) {
    return;
  }

  // Friction dampening

  controls.velocity.x -= controls.velocity.x * 10.0 * delta;
  controls.velocity.z -= controls.velocity.z * 10.0 * delta;

  // Gravity

  controls.velocity.y -= controls.gravity * 100.0 * delta; // 100.0 = mass

  if ( controls.moveForward ) controls.velocity.z -= 400.0 * delta;
  if ( controls.moveBackward ) controls.velocity.z += 400.0 * delta;

  if ( controls.moveLeft ) controls.velocity.x -= 400.0 * delta;
  if ( controls.moveRight ) controls.velocity.x += 400.0 * delta;


  // Check collisions with objects.
  // Will move through the object if vertical speed is large enough

  var control_object = controls.controls.getObject();

  var raycaster = controls.raycaster;
  raycaster.ray.origin.copy( control_object.position );
  raycaster.ray.origin.y -= controls.floor_height;

  var intersections = raycaster.intersectObjects( objects );
  var isOnObject = intersections.length > 0;
  if ( isOnObject === true ) {
    controls.velocity.y = Math.max( 0, controls.velocity.y );

    controls.canJump = true;
  }

  // Move object

  control_object.translateX( controls.velocity.x * delta );
  control_object.translateY( controls.velocity.y * delta );
  control_object.translateZ( controls.velocity.z * delta );

  // Check collision with floor

  if ( control_object.position.y < controls.floor_height ) {
    controls.velocity.y = 0;
    control_object.position.y = controls.floor_height;

    controls.canJump = true;
  }
};
