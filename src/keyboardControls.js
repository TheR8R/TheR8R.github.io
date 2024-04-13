import * as THREE from 'three';
import { level } from './main.js';
import { allowMovement, reloadSound, allowReset, giveUpTutorialSound, triedToGiveUp, nextLevelSound } from './soundImpl.js';
//DO NOT ONELINE THESE - it will break and make you go fast!
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let giveUpTutorial = true;
export let isMoving = false;
export let click = false;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

export function onKeyDown ( event) {
    if(allowMovement === true){
        click = true;
        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

            case 'Space':
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
        }
    }
};
        
export function onKeyUp ( event ) {
    if(allowMovement === true) {
        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    }
};


export function movement(controls, delta){
    
        velocity.x -= velocity.x * 10.0 * delta; // friction
        velocity.z -= velocity.z * 10.0 * delta; // friction

        direction.z = Number( moveForward ) - Number( moveBackward ); // can move in either direction
        direction.x = Number( moveRight ) - Number( moveLeft ); // can move in either direction
        direction.normalize(); // this ensures consistent movements in all directions

        // if the player is moving in any direction, isMoving is true
        if (direction.x != 0 || direction.z != 0) {
            isMoving = true;     
        } else { // if the player is not moving, isMoving is false
            isMoving = false;
        }

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 200.0 * delta; // movementsped foward and backward
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 200.0 * delta; // movementspeed left and right
        controls.moveRight( - velocity.x * delta ); // by making - to + we invert the controls
        controls.moveForward( - velocity.z * delta ); // by making - to + we invert the controls
}