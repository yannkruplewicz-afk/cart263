1st review

https://philippe-bn.github.io/cart263/projects/project-1/


2nd review

https://benmsky.github.io/CART263-main/CART263-main/project1/


3rd review

https://emilebedard.github.io/cart263/Projects/project1/Interactive_Bike_Garage/




I had the chance to experience the different projects made both in class and remotely, using my laptop. The ones i have found the most interesting share the same pattern : a game easy to understand and where the interactivity brings the fun. My first example is the Garage program by Emile Bedard (https://emilebedard.github.io/cart263/Projects/project1/Interactive_Bike_Garage/) where i found the idea of creating a garage with all the pieces and characteristics of bikes represented pretty intersting and personnal. You can register new bikes, and learn more about bike in general. It shows the author's passion for this area. I noticed the time that has been involved in the 'register parts' side after talking with the creator itself. It is the most interactive part of the program and is where you create your own experience in the game. This experience is created thanks to the function 'registerParts' and the 'bikeData'variable as we can see here : 


function registerParts() {

    let bikeData = {
        bikeName: document.getElementById("toolboxNameInput").value,
        bikeColor: bikeInfo.bikeColor,
        bikeType: document.getElementById("toolboxTypeInput").value,
        bikeHandlebars: document.getElementById("handlebarsInput").value,
        bikeFrame: document.getElementById("frameInput").value,
        bikeSize: document.getElementById("sizeInput").value,
        bikeWheels: document.getElementById("wheelsInput").value,
        bikeTires: document.getElementById("tiresInput").value,
        bikeRearDerailleur: document.getElementById("rearDerailleurInput").value,
        bikeFrontDerailleur: document.getElementById("frontDerailleurInput").value,
        bikeCassette: document.getElementById("cassetteInput").value,
        bikePlateau: document.getElementById("plateauInput").value,
        bikeCranks: document.getElementById("cranksInput").value,
        bikePedals: document.getElementById("pedalsInput").value,
    }
    
    

Another work i have found compelling is the 'worm fishing survival game' (https://benmsky.github.io/CART263-main/CART263-main/project1/) by Benjamin Mackinovsky where i like the idea of creating a shooting game out of fish and bubbles using a simple code that works, simply following the movements of the mouse as we can see in that part of the code : 

// Mouse Tracking
canvas.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
canvas.addEventListener('click', () => { if (!isGameOver && !wavePaused) shootProjectile(); });

// Shoot Bubble
function shootProjectile() {
  const headX = player.x;
  const headY = player.y + Math.sin(player.wiggleOffset) * 10;
  const baseAngle = Math.atan2(mouse.y - headY, mouse.x - headX);
  

There, i was interested in the concept of creating levels, called 'waves', the game gradually getting harder as the waves arise. The legend created on the top left side of the screen is also a good idea and helps the player undertand even more easily the game.

This is something that I noticed and valued because after trying different other games created among the list of github links, I have that some games had a concept kind of abstract or hard to undertand at first, but the thing is that these games didn't have a legend either. In some cases i would just not get it, so the fun disappears, even if the interactivity had good artistic purposes and ideas. Now i can also reflect in my group's game where i feel like creating a legend could have been a good idea.
  
  
  Finally, a third work i have found particularly interesting also uses that same mouse position logic (https://philippe-bn.github.io/cart263/projects/project-1/), making a group of fish follow the mouse's movements. I feel like this one is very successful because we understand the concept really quickly and the aesthetics are nice. Also it is very responsive and answers fast to the mouse's movements. I appreciated the idea of making every fish leave whenever the mouse is idle, it adds even more interactivity, the spectator not only HAS to be there but also to EXPERIENCE it. However, using the keyboard to create a second interaction could have had something even more playful. For example, the fish could multiply when typing on space until a certain number, giving an idea of reproduction, and then at some point, they could be reduced using the same space key, giving the impression they are eating each other. Regarding the aesthetics again, the different sizes and colors of the fish are well chosen and create an interesting visual.
  
  
  There are many possibilities to create with javascript, and all the works done in this class explore very different concepts and use different coding elements, from cart253 to cart263 and from variables to camera recording. The reasons why i have preferred this works over others are simple. They follow the 'KISS' anagram, which is Keep It Simple (Stupid), and enjoy !
  
  


Yann Kruplewicz