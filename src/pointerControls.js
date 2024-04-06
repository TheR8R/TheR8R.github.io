
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import  {paused} from './soundImpl.js';

let first = false;
export function pointerControls(camera) {
    let controls = new PointerLockControls(camera, document.body );
    
    controls.maxPolarAngle = Math.PI / 2; // this locks the camera to the horizontal plane
    controls.minPolarAngle = Math.PI / 2; // this locks the camera to the horizontal plane

    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );

    instructions.addEventListener( 'click', function () {

        controls.lock();

    } );

    controls.addEventListener( 'lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';
        if(first === false) {
            first = true;
        } else {
            paused(1);
        }
    } );    
    
    controls.addEventListener( 'unlock', function () {  
        
        blocker.style.display = 'block';    
        instructions.style.display = '';
            paused(2);
    } );
    return controls;    
}