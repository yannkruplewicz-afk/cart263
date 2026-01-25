window.onload = setup;

/** function setup */
function setup() {
    console.log("we are a go!");

    /*** ALL ANSWERS TO BE ADDED IN THE ALLOCATED SPACE */
    /*** START PART ONE ACCESS */

    /* 1: all paragraph elements */
    /*** CODE */
    let allPTags = document.querySelectorAll("p");
    console.log(allPTags);

    /*** OUTPUT:
     * NodeList of all <p> elements in the document
     */


    /*************************************** */
    /* 2: only the first paragraph element */
    /*** CODE */
    let firstP = document.querySelector("p");
    console.log(firstP);

    /*** OUTPUT:
     * The first <p> element in the document
     */


    /*************************************** */
    /* 3: all elements with the class inner-container */
    /*** CODE */
    let innerContainersAccess = document.querySelectorAll(".inner-container");
    console.log(innerContainersAccess);

    /*** OUTPUT:
     * NodeList of all elements with class "inner-container"
     */


    /*************************************** */
    /* 4: the last image element inside the element that has the class img-container */
    /*** CODE */
    let lastImgInContainer = document.querySelector(".img-container img:last-of-type");
    console.log(lastImgInContainer);

    /*** OUTPUT:
     * The last <img> element inside .img-container
     */


    /*************************************** */
    /* 5A: all h2 elements */
    /* 5B: length of the list in 5A */
    /* 5C: the text content of the first element in the list from 5A */
    /*** CODE */
    let allH2s = document.querySelectorAll("h2");
    console.log(allH2s);
    console.log(allH2s.length);
    console.log(allH2s[0]?.textContent);

    /*** OUTPUT:
     * NodeList of all <h2> elements
     * Number of <h2> elements
     * Text content of first <h2>
     */


    /*************************************** */
    /* 6: the element with id parent */
    /*** CODE */
    let parentEl = document.getElementById("parent");
    console.log(parentEl);

    /*** OUTPUT:
     * The element with id="parent"
     */

    /*************************************** */
    /*** END PART ONE ACCESS */



    /*************************************** */
    /*** START PART TWO MODIFY */
    /*************************************** */

    /* NOTE: COMMENT OUT ALL PART TWO CODE WHEN DOING PART THREE */

    /*************************************** */
    /* 1: Select the first paragraph and replace the text */
    /*** CODE */
    // firstP.textContent = `New text in paragraph one: text changed by Your Name on ${new Date().toLocaleDateString()}`;


    /*************************************** */
    /* 2: Change background colors of content-container elements */
    /*** CODE */
    // let contentContainers = document.querySelectorAll(".content-container");
    // contentContainers[0].style.backgroundColor = "orange";
    // contentContainers[1].style.backgroundColor = "purple";


    /*************************************** */
    /* 3: Change the src of the first image element */
    /*** CODE */
    // let firstImg = document.querySelector("img");
    // firstImg.src = "seven.png";


    /*************************************** */
    /* 4: Replace third paragraph content with h2 TEST 123 */
    /*** CODE */
    // let thirdP = document.querySelectorAll("p")[2];
    // thirdP.innerHTML = "<h2>TEST 123</h2>";


    /*************************************** */
    /* 5: Add h2 TEST 123 to fourth paragraph */
    /*** CODE */
    // let fourthP = document.querySelectorAll("p")[3];
    // fourthP.innerHTML += "<h2>TEST 123</h2>";


    /*************************************** */
    /* 6: Add image and class to fifth paragraph */
    /*** CODE */
    // let fifthP = document.querySelectorAll("p")[4];
    // fifthP.innerHTML += '<img src="one.png">';
    // fifthP.classList.add("newStyle");


    /*************************************** */
    /* 7: Color inner-container elements using array */
    /*** CODE */
    // let colors = ['red','blue','green','orange'];
    // let innerContainers = document.querySelectorAll(".inner-container");
    // colors.forEach((color, index) => {
    //   if(innerContainers[index]){
    //     innerContainers[index].style.backgroundColor = color;
    //   }
    // });

    /*************************************** */
    /*** END PART TWO MODIFY */



    /*************************************** */
    /*** START PART THREE CREATE */
    /*************************************** */

    /* PART TWO MUST BE COMMENTED OUT ABOVE */

    /*************************************** */
    /* 1: NEW PARAGRAPHS */
    /*** CODE */

    // 1A
    let allPTagsThree = document.querySelectorAll("p");

    // 1B
    function customCreateElement(parent) {

        // 1C
        let newP = document.createElement("p");

        // 1D
        newP.textContent = "using create Element";

        // 1E
        newP.style.backgroundColor = "green";

        // 1F
        newP.style.color = "white";

        // 1G
        parent.appendChild(newP);
    }

    // 1H
    allPTagsThree.forEach(p => {
        customCreateElement(p);
    });

    /*** EXPLANATION::
     * A new paragraph is appended inside EACH existing paragraph.
     * Each new paragraph has green background and white text.
     */


    /*************************************** */
    /* 2: GRID OF BOXES */
    /*** CODE */

    // 2A
    function customNewBoxCreate(parent) {

        // 2B
        let div = document.createElement("div");
        div.classList.add("testDiv");

        // 2C
        parent.appendChild(div);

        // 2D
        return div;
    }

    let gridParent = document.getElementById("new-grid");
    let boxSize = 40;

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {

            let returnedDiv = customNewBoxCreate(gridParent);

            // 2F positioning
            returnedDiv.style.left = (col * boxSize) + "px";
            returnedDiv.style.top = (row * boxSize) + "px";
            returnedDiv.style.position = "absolute";

            // BONUS I + II
            if (row % 2 === 0) {
                returnedDiv.style.backgroundColor = "white";
                returnedDiv.textContent = "EVEN";
            } else {
                returnedDiv.style.backgroundColor = "cornflowerblue";
                returnedDiv.textContent = "ODD";
            }
        }
    }

    // Document testDiv count
    let testDivs = document.querySelectorAll(".testDiv");
    console.log(testDivs.length);

    /*** EXPLANATION::
     * 100 divs are created (10 rows × 10 columns).
     * Even rows are white with text EVEN, odd rows are blue with text ODD.
     */


    /*************************************** */
    /* 3: GRID OF BOXES II */
    /*** CODE */

    let gridThree = document.getElementById("new-grid-three");

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {

            let returnedDiv = customNewBoxCreate(gridThree);
            returnedDiv.style.position = "absolute";
            returnedDiv.style.left = (col * boxSize) + "px";
            returnedDiv.style.top = (row * boxSize) + "px";

            let remainder = col % 3;
            returnedDiv.textContent = remainder;

            if (remainder === 0) {
                returnedDiv.style.backgroundColor = "red";
            } else if (remainder === 1) {
                returnedDiv.style.backgroundColor = "orange";
            } else {
                returnedDiv.style.backgroundColor = "yellow";
            }
        }
    }

    /*
     * A second 10×10 grid is created.
     */


    /*************************************** */
    /*** END PART THREE CREATE */
    /*************************************** */

}
