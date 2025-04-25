// hover animation for search bar 
let searchBar = document.querySelector(".search-bar")
let input = document.getElementById("SearchInput")
searchBar.addEventListener("click", () => {

    searchBar.classList.add("search-bar-border")
})
document.addEventListener("click", (e) => {
    if (!searchBar.contains(e.target)) {
        searchBar.classList.remove("search-bar-border")
    }
})


// card play button animation
document.addEventListener("playlistsongsloaded", () => {
    document.querySelectorAll(".card").forEach(card => {
        let cardplaybtn = card.querySelector(".cardplaybtn")
        card.addEventListener("mouseenter", () => {
            cardplaybtn.classList.add("cardplaybtn-visible")
        })
        card.addEventListener("mouseleave", () => {
            cardplaybtn.classList.remove("cardplaybtn-visible")
        })
    });

})

// library songlist animation 

// first check if the data is loaded or not 
document.addEventListener("librarysongsloaded", () => {

    document.querySelectorAll(".songdiv").forEach(div => {
        let songdivimg = div.getElementsByTagName("img")[0]
        div.addEventListener("mouseenter", () => {
            songdivimg.classList.add("fade-out")
            setTimeout(() => {
                songdivimg.src = "/images/play2.svg"
                songdivimg.onload = () => {
                    songdivimg.classList.remove("fade-out");
                };
            }, 150);
        })
        div.addEventListener("mouseleave", () => {
            songdivimg.classList.add("fade-out")
            setTimeout(() => {
                songdivimg.src = "/images/music.svg"
                songdivimg.onload = () => {
                    songdivimg.classList.remove("fade-out");
                };
            }, 150);
        })
    });

});

