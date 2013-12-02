var systemMesh = {

    tactical: function (system, star) {

      var systemMesh = new THREE.Object3D;
      systemMesh.position.set(0, 0, 0);
      systemMesh.name = "System Blank";
      systemMesh.systemId = system.id;

      return systemMesh;

    }

  , strategic: function (camera, system) {

      /*var systemGeometry = new THREE.SphereGeometry(camera.position.z / 25, 7, 7);
      var systemMaterial = new THREE.MeshLambertMaterial({
        color: 0xCCCCCC,
        map: THREE.ImageUtils.loadTexture('img/sunmap.jpg'),
        overdraw: true,
        needsUpdate: true
      });

      var systemMesh = new THREE.Mesh(systemGeometry, systemMaterial);
          //console.log(system.strategicPosition);
          systemMesh.position.set(system.strategicPosition[0], system.strategicPosition[1], 0);

      return systemMesh;*/

      var systemGeo = new THREE.CircleGeometry(Math.abs(camera.position.z / 20), 50, 0, Math.PI * 2);
      var systemMat = new THREE.MeshBasicMaterial({
        color: 0x999933,
      });

      var systemMesh = new THREE.Mesh(systemGeo, systemMat);
      systemMesh.systemId = system.id;
      systemMesh.position.set(system.strategicPosition[0], system.strategicPosition[1], 0);

      return systemMesh;

    }

}

module.exports = systemMesh;