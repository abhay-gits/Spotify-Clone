let currentMusic = new Audio();


/* Function to get Songs from Server */
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/music/")
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split('music/')[1])
        }

    }
    return songs;
}
/* Function to Play Music when clicked */
function playMusic(song) {
    currentMusic.src = "/music/"+song + ".mp3";
    currentMusic.play();

    setInterval(seekCircle, 300)
    /* Seekbar Click function */
    document.querySelector(".seekBar").addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentMusic.currentTime = ((currentMusic.duration) * percent) / 100
    })

    /* Song Name in Player*/
    const currentSongName = document.getElementById('currentSongName')
    currentSongName.innerHTML = `${song}`
}



/* Seekbar */
function seekCircle() {
    let time = (currentMusic.currentTime / currentMusic.duration) * 100 + "%";
    let circle = document.getElementById('circle');
    circle.style.left = time;
    songTime()
}
/* SongTime Function */
/* Song Time in Player */
function songTime() {
    const currentSongTime = document.getElementById('currentSongTime');
    const currentPlaying = currentMusic;

    const currentTimeInSeconds = currentPlaying.currentTime;
    const currentDurationInSeconds = currentPlaying.duration;

    const currentMinutes = Math.floor(currentTimeInSeconds / 60);
    const currentSeconds = Math.floor(currentTimeInSeconds % 60);

    const durationMinutes = Math.floor(currentDurationInSeconds / 60);
    const durationSeconds = Math.floor(currentDurationInSeconds % 60);

    currentSongTime.innerHTML = `
 ${currentMinutes}:${currentSeconds}/${durationMinutes}:${durationSeconds}`
}

/* Main Function */
async function main() {
    let songs = await getSongs();

    let songList = document.querySelector('.musicCard').getElementsByTagName('ul')[0];
    for (const song of songs) {
        songList.innerHTML = songList.innerHTML + `
        <li>
            <img class='invert' src="./images/music.svg">
            <span id='songName'>${song.replaceAll('%20', " ").replaceAll('.mp3', " ")}</span>
            <img class='invert' src="./images/play.svg"
        </li> `;
    }

    Array.from(document.querySelector('.musicCard').getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', () => {
            playMusic(e.querySelector('#songName').textContent.trim());
        })
    })

    /* Play,Pause */
    const playButton = document.getElementById('playButton')
    playButton.addEventListener('click', () => {
        if (currentMusic.paused) {
            currentMusic.play();
            playButton.src = "./images/pause.svg"

        }
        else if (currentMusic.play()) {
            currentMusic.pause();
            playButton.src = "./images/play.svg"
        }

    })

    /* Volume Changer */
    const volumeRange = document.getElementById('volumeRange');
    volumeRange.addEventListener('change', () => {
        const vol = volumeRange.value / 100;
        currentMusic.volume = vol;
    })

    /* Next Button */
    const next = document.getElementById('next')
    next.addEventListener("click", () => {
        currentMusic.pause()

        let index = songs.indexOf(currentMusic.src.split("/").slice(-1)[0])
        console.log(songs[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1].split(".mp3")[0])
        }
        else{
            playMusic(songs[0].split(".mp3")[0])
        }
    })

    /* Next Button */
    const previous = document.getElementById('previous')
    previous.addEventListener("click", () => {
        currentMusic.pause()

        let index = songs.indexOf(currentMusic.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index - 1].split(".mp3")[0])
        }
        else{
            playMusic(songs[index.length()].split(".mp3")[0])
        }
    })

}
main()




