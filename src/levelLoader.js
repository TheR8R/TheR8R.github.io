import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { nextLevelAudio, youFinishedAudio, stopTutorialAudio } from './soundImpl.js';

let currentLevel;
let root = null;
let cube = null;
export class loadLevel {
    constructor(scene, player) {
        this.init(scene, player);
    }

    init(scene, player) {
        this.player = player;
        this.scene = scene;
        this.testingLevel(this.scene);
        this.leftTestingLevel = false;
    }

    getLevelNumber() {
        return currentLevel;
    }

    testingLevel(scene) {
        if(root === null){ 
            //do nothing
        } else {
            scene.remove(root);
        }
        currentLevel = 0;
        const glftLoader = new GLTFLoader();
        glftLoader.load('./levels/testlevel.gltf', function(gltf) {
            root = gltf.scene;
            gltf.scene.traverse(function(child) {
                if(child.material) child.material.metalness = 0;
            });
            root.scale.set(5, 4, 5);
            
            scene.add(root); 
        }, function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '%  loaded');
        }, function(error) {
            console.log('An error happened');
        });
        this.player.setPosition(0, 0);
        this.player.setRotation(0);
    }
    
    level1(scene) {
        stopTutorialAudio();
        nextLevelAudio.stop();
        this.leftTestingLevel = true;
        if(currentLevel === 6){
            youFinishedAudio();
        }
        currentLevel = 1;
        scene.remove(root);
        const glftLoader = new GLTFLoader();
        glftLoader.load('./levels/lvl1.gltf', function(gltf) {
            root = gltf.scene;
            gltf.scene.traverse(function(child) {
                if(child.material) child.material.metalness = 0;
            });
            root.scale.set(2.6, 1.8, 4);
            root.position.set(0, 0, -65);
            scene.add(root); 
        }, function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '%  loaded');
        }, function(error) {
            console.log('An error happened');
        });
        this.player.setPosition(0, 0);
        this.player.setRotation(0);
        this.addExit();
    }

    level2(scene) {
        currentLevel = 2;
        scene.remove(root);
        const glftLoader = new GLTFLoader();
        glftLoader.load('./levels/lvl2.gltf', function(gltf) {
            root = gltf.scene;
            gltf.scene.traverse(function(child) {
                if(child.material) child.material.metalness = 0;
            });
            root.scale.set(4, 2, 1.5);
            root.position.set(25, 0, -20);
            scene.add(root); 
        }, function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '%  loaded');
        }, function(error) {
            console.log('An error happened');
        });
        this.player.setPosition(0, 0);
        this.addExit();
    }

    level3(scene) {
        currentLevel = 3;
        scene.remove(root);
        const glftLoader = new GLTFLoader();
        glftLoader.load('./levels/lvl3.gltf', function(gltf) {
            root = gltf.scene;
            gltf.scene.traverse(function(child) {
                if(child.material) child.material.metalness = 0;
            });
            root.scale.set(5, 2, 4);
            root.position.set(-35, 0, 70);
            scene.add(root); 
        }, function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '%  loaded');
        }, function(error) {
            console.log('An error happened');
        });
        this.player.setPosition(0, 0);
        this.player.setRotation(1.5);
        this.addExit();
    }

    level4(scene) {
        currentLevel = 4;
        scene.remove(root);
        const glftLoader = new GLTFLoader();
        glftLoader.load('./levels/lvl4.gltf', function(gltf) {
            root = gltf.scene;
            gltf.scene.traverse(function(child) {
                if(child.material) child.material.metalness = 0;
            });
            root.scale.set(3, 2, 2);
            root.position.set(30, 0, 30);
            scene.add(root); 
        }, function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '%  loaded');
        }, function(error) {
            console.log('An error happened');
        });
        this.player.setPosition(0, 0);
        this.player.setRotation(3.15);
        this.addExit();
    }

    level5(scene) {
        currentLevel = 5;
        scene.remove(root);
        const glftLoader = new GLTFLoader();
        glftLoader.load('./levels/lvl5v2.gltf', function(gltf) {
            root = gltf.scene;
            gltf.scene.traverse(function(child) {
                if(child.material) child.material.metalness = 0;
            });
            root.scale.set(3, 2, 3);
            root.position.set(-35, 0, 15);
            scene.add(root); 
        }, function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '%  loaded');
        }, function(error) {
            console.log('An error happened');
        });
        this.player.setPosition(0, 0);
        this.player.setRotation(3);
        this.addExit();
    }

    level6(scene) {
        currentLevel = 6;
        scene.remove(root);
        const glftLoader = new GLTFLoader();
        glftLoader.load('./levels/lvl6.gltf', function(gltf) {
            root = gltf.scene;
            gltf.scene.traverse(function(child) {
                if(child.material) child.material.metalness = 0;
            });
            root.scale.set(3, 2, 3);
            root.position.set(80, 0, 40);
            scene.add(root); 
        }, function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '%  loaded');
        }, function(error) {
            console.log('An error happened');
        });
        this.player.setPosition(0, 0);
        this.player.setRotation(4);
        this.addExit();
    }

    reloadLevel(){
        if(currentLevel === 0){
            this.testingLevel(this.scene);
        } else if(currentLevel === 1){
            this.level1(this.scene);
        } else if(currentLevel === 2){
            this.level2(this.scene);
        } else if(currentLevel === 3){
            this.level3(this.scene);
        } else if(currentLevel === 4){
            this.level4(this.scene);
        } else if(currentLevel === 5){
            this.level5(this.scene);
        } else if(currentLevel === 6){
            this.level6(this.scene);
        }
    }

    nextLevel() {
        if(currentLevel === 0){
            this.level1(this.scene);
        } else if(currentLevel === 1){
            this.level2(this.scene);
        } else if(currentLevel === 2){
            this.level3(this.scene);
        } else if(currentLevel === 3){
            this.level4(this.scene);
        } else if(currentLevel === 4){
            this.level5(this.scene);
        } else if(currentLevel === 5){
            this.level6(this.scene);
        } else if(currentLevel === 6){
            this.level1(this.scene);
        }
    }

    addExit() {
        let victoryBB = this.createVictoryBoundingBox(currentLevel);
        this.player.setWinningBox(victoryBB);
    }

    createVictoryBoundingBox(levelNumber) {
        if(levelNumber === 0){
            if(cube !== null){
                this.scene.remove(cube);
            }
            let geometry = new THREE.BoxGeometry( 10, 33, 10 );
            let material = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true, opacity: 0.5} );
            cube = new THREE.Mesh( geometry, material );
            cube.position.set(45, 0, 45);
            cube.name = "victory";
            let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            cubeBB.setFromObject(cube);
            this.scene.add( cube );
            return cubeBB;
        }
        if(levelNumber === 1){
            this.scene.remove(cube);
            let geometry = new THREE.BoxGeometry( 13, 33, 5 );
            let material = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true, opacity: 0.5} );
            cube = new THREE.Mesh( geometry, material );
            cube.position.set(0, 0, -145);
            cube.name = "victory";
            let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            cubeBB.setFromObject(cube);
            this.scene.add( cube );
            return cubeBB;
        }
        if(levelNumber === 2){
            this.scene.remove(cube);
            let geometry = new THREE.BoxGeometry( 13, 35, 13 );
            let material = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true, opacity: 0.5} );
            cube = new THREE.Mesh( geometry, material );
            cube.position.set(80, 0, -33);
            cube.name = "victory";
            let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            cubeBB.setFromObject(cube);
            this.scene.add( cube );
            return cubeBB;
        }
        if(levelNumber === 3){
            this.scene.remove(cube);
            let geometry = new THREE.BoxGeometry( 25, 35, 17 );
            let material = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true, opacity: 0.5} );
            cube = new THREE.Mesh( geometry, material );
            cube.position.set(-35, 0, 145);

            cube.name = "victory";
            let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            cubeBB.setFromObject(cube);
            this.scene.add( cube );
            return cubeBB;
        }
        if(levelNumber === 4){
            this.scene.remove(cube);
            let geometry = new THREE.BoxGeometry( 12, 35, 2 );
            let material = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true, opacity: 0.5} );
            cube = new THREE.Mesh( geometry, material );
            cube.position.set(84 , 0, -10);
            cube.name = "victory";
            let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            cubeBB.setFromObject(cube);
            this.scene.add( cube );
            return cubeBB;
        }
        if(levelNumber === 5){
            this.scene.remove(cube);
            let geometry = new THREE.BoxGeometry( 2, 35, 18 );
            let material = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true, opacity: 0.5} );
            cube = new THREE.Mesh( geometry, material );
            cube.position.set(-79 , 0, 3);
            cube.name = "victory";
            let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            cubeBB.setFromObject(cube);
            this.scene.add( cube );
            return cubeBB;
        }
        if(levelNumber === 6){
            this.scene.remove(cube);
            let geometry = new THREE.BoxGeometry( 18, 35, 4 );
            let material = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true, opacity: 0.5} );
            cube = new THREE.Mesh( geometry, material );
            cube.position.set(120, 0, 105);
            cube.name = "victory";
            let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            cubeBB.setFromObject(cube);
            this.scene.add( cube );
            return cubeBB;
        }
    }

}