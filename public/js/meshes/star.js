var starMesh = function (star) {

	var starGeometry = new THREE.SphereGeometry(star.radius, 50, 50);
  var starMaterial = new THREE.MeshLambertMaterial({
    color: 0xCCCCCC,
    map: THREE.ImageUtils.loadTexture('img/sunmap.jpg'),
    overdraw: true,
    needsUpdate: true
  });

  var starMesh = new THREE.Mesh(starGeometry, starMaterial);
      starMesh.position.z = star.radius * -1;
      starMesh.starId = star.id;

  return starMesh;

}

module.exports = starMesh;