window.onload = setup;

function setup() {
    console.log("we are a go!");

    let allPTags = document.querySelectorAll("p");
    console.log(allPTags);

    let firstP = document.querySelector("p");
    console.log(firstP);

    let innerContainersAccess = document.querySelectorAll(".inner-container");
    console.log(innerContainersAccess);

    let lastImgInContainer = document.querySelector(".img-container img:last-of-type");
    console.log(lastImgInContainer);

    let allH2s = document.querySelectorAll("h2");
    console.log(allH2s);
    console.log(allH2s.length);
    console.log(allH2s[0]?.textContent);

    let parentEl = document.getElementById("parent");
    console.log(parentEl);

    let allPTagsThree = document.querySelectorAll("p");

    function customCreateElement(parent) {
        let newP = document.createElement("p");
        newP.textContent = "using create Element";
        newP.style.backgroundColor = "green";
        newP.style.color = "white";
        parent.appendChild(newP);
    }

    allPTagsThree.forEach(p => {
        customCreateElement(p);
    });

    function customNewBoxCreate(parent) {
        let div = document.createElement("div");
        div.classList.add("testDiv");
        parent.appendChild(div);
        return div;
    }

    let gridParent = document.getElementById("new-grid");
    let boxSize = 40;

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            let returnedDiv = customNewBoxCreate(gridParent);
            returnedDiv.style.left = (col * boxSize) + "px";
            returnedDiv.style.top = (row * boxSize) + "px";
            returnedDiv.style.position = "absolute";

            if (row % 2 === 0) {
                returnedDiv.style.backgroundColor = "white";
                returnedDiv.textContent = "EVEN";
            } else {
                returnedDiv.style.backgroundColor = "cornflowerblue";
                returnedDiv.textContent = "ODD";
            }
        }
    }

    let testDivs = document.querySelectorAll(".testDiv");
    console.log(testDivs.length);

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
}
