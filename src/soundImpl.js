import * as THREE from 'three';
import {level } from './main.js';

let audioLoader, audioContext, source, gainNode, previousrandom, footstepAudioLoader, sound, tutorialSound, footstepSound, easterEgg, completedSound;
let  random = -1; // To store the random number
let listener = new THREE.AudioListener();
let menuSound = new THREE.Audio( listener );
let pause = new THREE.Audio(listener);
let hoverSoundAllowed = true;
let hastriedToGiveUp = false;
let radioHasPlayed = false;
export let echoPosition;
export let allowMovement = false; 
export let allowClick = false; 
export let allowReset = false; 
export let nextLevelAudio; 
let triesToGiveUp = 0;

export function skipTutorialSound() {
    allowClick = true;
    allowMovement = true;
    allowReset = true;
    playLevelSound();
}

export class soundImpl {
    constructor(camera) {
        this.camera = camera;
        this.init(camera);
    }
    
    init(camera) { 
        // create an AudioListener and add it to the camera
        camera.add( listener );

        sound = new THREE.Audio( listener );
        easterEgg = new THREE.Audio( listener );
        footstepSound = new THREE.Audio( listener );
        tutorialSound = new THREE.Audio( listener );
        completedSound = new THREE.Audio( listener );

        // create a global audio source
        echoPosition = new THREE.PositionalAudio(listener);
        nextLevelAudio = new THREE.PositionalAudio(listener);
        
        // load a sound and set it as the Audio object's buffer
        footstepAudioLoader = new THREE.AudioLoader();
        footstepAudioLoader.load( './sound/footsteps/wood/0.ogg', function( buffer ) {
            footstepSound.setBuffer( buffer );
            footstepSound.setVolume(0.2)
            footstepSound.playbackRate = 1;
        });

        audioLoader = new THREE.AudioLoader();
        audioLoader.load( './sound/voice/1.mp3', function( buffer ) {
            tutorialSound.setBuffer( buffer );
            tutorialSound.setVolume(1);
            tutorialSound.playbackRate = 1;
            tutorialSound.onEnded = function() {
                allowMovement = true;
                tutorialSound.stop();
            };
        });
    }

    // Load the sound of the footsteps in sequence
    sequenceFootsteps(distancesForSound) {
        let leftDistance = distancesForSound[0];
        let rightDistance = distancesForSound[1];
        console.log("left distance: " + leftDistance);
        console.log("right distance: " + rightDistance);
        if (random === 5) {
            random = -1;
        }
        random += 1;
        previousrandom = random;
        console.log(random);
        let path = './sound/footsteps/newConcrete4/' + random + '.ogg';
            footstepAudioLoader.load( path, function( buffer ) {
                footstepSound.setBuffer( buffer );
                if(footstepSound.isPlaying === false){
                    footstepSound.play();
                }
                //get the source node
                source = footstepSound.source;
                // get the audio context
                audioContext = source.context;
                
                // create a merger node to combine the left and right channels
                let mergerNode = audioContext.createChannelMerger(2);
                
                let maxDistance = leftDistance + rightDistance;
                let maxFrequency = 24000;
                //walls near
                if(maxDistance < 50) {
                    maxFrequency = 1000;
                }
                //walls close
                if(maxDistance < 25) {
                    maxFrequency = 100;
                }
                //create a filter for the left ear
                let leftFilter = audioContext.createBiquadFilter();
                //specify the filter
                leftFilter.type = "lowpass";
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
                gainNode.gain.value = 0.3;
                
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

    playTutorialSound() {
        tutorialSound.play();
    }

    echoSound(point, name) {
        echoPosition = new THREE.PositionalAudio(listener);
        let path = './sound/echolocate/0.mp3';
        if (name === "victory") {
            path = './sound/echolocate/1.mp3';
        } 
        audioLoader.load( path, function( buffer ) {
            echoPosition.setBuffer( buffer );
            echoPosition.setRefDistance(10);
            echoPosition.setRolloffFactor(1);
            echoPosition.setDistanceModel('inverse');
            echoPosition.setVolume(2);
            echoPosition.onEnded = function() {
                echoPosition.stop();
            }
            echoPosition.panner.setPosition(point.point.x, point.point.y, point.point.z);
            echoPosition.play();
        });
    }

    playWinningSound() {
        audioLoader.load( './sound/positive.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setVolume(0.06);
            sound.onEnded = function() {
                sound.stop();
                playLevelSound();
                sound.setBuffer( null); // clear the buffer so it doesn't play again when unpausing
            }
            sound.stop(); // stop the sound if it is playing
            sound.play(); // play the sound
        });
    }


    playClickTutorial() {
        audioLoader.load( './sound/voice/2.mp3', function( buffer ) {
            tutorialSound.setBuffer( buffer );
            tutorialSound.setVolume(1);
            tutorialSound.onEnded = function() {
                allowClick = true;
                tutorialSound.stop();
                tutorialSound.setBuffer( null); // clear the buffer so it doesn't play again when unpausing
            };
        tutorialSound.stop(); // stop the sound if it is playing
        tutorialSound.play(); // play the sound
        });
    }

    reloadTutorialSound() {
        audioLoader.load( './sound/voice/3.mp3', function( buffer ) {
            tutorialSound.setBuffer( buffer );
            tutorialSound.setVolume(1);
            tutorialSound.onEnded = function() {
                allowReset = true;
                tutorialSound.stop();
                tutorialSound.setBuffer( null); // clear the buffer so it doesn't play again when unpausing
            };
            tutorialSound.stop(); // stop the sound if it is playing
            tutorialSound.play(); // play the sound
        });
    }

    playCompassSound() {
        let compass = new THREE.Audio( listener );
        audioLoader.load( './sound/soundCompassClick.mp3', function( buffer ) {
            compass.setBuffer( buffer );
            compass.setVolume(0.03);
            compass.play(); // play the sound
        });
    }

}

export function reloadSound() {
    audioLoader.load( './sound/voice/resetLevel.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setVolume(1);
        sound.onEnded = function() {
            sound.stop();
            sound.setBuffer( null); // clear the buffer so it doesn't play again when unpausing
        }
        sound.stop(); // stop the sound if it is playing
        sound.play(); // play the sound
    });
}

export function nextLevelSound() {
    audioLoader.load( './sound/voice/skipLevel.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setVolume(1);
        sound.onEnded = function() {
            sound.stop();
            sound.setBuffer( null); // clear the buffer so it doesn't play again when unpausing
            playLevelSound();
        }
        sound.stop(); // stop the sound if it is playing
        sound.play(); // play the sound
    });
}

export function paused(variation) {
    pause = new THREE.Audio( listener );
    hoverSoundAllowed = false
    let path;
    if(variation === 1) {
        path = './sound/menu/unpaused.mp3';
    } else {
        path = './sound/menu/paused.mp3';
        if(sound.isPlaying){
            sound.pause();
        }
        if(nextLevelAudio.isPlaying){
            nextLevelAudio.pause();
        }
        if(easterEgg.isPlaying){
            easterEgg.pause();
        }
        if(tutorialSound.isPlaying && tutorialSound.buffer !== null){
            tutorialSound.pause();
        }
    }
    audioLoader.load( path, function( buffer ) {
        pause.setBuffer( buffer );
        pause.setVolume(1);
        pause.onEnded = function() {
            if(variation === 1){
                sound.play();
                tutorialSound.play();
                if(level.leftTestingLevel === false && radioHasPlayed === true){
                    nextLevelAudio.play();
                }
                if(hastriedToGiveUp === true){
                    easterEgg.play();
                }
            }
            hoverSoundAllowed = true;
            pause.stop();
        };
        pause.play();
     });
}

export function triedToGiveUp() {
    if(!easterEgg.isPlaying){
        hastriedToGiveUp = true;
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
            easterEgg.onEnded = function() {
                easterEgg.stop();
                easterEgg.setBuffer( null); // clear the buffer so it doesn't play again when unpausing
            }
            easterEgg.play();
        });
    }
}

export function giveUpTutorialSound() {
    audioLoader.load( './sound/voice/4.mp3', function( buffer ) {
        tutorialSound.setBuffer( buffer );
        tutorialSound.setVolume(1);
        tutorialSound.onEnded = function() {
            tutorialSound.setBuffer( null); // clear the buffer so it doesn't play again when unpausing
            tutorialSound.stop();
            audioLoader.load( './sound/portalRadio2.mp3', function( buffer ) {
                if(nextLevelAudio.isPlaying === false && radioHasPlayed === false){
                    radioHasPlayed = true;
                    nextLevelAudio.setBuffer( buffer );
                    nextLevelAudio.setRefDistance(15);
                    nextLevelAudio.setRolloffFactor(2.5);
                    nextLevelAudio.setDistanceModel('inverse');
                    nextLevelAudio.setVolume(1);
                    nextLevelAudio.setLoop(true);
                    nextLevelAudio.panner.setPosition(50, 0, 50);
                    nextLevelAudio.play();
                }
            });
            tutorialLoop();
            level.addExit();
        };
        tutorialSound.stop(); // stop the sound if it is playing
        tutorialSound.play(); // play the sound
    });
}

export function stopTutorialAudio() {
    if(tutorialSound.isPlaying === true)
        tutorialSound.setLoop(false);
        tutorialSound.stop();
        tutorialSound.setBuffer( null); // clear the buffer so it doesn't play again when unpausing
}

export function stopEasterEgg() {
    if(easterEgg.isPlaying === true)
        easterEgg.stop();
        easterEgg.setBuffer( null); // clear the buffer so it doesn't play again when unpausing
}

function tutorialLoop() {
    audioLoader.load( './sound/voice/5.mp3', function( buffer ) {
        tutorialSound.setBuffer( buffer );
        tutorialSound.setVolume(1);
        tutorialSound.onEnded = function() {
            tutorialSound.setBuffer( null); // clear the buffer so it doesn't play again when unpausing
            tutorialSound.stop();
        }
        tutorialSound.setLoop(true);
        tutorialSound.play(); // play the sound
    });
}


export function youFinishedAudio() {
    audioLoader.load( './sound/voice/completedTheTrial.mp3', function( buffer ) {
        completedSound.setBuffer( buffer );
        completedSound.setVolume(1);
        completedSound.setLoop(true);
        completedSound.stop(); // stop the sound if it is playing
        completedSound.play(); // play the sound
    });
}

export function hoverSounds(buttonNumber) {
    if(pause.isPlaying === false){
        let path;
        if(hoverSoundAllowed){
            if (buttonNumber === 1) {
                path = './sound/menu/clickToPlay.mp3';
            }
            if (buttonNumber === 2) {
                path = './sound/menu/help.mp3';
            }
            if (buttonNumber === 3) {
                path = './sound/menu/linkToQuestionnaire.mp3';
            }
            if (buttonNumber === 4) {
                path = './sound/menu/howToResetHover.mp3';
            }
            if (buttonNumber === 5) {
                path = './sound/menu/howToSkipHover.mp3';
            }
            if (buttonNumber === 6) {
                path = './sound/menu/howToEchoHover.mp3';
            }
            if (buttonNumber === 7) {
                path = './sound/menu/howToMoveHover.mp3';
            }
            if (buttonNumber === 8) {
                path = './sound/menu/backToMainMenuHover.mp3';
            }
            if (buttonNumber === 9) {
                path = './sound/menu/howToReset.mp3';
            }
            if (buttonNumber === 10) {
                path = './sound/menu/howToSkip.mp3';
            }
            if (buttonNumber === 11) {
                path = './sound/menu/howToEcho.mp3';
            }
            if (buttonNumber === 12) {
                path = './sound/menu/howToMove.mp3';
            }
            if (buttonNumber === 13) {
                path = './sound/menu/howToTick.mp3';
            }
            if (buttonNumber === 14) {
                path = './sound/menu/howToTickHover.mp3';
            }

            audioLoader.load( path, function( buffer ) {
                menuSound.setBuffer( buffer );
                menuSound.setVolume(1);
                menuSound.onEnded = function() {
                    menuSound.stop();
                }
                menuSound.stop(); // stop the sound if it is playing
                menuSound.play();
            });
        }
    }
}

function playLevelSound() {
    let levelNumber = level.getLevelNumber();
    let path = './sound/voice/lvl' + levelNumber + '.mp3';
    audioLoader.load( path, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setVolume(1);
        sound.onEnded = function() {
            sound.setBuffer( null); // clear the buffer so it doesn't play again when unpausing
            sound.stop();
        }
        sound.stop(); // stop the sound if it is playing
        sound.play(); // play the sound
    });
}
