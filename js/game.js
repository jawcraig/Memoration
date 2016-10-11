document.addEventListener("DOMContentLoaded", function(event) {
    var scene, renderer;

    objects = [];

    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );
    var element = document.getElementById('container');

    var controls = setupControls();

    obtainPointerLock(element, blocker, instructions);
    views = [
    {
      left: 0,
      bottom: 0,
      width: 0.5,
      height: 1.0,
      background: new THREE.Color().setRGB( 0.5, 0.5, 0.7 ),
      eye: [ 0, 0, 0 ],
      up: [ 0, 1, 0 ],
      fov: 30,
      updateCamera: function ( camera, scene ) {
        camera.lookAt( scene.position );
      }
    },
    {
      left: 0.5,
      bottom: 0,
      width: 0.5,
      height: 0.5,
      background: new THREE.Color().setRGB( 0.7, 0.5, 0.5 ),
      eye: [ 0, 500, 0 ],
      up: [ 0, 0, 1 ],
      fov: 45,
      updateCamera: function ( camera, scene ) {
        camera.lookAt( camera.position.clone().setY( 0 ) );
      }
    },
    {
      left: 0.5,
      bottom: 0.5,
      width: 0.5,
      height: 0.5,
      background: new THREE.Color().setRGB( 0.5, 0.7, 0.7 ),
      eye: [ -200, 400, -200 ],
      up: [ 0, 1, 0 ],
      fov: 60,
      updateCamera: function ( camera, scene ) {
        camera.lookAt( scene.position );
      }
    }
  ];

  init();
  animate();

  function init() {
    initViews(views);

    scene = initScene(objects);

    renderer = createRenderer();

    var camera = views[0].camera;
    bindControls(scene, camera, controls);
  }

  function createRenderer() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    return renderer;
  }

  function paintFrustum(object) {
    var camera = views[0].camera;
    var frustum = new THREE.Frustum();
    frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );

    var childcount = scene.children.length;
    var incount = 0, outcount = 0;
    for ( var i = 0; i < childcount; ++i ) {
      child = scene.children[i];
      var box = new THREE.Box3().setFromObject( child );

      if ( "material" in child && "color" in child.material ) {
        if ( frustum.intersectsBox(box) ) {
          ++incount;
          child.material.color.setHex( "0xFF2233" );
        }
        else {
          ++outcount;
          child.material.color.setHex( "0x002233" );
          if ( "position" in child ) {
            child.position.x += 2 * Math.random() - 1;
            child.position.y += 2 * Math.random() - 1;
            child.position.z += 2 * Math.random() - 1;
          }
        }
      }
    }

    console.log("out " + outcount + " in " + incount);
  }

  function initViews(views) {
    for (var ii =  0; ii < views.length; ++ii ) {
        var view = views[ii];
        var camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 5000 );
        camera.position.x = view.eye[ 0 ];
        camera.position.y = view.eye[ 1 ];
        camera.position.z = view.eye[ 2 ];
        camera.up.x = view.up[ 0 ];
        camera.up.y = view.up[ 1 ];
        camera.up.z = view.up[ 2 ];
        view.camera = camera;
      }
  }

  function renderView(view) {
    camera = view.camera;

    view.updateCamera( camera, scene );

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    var left   = Math.floor( windowWidth  * view.left );
    var bottom = Math.floor( windowHeight * view.bottom );
    var width  = Math.floor( windowWidth  * view.width );
    var height = Math.floor( windowHeight * view.height );
    renderer.setViewport( left, bottom, width, height );
    renderer.setScissor( left, bottom, width, height );
    renderer.setScissorTest( true );
    renderer.setClearColor( view.background );

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    paintFrustum();

    renderer.render( scene, camera );
  }

  function animate() {
    requestAnimationFrame( animate );

    handleControls(controls, objects);

    for ( var ii = 0; ii < views.length; ++ii ) {
      view = views[ii];
      renderView(view);
    }
  }
});
