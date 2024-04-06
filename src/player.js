import {BoxGeometry, MeshBasicMaterial, Mesh, Box3, Vector3, PerspectiveCamera} from './../node_modules/three/src/Three.js';

import { onKeyDown, onKeyUp, isMoving, click } from './keyboardControls';
import { pointerControls } from './pointerControls';
import { soundImpl, } from './soundImpl';
import { createRaycasters} from './raycasters';
import { level } from './main.js';

let camera;
let rotation, cameraDirection, finalDirection;
let distancesForSound = [];
let allowClick = false;
let clickTutorial = true;
let firstTime = true;
let reloadTutorial = true;
export class playerClass {
    constructor(scene) {
        this.camera = this.createCamera();
        this.controls = pointerControls(camera);
        document.addEventListener( 'keydown', onKeyDown );
        document.addEventListener( 'keyup', onKeyUp );
        document.addEventListener( 'click', this.echolocation.bind(this));
        this.playerSound = new soundImpl(camera);
        this.scene = scene;
        this.winningBox;
        
        //create raycasters and arrowHelpers
        this.raycastersClass = new createRaycasters(this.camera, this.scene);
        this.raycasters = this.raycastersClass.getRaycasters();
        this.soundRaycasters = this.raycastersClass.getSoundRaycasters();


        // create playerboundingbox
        let playerGeometry = new BoxGeometry(2, 5, 2);
        let playerMaterial = new MeshBasicMaterial({color: 0x00ff00});
        playerMaterial.wireframe = true;
        playerMaterial.transparent = true;
        playerMaterial.opacity = 0.0;
        this.playerModel = new Mesh(playerGeometry, playerMaterial);
        this.playerModel.position.set(camera.position.x, 5, camera.position.z);
        this.boundingBox = new Box3(new Vector3(), new Vector3());
        this.boundingBox.setFromObject(this.playerModel);
        this.scene.add(this.playerModel);


    }



    createCamera() {
    camera = new PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
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
                finalDirection = new Vector3(Math.sin(rotation + Math.PI/2), 0, Math.cos(rotation + Math.PI/2));
            } else if(i === 1){
                //right
                finalDirection = new Vector3(Math.sin(rotation - Math.PI/2), 0, Math.cos(rotation - Math.PI/2));
            }  else {
                //forward
                finalDirection = new Vector3(Math.sin(rotation), 0, Math.cos(rotation));
            }
            this.soundRaycasters[i].set(this.camera.position, finalDirection);
        };
        distancesForSound = this.raycastersClass.getLeftAndRightDistance();
    
        if (isMoving) {
            if (this.playerSound.isPlaying() === false){
                this.playerSound.sequenceFootsteps(distancesForSound);
            }
        }
        //update position of playerboundingbox
        this.playerModel.position.set(this.camera.position.x, 5, this.camera.position.z);
        this.boundingBox.copy(this.playerModel.geometry.boundingBox).applyMatrix4(this.playerModel.matrixWorld);
        // console.log(this.boundingBox.min, this.boundingBox.max)
        if (click === true && clickTutorial === true) {
            allowClick = true;
        }
        if (allowClick === true && clickTutorial === true) {
            clickTutorial = false;
            this.playerSound.playClickTutorial();
        }
        if (firstTime === true) {
            this.playerSound.playSound();
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

        // this.arrowHelpers.forEach(arrowHelper => {
        //     arrowHelper.position.set(this.camera.position.x, 8, this.camera.position.z);
        // });
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
        if(allowClick){
            if(reloadTutorial === true){
                reloadTutorial = false;
                this.playerSound.reloadTutorialSound();
            }
            let intersectsFront = this.soundRaycasters[2].intersectObjects(this.scene.children);
            console.log(intersectsFront);
            if (intersectsFront.length > 0) {
                console.log("clicked");
                let point = intersectsFront[0];
                let name = point.object.name;
                this.playerSound.echoSound(point, name);
            }
        }
    }
}