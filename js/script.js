//jshint esversion: 6
//global variables>>>>>>>>>
//ENVIRONMENT
var scene, camera, renderer;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
//ORBIT VARIABLES:
const EARTH_ORBIT_RADIUS = 1000;
const MOON_ORBIT_RADIUS = 200;
const ORBIT_SPEED = 0.0005;
var date;
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

  insertInfo();
  initCamera();
  initRenderer();
  initOrbitControls();
  initSun();
  initPointLight();
  initEarth();
  initMoon();
  initSkybox();

  document.body.appendChild( renderer.domElement );
}

function initCamera()
{
  camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 50000);
  camera.position.z = 200;
  camera.lookAt(scene.position);
}

function initRenderer()
{
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setSize( WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
}

function initOrbitControls()
{
  controls = new THREE.OrbitControls( camera, renderer.domElement );
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
  sunGeometry = new THREE.SphereGeometry(100,32,32);
  sunMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
  sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sunMesh);
}

function initEarth()
{
  earthGeometry = new THREE.SphereGeometry(100,32,32);
  earthMaterial = new THREE.MeshBasicMaterial({textureEarth, side: TTHREE.Double});
  earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earthMesh);
}

function initMoon()
{
 moonMesh = earthMesh
}

function initSkysphere()
{
  var geometry = new THREE.SphereGeometry(30000,32,32);
  var texture1 = new THREE.TextureLoader().load('img/universe.png');
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
  scene.add(pointLight);
}


function update()
{
  date = Date.now() * ORBIT_SPEED;

  //Please make sure that both meshes
  //were declared above inside their functions ^^^
  //Earth object:
  if (earthMesh != undefined)
  {
    earthMesh.position.set(
      Math.cos(date) * EARTH_ORBIT_RADIUS,
      0,
      Math.sin(date) * EARTH_ORBIT_RADIUS
    );
  }

  //Moon object:
  if (moonMesh != undefined)
  {
    moonMesh.position.set(
      Math.cos(date) * MOON_ORBIT_RADIUS,
      0,
      Math.sin(date) * MOON_ORBIT_RADIUS
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
}

init();
GameLoop();
