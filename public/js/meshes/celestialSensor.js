var celestialSensorMesh = function (camera, body) {
  var self = this;

  var sensorGeo = new THREE.CircleGeometry(Math.abs(camera.position.z / 75), 50, 0, Math.PI * 2);
  var sensorMat = new THREE.MeshBasicMaterial({
    color: 0x333399,
  });

  var mesh = new THREE.Mesh(sensorGeo, sensorMat);
  mesh.sensorType = 'celestial';

  if (body.planetType) {
    mesh.planetId = body.id;
    mesh.thing = body;
  } else {
    mesh.starId = body.id;
    mesh.thing = body;
  }

  return mesh;
  console.log(mesh);

};

module.exports = celestialSensorMesh;