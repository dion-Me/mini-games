document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".game-card");

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("show");
        }, index * 120);
    });

});