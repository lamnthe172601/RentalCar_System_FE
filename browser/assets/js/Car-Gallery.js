/*---------- Product Image Gallery ----------*/

let carImage = document.querySelector(".car-description .image");
let carMain = document.querySelector(".main img");
let carAll = document.querySelectorAll(".change-btns img");

carAll.forEach(car => {

    car.addEventListener("click", () =>{

        // Active Button
        carImage.querySelector(".active").classList.remove("active");
        car.classList.add("active");

        // Active Image
        let src = car.getAttribute("src");
        carMain.src = src;
    })
})