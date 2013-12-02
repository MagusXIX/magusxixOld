var shipMesh = function (modules) {

  var ship = new THREE.Object3D;

  for (var i in modules) {
    var moduleModel = modules[i];

    if (moduleModel.moduleType == 'engine') {

      var engineGeometry = new THREE.CylinderGeometry(65000, 65000, 200000, 8, 1, false);
      var engineMaterial = new THREE.MeshLambertMaterial({
        color: 0xCCCCCC,
        overdraw: true,
        needsUpdate: true
      })

      var engineMesh = new THREE.Mesh(engineGeometry, engineMaterial);
          engineMesh.position.set(moduleModel.position[0], moduleModel.position[1], moduleModel.position[2]);

      ship.add(engineMesh);

    } else {

      var moduleGeometry = new THREE.CubeGeometry(100000, 100000, 100000, 1, 1, 1);
      var moduleMaterial = new THREE.MeshLambertMaterial({
        color: 0xCCCCCC,
        overdraw: true,
        needsUpdate: true
      })

      var moduleMesh = new THREE.Mesh(moduleGeometry, moduleMaterial);
          moduleMesh.position.set(moduleModel.position[0], moduleModel.position[1], moduleModel.position[2]);

      ship.add(moduleMesh);

    }

    if (ship.children.length == 5) {
      return ship;
    }

  }

}

module.exports = shipMesh;