import * as THREE from 'three';

import { loadLevel } from './levelLoader.js';
import { playerClass } from './player.js';
import { checkForCollision } from './Collision.js';
import { movement} from './keyboardControls.js';
import  {paused} from './soundImpl.js';

let camera, scene, renderer, controls, raycasters, player;
let prevTime = performance.now();
export let level;

init();
paused(0);
animate();
function init() {

    //create scene
    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xffffff );
    // scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    player = new playerClass(scene);
    level = new loadLevel(scene, player);
 
    //add light REMOVE LATER
    const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 2.5 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    //create camera
    camera = player.getCamera();
    //create controls

    controls = player.getControls();

    //add controls to the scene
    scene.add( controls.getObject() ); 
    
    // //arrow helpers
    // let arrowHelpers = player.getArrowHelpers();
    // arrowHelpers.forEach(arrowhelper => {
    //     scene.add(arrowhelper);
    // });

    //create raycasters
    raycasters = player.getRaycasters();

    //create renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    // Make sphere for testing
    // const sphere = new THREE.SphereGeometry( 10, 32, 16);
    // const material = new THREE.MeshPhongMaterial({ color: 0xff2200 });
    // const sphere_mesh = new THREE.Mesh( sphere, material );
    // sphere_mesh.position.set(0, 20, 0);
    // scene.add( sphere_mesh );
    // sphere_mesh.userData.name = "sphere";
    // sphere_mesh.userData.objects = true;
    
    //add event listener for window resize

    window.addEventListener( 'resize', onWindowResize );
}

//function to resize the window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//function to animate the scene
function animate() {
    requestAnimationFrame( animate ); // this is a recursive function that calls itself to animate the scene
    const time = performance.now(); // this is the time in milliseconds since the page was loaded
    if ( controls.isLocked === true ) {
        const delta = ( time - prevTime ) / 1000; // seconds since last frame. Movement is scaled by time to ensure consistent movement speed. imagine the program puppetting movement
        movement(controls, delta); // this function is in the keyboardControls.js file
        player.updatePosition(); // update the position of the player
        checkForCollision(raycasters, scene, player);  //check for collision
        

    }
    prevTime = time; // update the time
    renderer.render( scene, camera ); // render the scene
}
