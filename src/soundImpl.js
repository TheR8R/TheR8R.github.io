import * as THREE from 'three';
import {level } from './main.js';

let sound, listener, audioLoader, audioContext, source, gainNode, echoPosition, previousrandom, footstepAudioLoader, footstepSound, easterEgg;
let  random = -1; // To store the random number
export let allowMovement = false; // To check if the sound is playing or not
export let allowReset = false; // To check if the sound is playing or not
export let nextLevelAudio;
let triesToGiveUp = 0;
export class soundImpl {
    constructor(camera) {
        this.camera = camera;
        this.init(camera);
    }
    
    init(camera) { 
        // create an AudioListener and add it to the camera
        listener = new THREE.AudioListener();
        camera.add( listener );
        easterEgg = new THREE.Audio( listener );
    

        // create a global audio source
        sound = new THREE.Audio( listener );
        footstepSound = new THREE.Audio( listener );
        echoPosition = new THREE.PositionalAudio(listener);
        
        // load a sound and set it as the Audio object's buffer
        footstepAudioLoader = new THREE.AudioLoader();
        footstepAudioLoader.load( './sound/footsteps/wood/0.ogg', function( buffer ) {
            footstepSound.setBuffer( buffer );
            footstepSound.setVolume(0.5)
            footstepSound.playbackRate = 0.6;
            // sound.play();
        });

        audioLoader = new THREE.AudioLoader();
        audioLoader.load( './sound/voice/1.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setVolume(1);
            sound.playbackRate = 1;
            sound.onEnded = function() {
                allowMovement = true;
            };
            // sound.play();
        });
    }

    // Load the sound of the footsteps in sequence
    sequenceFootsteps(distancesForSound) {
        let leftDistance = distancesForSound[0];
        let rightDistance = distancesForSound[1];
        console.log("left distance: " + leftDistance);
        console.log("right distance: " + rightDistance);
        if (random === 7) {
            random = -1;
        }
        random += 1;
        previousrandom = random;
        console.log(random);
        let path = './sound/footsteps/wood/' + random + '.ogg';
        footstepAudioLoader.load( path, function( buffer ) {
            footstepSound.setBuffer( buffer );
            footstepSound.play();
            //get the source node
            source = footstepSound.source;
            // get the audio context
            audioContext = source.context;
            // create a merger node to combine the left and right channels
            let mergerNode = audioContext.createChannelMerger(2);
            
            //create a filter for the left ear
            let leftFilter = audioContext.createBiquadFilter();
            //specify the filter
            leftFilter.type = "lowpass";
            let maxDistance = leftDistance + rightDistance;
            let maxFrequency = 24000;

            //walls near
            if(maxDistance < 40) {
                maxFrequency = 6000;
            }
            //walls close
            if(maxDistance < 25) {
                maxFrequency = 1500;
            }
            let frequency = leftDistance/maxDistance * maxFrequency;
            console.log("left frequency:" + frequency);
            leftFilter.frequency.value = frequency;
            leftFilter.Q.value = 1;
            
            //create a filter for the right ear
            let rightFilter = audioContext.createBiquadFilter();
            //specify the filter
            rightFilter.type = "lowpass";
            frequency = rightDistance/maxDistance * maxFrequency;
            console.log("right frequency:" + frequency);
            rightFilter.frequency.value = frequency;
            rightFilter.Q.value = 1;

            //create a gain node            
            gainNode = audioContext.createGain();
            gainNode.gain.value = 0.4;
            
            //connect the nodes 
            source.connect(leftFilter);
            source.connect(rightFilter);
            leftFilter.connect(mergerNode, 0, 0);
            rightFilter.connect(mergerNode, 0, 1);
            mergerNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
        });
    }


    isPlaying() {
        return footstepSound.isPlaying;
    }

    getSound() {
        return sound;
    }

    playSound() {
        sound.play();
    }

    echoSound(point, name) {
        echoPosition = new THREE.PositionalAudio(listener);
        let path = './sound/echolocate/0.mp3';
        if (name === "victory") {
            path = './sound/echolocate/1.mp3';
        } 
        audioLoader.load( path, function( buffer ) {
            echoPosition.setBuffer( buffer );
            echoPosition.setRefDistance(15);
            echoPosition.setRolloffFactor(1);
            echoPosition.setDistanceModel('inverse');
            echoPosition.setVolume(2);
            echoPosition.panner.setPosition(point.point.x, point.point.y, point.point.z);
            echoPosition.play();
        });
    }



    playWinningSound() {
        let win = new THREE.Audio( listener );
        audioLoader.load( './sound/positive.mp3', function( buffer ) {
            win.setBuffer( buffer );
            win.setVolume(0.1);
            win.play();
        });
    }

    playClickTutorial() {
        let click = new THREE.Audio( listener );
        audioLoader.load( './sound/voice/2.mp3', function( buffer ) {
            click.setBuffer( buffer );
            click.setVolume(1);
            click.play();
        });
    }

    reloadTutorialSound() {
        let reload = new THREE.Audio( listener );
        audioLoader.load( './sound/voice/3.mp3', function( buffer ) {
            reload.setBuffer( buffer );
            reload.setVolume(1);
            reload.onEnded = function() {
                allowReset = true;
            };
            reload.play();
        });
    }

}

export function reloadSound() {
    let reload = new THREE.Audio( listener );
    audioLoader.load( './sound/voice/resetLevel.mp3', function( buffer ) {
        reload.setBuffer( buffer );
        reload.setVolume(1);
        reload.play();
    });
}

export function nextLevelSound() {
    let reload = new THREE.Audio( listener );
    audioLoader.load( './sound/voice/skipLevel.mp3', function( buffer ) {
        reload.setBuffer( buffer );
        reload.setVolume(1);
        reload.play();
    });
}

export function paused(variation) {
    let pause = new THREE.Audio( listener );
    let path;
    if(variation === 0) {
        path = './sound/menu/clickToPlay.mp3';
    } else if(variation === 1) {
        path = './sound/menu/unpaused.mp3';
    } else {
        path = './sound/menu/paused.mp3';
    }
    audioLoader.load( path, function( buffer ) {
        pause.setBuffer( buffer );
        pause.setVolume(1);
        pause.play();
     });
}

export function triedToGiveUp() {
    
    if(!easterEgg.isPlaying){
        let path;
        if(triesToGiveUp === 0) {
            path = './sound/voice/E1.mp3';
            triesToGiveUp += 1;
        } else if(triesToGiveUp === 1) {
            path = './sound/voice/E2.mp3';
            triesToGiveUp += 1;
        } else {
            path = './sound/voice/E3.mp3';
        }
        audioLoader.load( path, function( buffer ) {
            easterEgg.setBuffer( buffer );
            easterEgg.setVolume(1);
            easterEgg.play();
        });
    }
}

export function giveUpTutorialSound() {
    let giveUp = new THREE.Audio( listener );
    audioLoader.load( './sound/voice/4.mp3', function( buffer ) {
        giveUp.setBuffer( buffer );
        giveUp.setVolume(1);
        giveUp.onEnded = function() {
            nextLevelAudio = new THREE.PositionalAudio(listener);
            audioLoader.load( './sound/portalRadio.mp3', function( buffer ) {
                nextLevelAudio.setBuffer( buffer );
                nextLevelAudio.setRefDistance(15);
                nextLevelAudio.setRolloffFactor(2.5);
                nextLevelAudio.setDistanceModel('inverse');
                nextLevelAudio.setVolume(1);
                nextLevelAudio.setLoop(true);
                nextLevelAudio.panner.setPosition(50, 0, 50);
                level.addExit();
                nextLevelAudio.play();
            });
            level.addExit();
        };
        giveUp.play();
    });
}

export function youFinishedAudio() {
    let finish = new THREE.Audio( listener );
    audioLoader.load( './sound/voice/completedTheTrial.mp3', function( buffer ) {
        finish.setBuffer( buffer );
        finish.setVolume(1);
        finish.play();
    });
}


