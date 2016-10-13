function initScene(number, scene) {
  scene.fog = new THREE.Fog( 0x9999AA, 0, 750 );

  createSceneLights(scene);

  // floor
  var floor = createDummySceneFloor(scene);
  scene.add(floor);

  objects = initDummySceneObjects(number);
  for(var i = 0; i < objects.length; ++i) {
    scene.add(objects[i]);
  }

  return scene;
}

var createSceneLights = function(scene) {
  var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
  scene.add( light );
};

var createDummySceneFloor = function(scene) {
  var geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
  geometry.rotateX( - Math.PI / 2 );

  for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
    var vertex = geometry.vertices[ i ];

    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;
  }

  for ( i = 0, l = geometry.faces.length; i < l; i ++ ) {
    var face = geometry.faces[ i ];

    face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
  }

  material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors, side: THREE.DoubleSide } );

  var mesh = new THREE.Mesh( geometry, material );

  return mesh;
};

var initDummySceneObjects = function(number) {
  // Create cubes

  var objects = [];

  geometry = new THREE.BoxGeometry( 20, 20, 20 );

  for ( i = 0, l = geometry.faces.length; i < l; i ++ ) {
    var face = geometry.faces[ i ];

    face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
  }

  for ( i = 0; i < number; i ++ ) {
    material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 5 + 50;
    mesh.position.y = Math.floor( Math.random() * 20 ) * 5;
    mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 5;

    material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

    objects.push( mesh );
  }

  return objects;
};
