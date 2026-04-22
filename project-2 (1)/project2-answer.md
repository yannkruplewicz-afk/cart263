1st review
https://emilebedard.github.io/cart263/Projects/project2/interactive_bike_garage_ii/





I really like the work of Emile Bedard ( 
https://emilebedard.github.io/cart263/Projects/project2/interactive_bike_garage_ii/ ). It is the sequel / advanced version of his previous work that i had written about also, but this one advancement is truly amazing. I love the interactive components of his work. The 3d elements are really well done and the mouse function being used to enable the user to look around using his mouse's position is really inventive and immersive. I really like also the background 3d element ( behind the window ) it makes the garage look more realistic. Even though the 'maintenance' and 'register' parts didn't move that much between the 2 projects, which is fine because they work well as they are, i would have added an element which is to make the bike appear with their colors and type when you register them, it would make the program even more interactive.

Regarding the code i took a closer look to how the 3d elements were made and they were made using models that the digital artist superimposed as we can see in the code here in the file 'InteractiveBikeGarage2-ThreeJS.js
':

// THREE.JS imports ----
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';


The difficulty might then have been to dispose them as best as possible so that they look real and conformed to the perspective of a 3d space.






2nd review

https://scarlett253.github.io/263_p2_ys/



This is the 2nd project that really impressed me. The concept is interesting and works well. The concept being that you're looking for a hidden character and once you see it, or at least once it appears at your screen, it respawns. The mouse function here is used as well and does an amazing job because the delay between the moment when my mouse allows me to see the character and when i see the character is taken into account so there is a small 3s delay between the moment the character is visible and when it respawns. The 3d animation, here again, is absolutely awesome. The background space model is well chosen and the music as well ! The music gives to this project a special essence that wouldn't be there is it was silent. Moreover, that project might have been inspired by task 7, where we had to make a space animations with planets and characters in a solar system because here we kind of have a separated world floating in space, just hanging there. 

I focused on the part regarding how was it possible to make the character disappear and respawn once it has been seen at the screen and here's the concerned part of the code :  

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
        Math.pow(newPos.z - player.position.z, 2),
    );
  } while (distance < 4);

  hiddenPlayer.position.set(newPos.x, 2, newPos.z);
}

Here, the character takes a random position, makes sure it is not too close to the player ( distance < 4) and moves the character hidden there. So i realize that i was actually wrong since the beginning and that this program is tricky. The character is automatically going to respawn at the same interval of seconds at a place located a bit far from the player, there's actually no mouseX or mouseY function involved there, it is only calculated and randomised.



3rd review

https://jakehayduk.github.io/cart263/project-2/



I really like the core idea of this program. It is like a scrabble game. I like that you enter your name and then pick a character, there I was expecting some kind of a maze or adventure game, but i was totally wrong. Also, i didn't pay attention to the title : 'word nerd'... The letters 'CA' appeared at my screen so i started clicking on it, which resulted in nothing, of course... Then i wrote Canada, and earned coins ! I like the sound effects, they are well chosen and synchronised. The gameplay interface also is cool, with a difficulty level, coins and settings containing even a rule book ! A default i noticed is that you cannot swipe down on the settings menu, but otherwise i like the originality of the concept. An upgrade i would suggest is to integrate different languages and a possibility to either change the language of the gameplay or to mix them.

What i found most interesting about the code is how the logic of detecting if a word exists or not is made. Because i tried to tap a word that doesn't exist and it didn't recognize it, so i was curious. The answer is here : 

if (
  (result == true || result2 == true) &&
  checkInclude == true &&
  answer.length > 2 &&
  checkDuplicates == false
)

Here, we understand that a word is correct if it exists in the dictionnary (using json files like text.json or birds.json), if it contains the prompt, if it is at least 3 characters and if it hasn't been used before.




All these 3 projects awoke my curiosity, i found them compelling. Talking about them was also interesting and a good way to undertand them better.


Yann Kruplewicz