console.log('HEY! YOU ARE IN SECTORMAPJS!');
var camera = require('../controllers/camera.js');

var game = {

    init: function () {
      var self = this;

      this.scene = new THREE.Scene();

      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x000000, 0);

      window.oncontextmenu = function() {
        return false;
      };

      $("*").toggleClass('reset');
      $("#container").attr("id", "reset");
      $("#reset").append(this.renderer.domElement);
      
      $('body').noisy({
        'intensity' : 0.004,
        'size' : '1024',
        'opacity' : 0.97,
        'fallback' : '',
        'monochrome' : false
      }).css('background-color', '#000');

      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 100000000, 2000000000000000);
      this.camera.position.set(28, 50, 10000000000000);
      this.camera.initialized = false;
      this.camera.place = false;
      this.camera.system = false;

      THREEx.WindowResize(self.renderer, self.camera);

      var light = new THREE.PointLight(0xffffff);
      light.name = 'light';
      self.scene.add(self.camera);
      light.position.set(0, 0, self.camera.position.z - 1000000);
      self.scene.add(light);

      self.animate(self.scene);
      camera.controls(self.scene, self.camera);
      console.log(self.scene);

    }

  , animate: function (scene) {
      var self = this;

      requestAnimationFrame(function() {
        self.animate(scene);
      });

      render();
      update();

      function render () {
        self.renderer.render(scene, self.camera);
      }

      function update () {

        //LIGHT HANDLERS
        if (self.camera.view != 'visual') {
          for (var i in scene.children) {
            if (scene.children[i].name == 'light') {
              scene.children[i].position.set(self.camera.position.x, self.camera.position.y, self.camera.position.z - 0.5);
            }
          }
        }

        //STRATEGIC HANDLERS
        if (self.camera.position.z > 4500000000000000 && self.camera.view == 'tactical') {
          console.log('Tactical to Strategic');
          camera.strategicLoad(scene, self.camera);
        }

        if (self.camera.view == 'strategic') {
          //camera.strategicAnimation(scene, self.camera);
        }

        //TACTICAL HANDLERS
        if (self.camera.initialized == false) {
          console.log('Initial Tactical');
          camera.tacticalLoad(scene, self.camera);
          self.camera.initialized = true;
        }

        if (self.camera.view == 'strategic' && self.camera.position.z <= 0.9) {
          console.log('Strategic to Tactical');
          camera.tacticalLoad(scene, self.camera);
        }

        if (self.camera.position.z > 500000000000 && self.camera.view == 'visual') {
          console.log('Visual to Tactical');
          camera.tacticalLoad(scene, self.camera);
        }

        if (self.camera.view == 'tactical') {
          camera.tacticalAnimation(scene, self.camera);
        }

        //VISUAL HANDLERS
        if (self.camera.view == 'tactical' && self.camera.position.z <= 500000000000 && self.camera.place != false) {
          console.log('Tactical to Visual');
          camera.visualLoad(scene, self.camera);
        }

        if (self.camera.view == 'visual') {
          camera.visualAnimation(scene, self.camera);
        }

      }

  }
};

game.init();