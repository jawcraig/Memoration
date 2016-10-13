function grue(location) {
  for(var i = 0; i < objects.length; ++i) {
    scene.remove(objects[i]);
  }
  var grue = createGrue(location);
  scene.add(grue);
}

var createGrue = function(location) {
  geometry = new THREE.BoxGeometry( 50, 50, 50 );

  for ( i = 0, l = geometry.faces.length; i < l; i ++ ) {
    var face = geometry.faces[ i ];

    face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
  }

  material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

  mesh = new THREE.Mesh( geometry, material );
  mesh.position.x = 0;
  mesh.position.y = 0;
  mesh.position.z = 0;

  material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

  return mesh;
};
