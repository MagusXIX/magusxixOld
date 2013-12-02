var planetMesh = function (planet) {

  var planetGeometry = new THREE.SphereGeometry(planet.radius, 50, 50);
  var planetMaterial = new THREE.MeshLambertMaterial({
    color: 0xCCCCCC,
    map: THREE.ImageUtils.loadTexture('img/' + planet.planetType + 'map.jpg'),
    overdraw: true,
    needsUpdate: true
  });

  var planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      planetMesh.position.set(0, 0, planet.radius * -1);
      planetMesh.planetId = planet.id;
      planetMesh.rotation.x += 90 * Math.PI / 180;

  return planetMesh;

}

module.exports = planetMesh;