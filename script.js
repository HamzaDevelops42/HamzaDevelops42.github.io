let currentsong = new Audio()
let songs
let songscover

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs() {
    let a = await fetch(document.location.origin + '/public/songs')
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = Array.from(div.getElementsByTagName("a"))
    let songs = []
    as.forEach(a => {
        if (a.href.endsWith(".mp3")) {
            songs.push(a.href)
        }
    });
    return songs
}
async function getcover() {
    let a = await fetch(document.location.origin + '/public/songs')
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = Array.from(div.getElementsByTagName("a"))
    let cover = []
    as.forEach(a => {
        if (a.href.endsWith(".jpeg") || a.href.endsWith(".jpg") || a.href.endsWith(".png") || a.href.endsWith(".webp")) {
            cover.push(a.href)
        }
    });
    return cover;
}
getcover()
function playMusic(track, songname, paused = false) {

    currentsong.src = "/public/songs/" + track
    if (!paused) {
        currentsong.play()
        play.src = "/images/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = songname
    currentsong.onloadedmetadata = () => {
        document.querySelector(".songtime").innerHTML = `00:00 / ${secondsToMinutesSeconds(currentsong.duration)}`
    }

    // adding music gif


}

(async function main() {
    songs = await getsongs()
    songs.forEach(song => {
        let [artistname, songname] = song.split("/public/songs/")[1].replaceAll("%20", " ").replace(".mp3", "").split("-")
        let div = document.createElement("div")
        div.classList.add("songdiv")
        div.innerHTML = `
        <img src="/images/music.svg" class="invert" alt="music logo">
        <div class="info">
            <div >${songname}</div>
            <div>${artistname}</div>
        </div>`
        document.querySelector(".songslist").append(div)
    });
    // dispatching an event so that aniamtions in animation.js are run after the rendering
    document.dispatchEvent(new Event("librarysongsloaded"));


    songscover = await getcover()
    songs.forEach(song => {
        songscover.forEach(element => {
            let lastDotIndex = element.lastIndexOf(".");
            let name = element.substring(0, lastDotIndex);
            let extension = element.substring(lastDotIndex + 1);

            if (song.split(".mp3")[0] == name) {
                coverimagesrc = element
            }
        });
        if (coverimagesrc == "") {
            coverimagesrc = "/public/songs/defaultcover.png"
        }
        let [artistname, songname] = song.split("/public/songs/")[1].replaceAll("%20", " ").replace(".mp3", "").split("-")
        let div = document.createElement("div")
        div.classList.add("card")
        div.innerHTML = `
        <div class="img">
            <img class="card-img" src="${coverimagesrc}"alt="">
            <button class="cardplaybtn">
                <img src="images/play.svg" alt="">
            </button>
        </div>
        <h4>${songname}</h4>
       <p>${artistname}</p>`

        document.querySelector(".card-container").append(div)
        coverimagesrc = ""
    });
    document.dispatchEvent(new Event("playlistsongsloaded"));
    // play music when the right section  card is clicked

    Array.from(document.querySelectorAll(".card-container .card")).forEach(div => {
        div.addEventListener("click", () => {

            let track = div.querySelector(".card p").innerHTML.trim() + " - " + div.querySelector(".card h4").innerHTML.trim() + ".mp3"
            let songnamewithoutartistname = div.querySelector(".card h4").innerHTML.trim() + ".mp3"
            playMusic(track, songnamewithoutartistname)



        })
    });


    // play music when the left section card is clicked
    Array.from(document.querySelectorAll(".songslist .songdiv")).forEach(div => {
        div.addEventListener("click", () => {

            let track = div.querySelector(".info").firstElementChild.nextElementSibling.innerHTML.trim() + " - " + div.querySelector(".info").firstElementChild.innerHTML.trim() + ".mp3"
            let songnamewithoutartistname = div.querySelector(".info").firstElementChild.innerHTML.trim() + ".mp3"
            playMusic(track, songnamewithoutartistname)


            if (window.matchMedia('(max-width: 1250px)').matches) {
                setTimeout(() => {
                    document.querySelector(".left").classList.remove("leftVisible")
                }, 200);

            }
        })
    });


    let track = document.querySelector(".info").firstElementChild.nextElementSibling.innerHTML.trim() + " - " + document.querySelector(".info").firstElementChild.innerHTML.trim() + ".mp3"

    let songnamewithoutartistname = document.querySelector(".info").firstElementChild.innerHTML.trim() + ".mp3"

    playMusic(track, songnamewithoutartistname, true)



    // play button working
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "/images/pause.svg"
        } else {
            currentsong.pause()
            play.src = "/images/play2.svg"
        }
    })


    // listen for timeupdate event
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = secondsToMinutesSeconds(currentsong.currentTime) + " / " + secondsToMinutesSeconds(currentsong.duration)


        //update seekbar
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"


    })
    // Add an event listener to seekbar
    let seekbar = document.querySelector(".seekbar")
    const progress = document.querySelector('.circle');

    seekbar.addEventListener("click", e => {
        let ratio = e.offsetX / seekbar.clientWidth
        document.querySelector(".circle").style.left = (ratio * 100) + "%"
        currentsong.currentTime = ratio * currentsong.duration
    })


    // adding the drag functionality to seeekbar



    let isDragging = false;
    let isMetadataLoaded = false;

    currentsong.addEventListener('loadedmetadata', () => {
        isMetadataLoaded = true;
    });

    // Update visual bar during drag
    function updateSeekVisualOnly(e) {
        const rect = seekbar.getBoundingClientRect();
        const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
        if (clientX == null) return;

        const clickX = clientX - rect.left;
        const barWidth = seekbar.clientWidth;
        const ratio = Math.min(Math.max(clickX / barWidth, 0), 1);


        // Visually update progress bar
        progress.style.left = (ratio * 100) + '%';

        return ratio;
    }

    // Finalize drag: actually seek the audio
    function updateSeek(e) {
        const ratio = updateSeekVisualOnly(e);
        if (isMetadataLoaded && ratio != null) {
            currentsong.currentTime = ratio * currentsong.duration;
        }
    }

    // Mouse events
    progress.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.body.style.userSelect = 'none';
        updateSeekVisualOnly(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateSeekVisualOnly(e);
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (isDragging) {
            updateSeek(e);
            isDragging = false;
            document.body.style.userSelect = '';

        }
    });

    // Touch events
    progress.addEventListener('touchstart', (e) => {
        isDragging = true;
        document.body.style.userSelect = 'none';
        updateSeekVisualOnly(e);
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            updateSeekVisualOnly(e);
        }
    });

    document.addEventListener('touchend', (e) => {
        if (isDragging) {
            updateSeek(e.changedTouches[0]);
            isDragging = false;
            document.body.style.userSelect = '';
        }
    });




    // adding hamburger functionality 

    let hamburger = document.querySelector(".logo")
    const mediaQuery = window.matchMedia('(max-width: 1250px)');
    if (mediaQuery.matches) {
        hamburger.src = "/images/hamburger.svg"

        hamburger.addEventListener("click", () => {
            console.log(hamburger.src);
            if (hamburger.src.endsWith("/images/hamburger.svg")) {

                document.querySelector(".left").classList.add("leftVisible")
            }


        })
        leftCross.addEventListener("click", () => {
            document.querySelector(".left").classList.remove("leftVisible")
        })
    }



    // Adding previous song functionality 

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src)

        if (index == 0) {
            index = songs.length
        }

        let songname = songs[index - 1].split("/public/songs/")[1].split("-")[1].replaceAll("%20", " ")
        playMusic(songs[index - 1].split("/public/songs/")[1], songname)
    })

    //adding next song funtionality 
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src)


        if (!((index + 1) < songs.length)) {
            index = -1
        }

        let songname = songs[index + 1].split("/public/songs/")[1].split("-")[1].replaceAll("%20", " ")
        playMusic(songs[index + 1].split("/public/songs/")[1], songname)
    })


    // Adding volume functionality
    volumeInput.addEventListener("change", e => {
        currentsong.volume = parseInt(e.target.value) / 100
        volumeRangeOutput.innerHTML = volumeInput.value

    })
    volumeIcon.addEventListener("click", () => {
        if (!currentsong.muted) {
            volumeIcon.src = "/images/volumeMute.svg"
            currentsong.muted = true

        } else {
            volumeIcon.src = "/images/volume.svg"
            currentsong.muted = false

        }
    })
    volumeRangeOutput.innerHTML = volumeInput.value

    // Adding Repeat Song functionality

    repeatIcon.addEventListener("click", () => {

        if (!currentsong.loop) {
            repeatIcon.src = "/images/repeat1.svg"
            currentsong.loop = true
        } else {
            repeatIcon.src = "/images/repeat.svg"
            currentsong.loop = false
        }
    })

    // Adding search funtionality 
    SearchInput.addEventListener("input", () => {
        const keyword = SearchInput.value.toLowerCase();

        // Filter left panel songs
        document.querySelectorAll(".songslist .songdiv").forEach(div => {
            const songName = div.querySelector(".info div:first-child").textContent.toLowerCase();
            const artistName = div.querySelector(".info div:nth-child(2)").textContent.toLowerCase();
            if (songName.includes(keyword) || artistName.includes(keyword)) {
                div.style.display = "flex";
            } else {
                div.style.display = "none";
            }
        });

        // Filter right panel cards
        document.querySelectorAll(".card-container .card").forEach(card => {
            const songName = card.querySelector("h4").textContent.toLowerCase();
            const artistName = card.querySelector("p").textContent.toLowerCase();
            if (songName.includes(keyword) || artistName.includes(keyword)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });





    // Mobile Search Functionality


    const mobileSearchBtn = document.getElementById("mobileSearchBtn");
    const mobileSearchPopup = document.getElementById("mobileSearchPopup");
    const mobileSearchInput = document.getElementById("MobileSearchInput");

    function isMobileView() {
        return window.innerWidth < 1250;
    }

    mobileSearchBtn.addEventListener("click", (e) => {
        if (!isMobileView()) return;
    
        e.stopPropagation(); // prevent closing instantly
    
        // 🔁 Toggle active class
        if (mobileSearchPopup.classList.contains("active")) {
            mobileSearchPopup.classList.remove("active");
        } else {
            mobileSearchPopup.classList.add("active");
            mobileSearchInput.focus();
        }
    });
    
    // Hide popup when clicking outside
    document.addEventListener("click", (e) => {
        if (!isMobileView()) return; // ✅ ignore on desktop

        if (!mobileSearchPopup.contains(e.target) && e.target !== mobileSearchBtn) {
            mobileSearchPopup.classList.remove("active");
        }
    });

    // Prevent popup from closing when clicked inside
    mobileSearchPopup.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Live search filter
    mobileSearchInput.addEventListener("input", () => {
        const keyword = mobileSearchInput.value.toLowerCase();

        document.querySelectorAll(".songslist .songdiv").forEach(div => {
            const songName = div.querySelector(".info div:first-child").textContent.toLowerCase();
            const artistName = div.querySelector(".info div:nth-child(2)").textContent.toLowerCase();
            div.style.display = (songName.includes(keyword) || artistName.includes(keyword)) ? "flex" : "none";
        });

        document.querySelectorAll(".card-container .card").forEach(card => {
            const songName = card.querySelector("h4").textContent.toLowerCase();
            const artistName = card.querySelector("p").textContent.toLowerCase();
            card.style.display = (songName.includes(keyword) || artistName.includes(keyword)) ? "block" : "none";
        });
    });




})()