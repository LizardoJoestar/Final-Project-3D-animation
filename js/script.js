//jshint esversion: 6
//global variables>>>>>>>>>
//ENVIRONMENT
var scene, camera, renderer, stats;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
//ORBIT VARIABLES:
const EARTH_ORBIT_RADIUS = 1000;
const MOON_ORBIT_RADIUS = 200;
const EARTH_ORBIT_SPEED = 0.0001;
const MOON_ORBIT_SPEED = 0.002;
const EARTH_ROTATION_SPEED = 0.01;
const clock = new THREE.Clock();
var date1, date2, delta;
//SUN MESH:
var sunGeometry, sunMaterial, sunMesh;
//EARTH MESH:
var earthGeometry, earthMaterial, earthMesh;
//MOON MESH:
var moonGeometry, moonMaterial, moonMesh;
//LIGHTS:
var pointLight;
//TEXTURES:
var textureEarth, textureMoon;


//updating viewport on browser window resize
window.addEventListener( 'resize', function ()
{
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setSize( width, height );
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});


function init()
{
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x545454 );

  //insertInfo();
  initCamera();
  initRenderer();
  initFlyControls();
  initStats();
  initSun();
  initPointLight();
  initEarth();
  initMoon();
  initSkysphere();

  document.body.appendChild( renderer.domElement );
}

function initCamera()
{
  camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 50000);
  camera.position.z = 300;
  camera.lookAt(scene.position);
}

function initRenderer()
{
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setSize( WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

function initFlyControls()
{
  controls = new THREE.FlyControls( camera, renderer.domElement );
  controls.movementSpeed = 1000;
	controls.domElement = renderer.domElement;
	controls.rollSpeed = Math.PI / 24;
	controls.autoForward = false;
	controls.dragToLook = false;
}

function initStats()
{
  stats = new Stats();
  document.body.appendChild(stats.dom);
}

function insertInfo()
{
  // info
  info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.top = '30px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  info.style.color = '#fff';
  info.style.fontWeight = 'bold';
  info.style.backgroundColor = 'transparent';
  info.style.zIndex = '1';
  info.style.fontFamily = 'Monospace';
  info.innerHTML = 'Arrastra el mouse para rotar la cámara; haz scroll para hacer zoom.';
  document.body.appendChild( info );
}

function initSun()
{
  sunGeometry = new THREE.SphereGeometry(200,60,60);
  sunMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
  sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sunMesh);
}

function initEarth()
{
  earthGeometry = new THREE.SphereGeometry(40,32,32);
  textureEarth = new THREE.TextureLoader().load('img/earth-map.jpg');
  earthMaterial = new THREE.MeshPhongMaterial( { map: textureEarth} );
  earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  earthMesh.castShadow = true;
  earthMesh.receiveShadow = true;
  scene.add(earthMesh);
}

function initMoon()
{
  moonGeometry = new THREE.SphereGeometry(10,32,32);
  textureMoon = new THREE.TextureLoader().load('img/moon.jpg');
  moonMaterial = new THREE.MeshPhongMaterial( { map: textureMoon} );
  moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.castShadow = true;
  moonMesh.receiveShadow = true;
  earthMesh.add(moonMesh);
}

function initSkysphere()
{
  var geometry = new THREE.SphereGeometry(30000,32,32);
  var texture1 = new THREE.TextureLoader().load('img/starmap_8k.jpg');
  var mat1 = new THREE.MeshBasicMaterial( { map: texture1, side: THREE.DoubleSide } );
  var skysphere = new THREE.Mesh(geometry, mat1);
  scene.add(skysphere);
}

function initSkybox()
{
  var geometry = new THREE.BoxGeometry(40000,40000,40000);
  var loader = new THREE.TextureLoader();

  var cubeMaterials =
  [
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load( "img/skybox/space_front5.png" ), side: THREE.DoubleSide } ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load( "img/skybox/space_back6.png" ), side: THREE.DoubleSide } ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load( "img/skybox/space_top3.png" ), side: THREE.DoubleSide } ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load( "img/skybox/space_bottom4.png" ), side: THREE.DoubleSide } ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load( "img/skybox/space_right1.png" ), side: THREE.DoubleSide } ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load( "img/skybox/space_left2.png" ), side: THREE.DoubleSide } )
  ];

  var skybox = new THREE.Mesh(geometry, cubeMaterials);

  scene.add(skybox);
}


function initPointLight()
{
  pointLight = new THREE.PointLight(0xFFFFFF,1);
  pointLight.castShadow = true;
  pointLight.shadow.camera.near = 1;
  pointLight.shadow.camera.far = 5000;
  pointLight.shadow.fov = 90; //fov = field of view, here 90°
  pointLight.shadow.bias = 0.001;
  scene.add(pointLight);
}


function update()
{
  delta = clock.getDelta(); //delta is the elapsed number of seconds
  controls.update(delta); //delta is necessary for FlyControls
  date1 = Date.now() * EARTH_ORBIT_SPEED;
  date2 = Date.now() * MOON_ORBIT_SPEED;
  //Please make sure that both meshes
  //were declared above inside their functions ^^^
  //(I already know there's a conditional for that. It's just to make sure!)
  //Earth object:
  if (earthMesh != undefined)
  {
    earthMesh.position.set(
      Math.cos(date1) * EARTH_ORBIT_RADIUS,
      0,
      Math.sin(date1) * EARTH_ORBIT_RADIUS
    );

    //apparently it's the y axis to rotate as normal? uh
    earthMesh.rotation.y += EARTH_ROTATION_SPEED;
  }

  //Moon object:
  if (moonMesh != undefined)
  {
    moonMesh.position.set(
      Math.cos(date2) * MOON_ORBIT_RADIUS,
      0,
      Math.sin(date2) * MOON_ORBIT_RADIUS
    );
  }
}

function render()
{
  renderer.render( scene, camera );
}

function GameLoop()
{
  requestAnimationFrame( GameLoop );

  update();

  render();
  if (stats != undefined)
  {
    stats.update();
  }
}

init();
GameLoop();
