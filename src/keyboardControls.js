import * as THREE from 'three';
import { level, player, toggleLight } from './main.js';
import { allowMovement, reloadSound, allowReset, giveUpTutorialSound, triedToGiveUp, nextLevelSound, skipTutorialSound } from './soundImpl.js';
import { skipTutorialPlayer } from './player.js';
//DO NOT ONELINE THESE - it will break and make you go fast!
let moveForward = false;
let moveBackward = false;
// let moveLeft = false;
// let moveRight = false;
let turnLeft = false;
let turnRight = false;
let giveUpTutorial = true;
let tutorialSkip = true;
let echo = false;
export let isMoving = false;
export let click = false;
let timer = 0;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

export function onKeyDown ( event) {
        if (event.code === 'ControlLeft'){
            if(giveUpTutorial === true){
                if(timer === 0){
                timer = performance.now();
                }
            }
    }
    if(allowMovement === true){
        click = true;
        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                // moveLeft = true;
                turnLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                // moveRight = true;
                turnRight = true;
                break;

            case 'Space':
                echo = true;
                break;
        }
    }
};
        
export function onKeyUp ( event ) {
        if(event.code === 'ControlLeft'){
            if(tutorialSkip === true){
                let skipTimer = performance.now();
                // if the player has held the enter key for 3 seconds, skip the tutorial
                if(skipTimer - timer > 3000){
                    console.log("skipped tutorial")
                    tutorialSkip = false;
                    giveUpTutorial = false;
                    click = true;
                    level.nextLevel();
                    skipTutorialSound();
                    skipTutorialPlayer();
                } else {
                    console.log("did not skip tutorial")
                    timer = 0;
                }
            }
        }
    if(allowMovement === true) {
        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                // moveLeft = false;
                turnLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                // moveRight = false;
                turnRight = false;
                break;

            case 'Space':
                echo = false;
                break;
            
            case 'Backspace':
                if(giveUpTutorial === false){
                    let levelNumber = level.getLevelNumber();
                    if (levelNumber === 0){
                        triedToGiveUp();
                    } else {
                        level.nextLevel();
                        nextLevelSound();
                    }
                }
                break;

            case 'ShiftRight':
                if(allowReset === true){
                    level.reloadLevel();
                    if(giveUpTutorial === false){
                        reloadSound();
                    }
                    if(giveUpTutorial === true){
                        giveUpTutorial = false;
                        giveUpTutorialSound();
                    }
                }
                break;

            case 'KeyQ':
                toggleLight();
                break;
        }
    }
};


export function movement(controls, delta, camera){
    
        velocity.x -= velocity.x * 10.0 * delta; // friction
        velocity.z -= velocity.z * 10.0 * delta; // friction

        direction.z = Number( moveForward ) - Number( moveBackward ); // can move in either direction
        // direction.x = Number( moveRight ) - Number( moveLeft ); // can move in either direction
        direction.normalize(); // this ensures consistent movements in all directions

        // if the player is moving in any direction, isMoving is true
        if (direction.x != 0 || direction.z != 0) {
            isMoving = true;     
        } else { // if the player is not moving, isMoving is false
            isMoving = false;
        }

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 200.0 * delta; // movementsped foward and backward
        // if ( moveLeft || moveRight ) velocity.x -= direction.x * 200.0 * delta; // movementspeed left and right
        // controls.moveRight( - velocity.x * delta ); // by making - to + we invert the controls
        controls.moveForward( - velocity.z * delta ); // by making - to + we invert the controls

        // if the player is turning left or right, rotate the camera like the mouse
        if(turnLeft){
            let rotation = 0.01;
            let rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
            camera.quaternion.multiply(rotationQuaternion);
        }
        if(turnRight){
            let rotation = -0.01;
            let rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
            camera.quaternion.multiply(rotationQuaternion);
        }

        if(echo){
            player.echolocation();
        }
}



