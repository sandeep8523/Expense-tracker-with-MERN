// document.addEventListener("click", function(event) {
//     const ripple = document.createElement("div");
//     ripple.classList.add("ripple");
//     document.body.appendChild(ripple);

//     ripple.style.left = `${event.clientX - 10}px`;
//     ripple.style.top = `${event.clientY - 10}px`;

//     setTimeout(() => {
//         ripple.remove();
//     }, 200);
// });



        
document.addEventListener("mousemove", (e) => {
    let highlight = document.createElement("div");
    highlight.classList.add("highlight");
    document.body.appendChild(highlight);

    highlight.style.left = `${e.pageX}px`;
    highlight.style.top = `${e.pageY}px`;

    setTimeout(() => {
        highlight.remove();
    }, 1000); // Removes after 1s for a smooth fade-out
});
