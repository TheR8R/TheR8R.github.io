
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import  {paused, hoverSounds} from './soundImpl.js';
import { logObject } from './main.js';

export let isPaused = true;
let first = false;
export function pointerControls(camera) {
    let controls = new PointerLockControls(camera, document.body );
    
    controls.maxPolarAngle = Math.PI / 2; // this locks the camera to the horizontal plane
    controls.minPolarAngle = Math.PI / 2; // this locks the camera to the horizontal plane

    let blocker = document.getElementById( 'blocker' );
    let instructions = document.getElementById( 'instructions' );
    let helpDiv = document.getElementById('helpDiv');
    helpDiv.style.display = 'none';
    
    //////////////////////////
    let playButton = document.getElementById('play');
    playButton.addEventListener('click', function() {
        controls.lock();
    });
    playButton.addEventListener('mouseover', function() {
        hoverSounds(1);
    });
    playButton.addEventListener('focus', function() {
        hoverSounds(1);
    });
    //////////////////////////
    let questionnaireButton = document.getElementById('questionnaire');
    questionnaireButton.addEventListener('click', function() {
        logObject.getLogs();
        window.open("https://survey.au.dk/LinkCollector?key=36LY4NERU69J");
    });
    questionnaireButton.addEventListener('mouseover', function() {
        hoverSounds(3);
    });
    questionnaireButton.addEventListener('focus', function() {
        hoverSounds(3);
    });
    //////////////////////////
    let helpButton = document.getElementById('help');
    helpButton.addEventListener('click', function() {
        instructions.style.display = 'none';
        helpDiv.style.display = '';
    });
    help.addEventListener('mouseover', function() {
        hoverSounds(2);
    });
    help.addEventListener('focus', function() {
        hoverSounds(2);
    });
    //////////////////////////
    let helpReset = document.getElementById('reset');
    helpReset.addEventListener('click', function() {
        hoverSounds(9);
    });
    helpReset.addEventListener('mouseover', function() {
        hoverSounds(4);
    });
    helpReset.addEventListener('focus', function() {
        hoverSounds(4);
    });

    //////////////////////////
    let helpSkip = document.getElementById('skip');
    helpSkip.addEventListener('click', function() {
        hoverSounds(10);
    });
    helpSkip.addEventListener('mouseover', function() {
        hoverSounds(5);
    });
    helpSkip.addEventListener('focus', function() {
        hoverSounds(5);
    });
    //////////////////////////
    let helpEcho = document.getElementById('echo');
    helpEcho.addEventListener('click', function() {
        hoverSounds(11);
    });
    helpEcho.addEventListener('mouseover', function() {
        hoverSounds(6);
    });
    helpEcho.addEventListener('focus', function() {
        hoverSounds(6);
    });
    //////////////////////////
    let helpMovement = document.getElementById('movement');
    helpMovement.addEventListener('click', function() {
        hoverSounds(12);
    });
    helpMovement.addEventListener('mouseover', function() {
        hoverSounds(7);
    });
    helpMovement.addEventListener('focus', function() {
        hoverSounds(7);
    });
    //////////////////////////
    let helpBack = document.getElementById('back');
    helpBack.addEventListener('click', function() {
        instructions.style.display = '';
        helpDiv.style.display = 'none';
    });
    helpBack.addEventListener('mouseover', function() {
        hoverSounds(8);
    });
    helpBack.addEventListener('focus', function() {
        hoverSounds(8);
    });
    //////////////////////////
    let helpCompass = document.getElementById('compass');
    helpCompass.addEventListener('click', function() {
        hoverSounds(13);
    });
    helpCompass.addEventListener('mouseover', function() {
        hoverSounds(14);
    });
    helpCompass.addEventListener('focus', function() {
        hoverSounds(14);
    });

    controls.addEventListener( 'lock', function () {
        isPaused = false;
        instructions.style.display = 'none';
        blocker.style.display = 'none';
        if(first === false) {
            first = true;
        } else {
            paused(1);
        }
    } );    
    
    controls.addEventListener( 'unlock', function () {  
        isPaused = true;
        blocker.style.display = 'block';    
        instructions.style.display = '';
        paused(2);
    } );
    return controls;    
}