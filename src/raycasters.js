import * as THREE from './../node_modules/three/src/Three.js';

let arrowHelpers, raycasters, raycasterToRoof, arrowHelperToRoof, soundRaycasters, leftDistance, rightDistance, frontDistance, backDistance; 

const directions = [
        new THREE.Vector3(-1, 0, 0), // left
        new THREE.Vector3(1, 0, 0), // right
        new THREE.Vector3(0, 0, -1), // front
        new THREE.Vector3(0, 0, 1), // back
    ];


export class createRaycasters {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.init(); 
    }

    init() {
        raycasters = [];
        arrowHelpers = [];
        soundRaycasters = [];

        for(let i = 0; i < directions.length; i++){
            let raycaster = new THREE.Raycaster();
            raycaster.set(this.camera.position, directions[i]);
            raycasters.push(raycaster);
    
            let arrowHelper = new THREE.ArrowHelper(directions[i], this.camera.position, 7, 0xFF0000);
            arrowHelpers.push(arrowHelper);
        }
        // for sound
        for(let i = 0; i < 3; i++){
            let raycaster = new THREE.Raycaster();
            raycaster.set(this.camera.position, this.camera.getWorldDirection);
            soundRaycasters.push(raycaster);
        }
        
    }
    getSoundRaycasters() {
        return soundRaycasters;
    }

    getRaycasters() {
        return raycasters;
    }

    getArrowHelpers() {
        return arrowHelpers;
    }

    getRaycasterToRoof() {
        return raycasterToRoof;
    }

    getArrowHelperToRoof() {
        return arrowHelperToRoof;
    }

    getLeftAndRightDistance() {
        for(let i = 0; i < soundRaycasters.length; i++){
            let intersects = soundRaycasters[i].intersectObjects(this.scene.children);
            if (intersects.length > 0 ) {
                if (i === 0) {
                    leftDistance = intersects[0].distance;
                } else if (i === 1){
                    rightDistance = intersects[0].distance;
                } else {
                    frontDistance = intersects[0].distance;
                }
            }
        }
        return [leftDistance, rightDistance, frontDistance];
    }
}
