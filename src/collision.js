// let playerBoundingBox, playerPosition, x, y, z;
let intersects;
export function checkForCollision(raycasters, scene, player) {
   // check for collision
      for (let i = 0; i < 4; i++) {
         intersects = raycasters[i].intersectObjects(scene.children);
         if (intersects.length > 0) {
            if (intersects[0].distance < 0.8){
               player.setPosition(player.getPosition().x - raycasters[i].ray.direction.x, player.getPosition().z - raycasters[i].ray.direction.z);
            }
         }
      }

}
