# REVIEW 1

I really like the work of Emile Bedard ([https://emilebedard.github.io/cart263/Projects/project2/interactive_bike_garage_ii/](https://emilebedard.github.io/cart263/Projects/project2/interactive_bike_garage_ii/)). It is the sequel / advanced version of his previous work that I had written about also, but this advancement is truly amazing. I love the interactive components of his work. The 3D elements are really well done and the mouse function being used to enable the user to look around using his mouse's position is really inventive and immersive. I really like also the background 3D element (behind the window); it makes the garage look more realistic. Even though the 'maintenance' and 'register' parts didn't move that much between the two projects, which is fine because they work well as they are, I would have added an element which is to make the bike appear with their colors and type when you register them; it would make the program even more interactive.

Regarding the code, I took a closer look at how the 3D elements were made and they were created using models imported and rendered in Three.js:

```js
// THREE.JS imports ----
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
```

The difficulty might then have been to dispose them as best as possible so that they look real and conform to the perspective of a 3D space.

---

# REVIEW 2

[https://scarlett253.github.io/263_p2_ys/](https://scarlett253.github.io/263_p2_ys/)

This is the second project that really impressed me. The concept is interesting and works well: you're looking for a hidden character and once you see it (or at least once it appears on your screen), it respawns. The mouse function here is used as well and does an amazing job because the delay between the moment my mouse allows me to see the character and when I actually see it is taken into account, so there is a small delay between visibility and respawn. The 3D animation, here again, is absolutely awesome. The background space model is well chosen and the music as well. The music gives this project a special essence that wouldn't be there if it was silent. Moreover, that project might have been inspired by task 7 where we had to make space animations with planets and characters in a solar system.

I focused on the part regarding how it is possible to make the character disappear and respawn once it has been seen on screen:

```js
function teleportHidden(hiddenPlayer, player) {
  const mapLimit = 5;
  let newPos;
  let distance;

  do {
    newPos = {
      x: Math.random() * mapLimit * 2 - mapLimit,
      z: Math.random() * mapLimit * 2 - mapLimit,
    };

    distance = Math.sqrt(
      Math.pow(newPos.x - player.position.x, 2) +
      Math.pow(newPos.z - player.position.z, 2)
    );
  } while (distance < 4);

  hiddenPlayer.position.set(newPos.x, 2, newPos.z);
}
```

Here, the character takes a random position, makes sure it is not too close to the player (distance < 4), and moves the hidden player there. I realize that I was actually wrong since the beginning: there is no mouseX or mouseY detection involved. The character respawns at regular intervals at a random location away from the player.

---

# REVIEW 3

[https://jakehayduk.github.io/cart263/project-2/](https://jakehayduk.github.io/cart263/project-2/)

I really like the core idea of this program. It is like a Scrabble game. I like that you enter your name and then pick a character. I was expecting some kind of maze or adventure game, but I was totally wrong. The letters "CA" appeared on my screen so I started clicking on it, which resulted in nothing. Then I wrote "Canada", and earned coins. I like the sound effects; they are well chosen and synchronized. The gameplay interface is also cool, with a difficulty level, coins, and settings containing even a rule book. A small issue I noticed is that you cannot swipe down on the settings menu, but otherwise I like the originality of the concept. An upgrade I would suggest is to integrate different languages and allow changing or mixing them.

What I found most interesting in the code is how word detection works:

```js
if (
  (result == true || result2 == true) &&
  checkInclude == true &&
  answer.length > 2 &&
  checkDuplicates == false
)
```

A word is considered correct if it exists in the dictionary files, if it contains the prompt, if it is at least 3 characters long, and if it has not been used before.

---

# CONCLUSION

All these three projects awakened my curiosity. I found them compelling, and analysing them helped me understand them better.

— Yann Kruplewicz
