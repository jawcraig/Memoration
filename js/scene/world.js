window.getSceneCell = function(number) {
  var scene = new THREE.Scene();

  scene = initScene(number, scene);

  return scene;
};
