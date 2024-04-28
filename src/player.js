import * as THREE from 'three';

import { onKeyDown, onKeyUp, isMoving, click } from './keyboardControls.js';
import { pointerControls } from './pointerControls.js';
import { soundImpl, allowClick, echoPosition} from './soundImpl.js';
import { createRaycasters} from './raycasters.js';
import { level } from './main.js';
import { logObject } from './main.js';

let camera;
let rotation, cameraDirection, finalDirection;
let distancesForSound = [];
let clickTutorial = true;
let firstTime = true;
let reloadTutorial = true;
let mouseIsDown = false;
let previousTime = 0;
let playOnce = false;

export function skipTutorialPlayer() {
    clickTutorial = false;
    firstTime = false;
    reloadTutorial = false;
}

export class playerClass {
    constructor(scene) {
        this.camera = this.createCamera();
        this.controls = pointerControls(camera);
        document.addEventListener( 'keydown', this.onKeyDownProxy.bind(this) );
        document.addEventListener( 'keyup', this.onKeyUpProxy.bind(this) );
        document.addEventListener( 'mousedown', function(event){
            mouseIsDown = true;
        });
        document.addEventListener( 'mouseup', function(event){
            mouseIsDown = false;
        });
        this.playerSound = new soundImpl(camera);
        this.scene = scene;
        this.winningBox;
        
        //create raycasters and arrowHelpers
        this.raycastersClass = new createRaycasters(this.camera, this.scene);
        this.raycasters = this.raycastersClass.getRaycasters();
        this.arrowHelpers = this.raycastersClass.getArrowHelpers();
        this.raycasterToRoof = this.raycastersClass.getRaycasterToRoof();
        this.arrowHelperToRoof = this.raycastersClass.getArrowHelperToRoof();
        this.soundRaycasters = this.raycastersClass.getSoundRaycasters();


        // create playerboundingbox
        let playerGeometry = new THREE.BoxGeometry(2, 5, 2);
        let playerMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
        playerMaterial.wireframe = true;
        playerMaterial.transparent = true;
        playerMaterial.opacity = 0.0;
        this.playerModel = new THREE.Mesh(playerGeometry, playerMaterial);
        this.playerModel.position.set(camera.position.x, 5, camera.position.z);
        this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boundingBox.setFromObject(this.playerModel);
        this.scene.add(this.playerModel);
    }

    //ensures that controls can't be used when game is paused
    onKeyDownProxy(event) {
        if(this.controls.isLocked === true){
            onKeyDown(event);
        }
    }
    // ensures that controls can't be used when game is paused
    onKeyUpProxy(event) {
        if(this.controls.isLocked === true){
            onKeyUp(event);
        }
    }

    createCamera() {
    camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 10;
    return camera;
    }

    getCamera() {
        return this.camera;
    }

    getControls() {
        return this.controls;
    }

    getPosition() {
        return this.camera.position;
    }

    getArrowHelpers() {
        return this.arrowHelpers;
    }

    getRaycasters() {
        return this.raycasters;
    }

    getArrowHelperToRoof() {
        return this.arrowHelperToRoof;
    }

    updatePosition() {
        //update the soundRaycasters
        for(let i = 0; i < this.soundRaycasters.length; i++){
            cameraDirection = this.camera.getWorldDirection(this.soundRaycasters[i].ray.direction);
            rotation = Math.atan2(cameraDirection.x, cameraDirection.z);
            if(i === 0){
                //left
                finalDirection = new THREE.Vector3(Math.sin(rotation + Math.PI/2), 0, Math.cos(rotation + Math.PI/2));
            } else if(i === 1){
                //right
                finalDirection = new THREE.Vector3(Math.sin(rotation - Math.PI/2), 0, Math.cos(rotation - Math.PI/2));
            }  else {
                //forward
                finalDirection = new THREE.Vector3(Math.sin(rotation), 0, Math.cos(rotation));
            }
            this.soundRaycasters[i].set(this.camera.position, finalDirection);
        };
        distancesForSound = this.raycastersClass.getLeftAndRightDistance();
    
        if (isMoving) {
            if (this.playerSound.isPlaying() === false){
                this.playerSound.sequenceFootsteps(distancesForSound);
            }
        }
        
        if(mouseIsDown){
            this.echolocation();
        }
        //update position of playerboundingbox
        this.playerModel.position.set(this.camera.position.x, 5, this.camera.position.z);
        this.boundingBox.copy(this.playerModel.geometry.boundingBox).applyMatrix4(this.playerModel.matrixWorld);
        // console.log(this.boundingBox.min, this.boundingBox.max)
        if (click === true && clickTutorial === true) {
            this.playerSound.playClickTutorial();
            clickTutorial = false;
        }
        if (firstTime === true) {
            this.playerSound.playTutorialSound();
            firstTime = false;
        }
        //check if we have won
        if(this.winningBox === undefined){
        } else {
            if(this.winningBox.intersectsBox(this.boundingBox)){
                this.playerSound.playWinningSound();
                level.nextLevel();
            }
        }
        
        //update position of raycasters and arrowHelpers
        this.raycasters.forEach(raycaster => {
            raycaster.set(this.camera.position, raycaster.ray.direction);
        });

        this.arrowHelpers.forEach(arrowHelper => {
            arrowHelper.position.set(this.camera.position.x, 8, this.camera.position.z);
        });

        //log the player position
        this.logPlayerPosition();

        //soundCompass
        this.checkRotationForSound();
    }

    checkRotationForSound() {
        // Get the rotation angle of the camera
        let euler = new THREE.Euler();
        euler.setFromQuaternion(this.camera.quaternion);
        // Convert rotation angle from radians to degrees if needed
        let rotationAngle = THREE.MathUtils.radToDeg(euler.y);
        // Round the rotation angle to the nearest whole number
        let compassDirection = Math.round(rotationAngle);
        // Check if the camera is facing a multiple of 15 degrees
        let compassTick = compassDirection % 15;
        // Play the sound if the camera is facing a multiple of 15 degrees
        if (compassTick === 0 && playOnce === false) {
            playOnce = true;
            this.playerSound.playCompassSound();
        }
        // Reset the playOnce variable if the camera is not facing a multiple of 15 degrees
        if (compassTick !== 0) {
            playOnce = false;
        }
    }

    logPlayerPosition() {
        let currentTime = performance.now();
        if(currentTime - previousTime >= 400){
            let currentLevel = level.getLevelNumber();
            if(currentLevel === 1){
                logObject.logLvl1(this.camera.position.x, this.camera.position.z);
            }
            if(currentLevel === 2){
                logObject.logLvl2(this.camera.position.x, this.camera.position.z);
            }
            if(currentLevel === 3){
                logObject.logLvl3(this.camera.position.x, this.camera.position.z);
            }
            if(currentLevel === 4){
                logObject.logLvl4(this.camera.position.x, this.camera.position.z);
            }
            if(currentLevel === 5){
                logObject.logLvl5(this.camera.position.x, this.camera.position.z);
            }
            if(currentLevel === 6){
                logObject.logLvl6(this.camera.position.x, this.camera.position.z);
            }
           previousTime = currentTime;
        }
    }

    setPosition(x, z) {
        this.camera.position.set(x, 10, z);
    }

    setRotation(y) {
        this.camera.rotation.set(0, y, 0);
    }

    setWinningBox(winningBox) {
        this.winningBox = winningBox;
    }

    echolocation() {
        if(this.controls.isLocked === true){ //ensures click can't be used when game is paused
            if(allowClick){
                if(reloadTutorial === true){
                    reloadTutorial = false;
                    this.playerSound.reloadTutorialSound();
                }
                if(echoPosition.isPlaying === false){
                    let intersectsFront = this.soundRaycasters[2].intersectObjects(this.scene.children);
                    if (intersectsFront.length > 0) {
                        let point = intersectsFront[0];
                        let name = point.object.name;
                        this.playerSound.echoSound(point, name);
                        logObject.echo();
                    }
                }
            }
        }
    }
}