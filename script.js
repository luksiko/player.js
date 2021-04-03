// import All_song from './data.json'

const previous = document.querySelector('#pre')
const playBtn = document.querySelector('#play')
const nextBtn = document.querySelector('#next')
const autoBtn = document.querySelector('#auto')
const volumeIcon = document.querySelector('#volume_icon')
const title = document.querySelector('#title')
const recentVolume = document.querySelector('#volume')
const volumeShow = document.querySelector('#volume_show')
const slider = document.querySelector('#duration_slider')
const showDuration = document.querySelector('#show_duration')
const trackImage = document.querySelector('#track_image')
const autoPlay = document.querySelector('#auto')
const present = document.querySelector('#present')
const total = document.querySelector('#total')
const artist = document.querySelector('#artist')
const modalBody = document.querySelector('.playlist_ol')
let currentTimeNumb = document.querySelector('#current_time')
const durationTimeNumb = document.querySelector('#duration_time')
const burger = document.querySelector('#burger')
const soundList = document.querySelector('.sound_list')
const closeList = document.querySelector('.close')

let timer
let autoplay = 0
let shuffle = 0

let indexNo = 0
let PlayingSong = false

//create a audio Element
let track = document.createElement('audio')

//All songs list
let AllSong = [
    {
        title: 'Death 0',
        artist: 'luksiko',
        artwork: 'https://samplesongs.netlify.app/album-arts/solo.jpg',
        url: 'https://samplesongs.netlify.app/Death%20Bed.mp3',
        id: '10',
    },
    {
        title: 'Death Bed Длинный длинный текст названия',
        artist: 'Halsey',
        artwork: 'https://samplesongs.netlify.app/album-arts/without-me.jpg',
        url: 'https://samplesongs.netlify.app/Without%20Me.mp3',
        id: '1',
    },
    {
        title: 'Bad Liar Bad',
        artist: 'Imagine Dragons',
        artwork: 'https://samplesongs.netlify.app/album-arts/bad-liar.jpg',
        url: 'https://samplesongs.netlify.app/Bad%20Liar.mp3',
        id: '2',
    },
    {
        title: 'Faded',
        artist: 'Alan Walker',
        artwork: 'https://samplesongs.netlify.app/album-arts/faded.jpg',
        url: 'https://samplesongs.netlify.app/Faded.mp3',
        id: '3',
    },
    {
        title: 'Hate Me',
        artist: 'Ellie Goulding',
        artwork: 'https://samplesongs.netlify.app/album-arts/hate-me.jpg',
        url: 'https://samplesongs.netlify.app/Hate%20Me.mp3',
        id: '4',
    },
    {
        title: 'Solo',
        artist: 'Clean Bandit',
        artwork: 'https://samplesongs.netlify.app/album-arts/solo.jpg',
        url: 'https://samplesongs.netlify.app/Solo.mp3',
        id: '5',
    },
    {
        title: 'Without Me',
        artist: 'Halsey',
        artwork: 'https://samplesongs.netlify.app/album-arts/without-me.jpg',
        url: 'https://samplesongs.netlify.app/Without%20Me.mp3',
        id: '6',
    },
]

// All functions

// function load the track
function loadTrack(index_no) {
    clearInterval(timer)
    resetSlider()
    console.dir(track)
    track.src = AllSong[index_no].url
    title.innerHTML = AllSong[index_no].title
    trackImage.src = AllSong[index_no].artwork
    artist.innerHTML = AllSong[index_no].artist
    track.load()

    timer = setInterval(seekto, 1000)
    total.innerHTML = AllSong.length
    present.innerHTML = +index_no + 1

    function updatePositionState() {
        if ('setPositionState' in navigator.mediaSession) {
            navigator.mediaSession.setPositionState({
                duration: track.duration,
                playbackRate: track.playbackRate,
                position: track.currentTime,
            });
        }
    }

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: AllSong[index_no].title,
            artist: AllSong[index_no].artist,
            album: track.album || '',
            artwork: [
                {src: AllSong[index_no].artwork, sizes: '96x96', type: 'image/png'},
                {src: AllSong[index_no].artwork, sizes: '128x128', type: 'image/png'},
                {src: AllSong[index_no].artwork, sizes: '192x192', type: 'image/png'},
                {src: AllSong[index_no].artwork, sizes: '256x256', type: 'image/png'},
                {src: AllSong[index_no].artwork, sizes: '384x384', type: 'image/png'},
                {src: AllSong[index_no].artwork, sizes: '512x512', type: 'image/png'},
            ]
        });
        navigator.mediaSession.setActionHandler('play', playSong);
        navigator.mediaSession.setActionHandler('pause', pauseSong);
        navigator.mediaSession.setActionHandler('previoustrack', previoustrack);
        navigator.mediaSession.setActionHandler('nexttrack', nexttrack);

        let defaultSkipTime = 10; /* Time to skip in seconds by default */

        navigator.mediaSession.setActionHandler('seekbackward', function (event) {
            console.log('> User clicked "Seek Backward" icon.');
            const skipTime = event.seekOffset || defaultSkipTime;
            track.currentTime = Math.max(track.currentTime - skipTime, 0);
            updatePositionState();
        });

        navigator.mediaSession.setActionHandler('seekforward', function (event) {
            console.log('> User clicked "Seek Forward" icon.');
            const skipTime = event.seekOffset || defaultSkipTime;
            track.currentTime = Math.min(track.currentTime + skipTime, track.duration);
            updatePositionState();
        });

        /* Seek To (supported since Chrome 78) */

        try {
            navigator.mediaSession.setActionHandler('seekto', function (event) {
                log('> User clicked "Seek To" icon.');
                if (event.fastSeek && ('fastSeek' in track)) {
                    track.fastSeek(event.seekTime);
                    return;
                }
                track.currentTime = event.seekTime;
                updatePositionState();
            });
        } catch (error) {
            log('Warning! The "seekto" media session action is not supported.');
        }

// When video playback rate changes, update position state.
        track.addEventListener('ratechange', (event) => {
            updatePositionState();
        });
    }

}

loadTrack(indexNo)

//mute sound function
function muteSound() {
    track.volume = 0
    volume.value = 0
    volumeShow.innerHTML = '00'
}

// checking.. the song is playing or not
function justPlay() {
    !PlayingSong ? playSong() : pauseSong()
}

// reset song slider
function resetSlider() {
    slider.value = 0
}

// play song
function playSong() {
    track.play()
    PlayingSong = true
    playBtn.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>'
}

// pause song
function pauseSong() {
    track.pause()
    PlayingSong = false
    playBtn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>'
}

// next song
function nexttrack() {
    indexNo = indexNo < AllSong.length - 1 ? indexNo + 1 : 0
    loadTrack(indexNo)
    playSong()
}

// previous song
function previoustrack() {
    indexNo = indexNo > 0 ? indexNo - 1 : AllSong.length
    loadTrack(indexNo)
    playSong()
}

// change volume
function volumeChange() {
    volumeShow.innerHTML = recentVolume.value
    if (recentVolume.value < 10) {
        volumeShow.innerHTML = 0 + recentVolume.value
    }

    track.volume = recentVolume.value / 100
}

// change slider position
function changeDuration() {
    slider_position = track.duration * (slider.value / 100)
    track.currentTime = slider_position
}

// autoplay function
function autoplaySwitch() {
    if (autoplay === 1) {
        autoplay = 0
    } else {
        autoplay = 1
    }
    autoPlay.style.background = autoplay !== 0 ? '#FF8A65' : 'rgba(255,255,255,0.2)'
}

function seekto() {
    let position = 0

    // update slider position
    if (!isNaN(track.duration)) {
        position = track.currentTime * (100 / track.duration)
        slider.value = position

        // update current time timer
        let min_duration = Math.floor(track.duration / 60)
        let sec_duration = Math.floor(track.duration % 60)
        let min_currentTime = Math.floor(track.currentTime / 60)
        let sec_currentTime = Math.floor(track.currentTime % 60)

        if (sec_duration < 10) {
            sec_duration = `0${sec_duration}`
        }
        durationTimeNumb.textContent = min_duration + ':' + sec_duration

        if (sec_currentTime < 10) {
            sec_currentTime = `0${sec_currentTime}`
        }
        currentTimeNumb.textContent = min_currentTime + ':' + sec_currentTime
    }

    // function will run when the song is over
    if (track.ended) {
        playBtn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>'
        if (autoplay === 1) {
            loadTrack(indexNo)
            playSong()
        } else {
            nexttrack()
        }
    }
}

function listTrigger() {
    trackImage.hidden = !trackImage.hidden
    soundList.hidden = !soundList.hidden
    burger.classList.toggle('active')
}

// open track list
function openTrackList() {
    for (let i = 0; i < AllSong.length; i++) {
        const elementTitle = JSON.stringify(AllSong[i].title)
        const elementArtist = JSON.stringify(AllSong[i].artist)
        modalBody.innerHTML += `
			<li id="music/${i}.mp3" class="jplayer_playlist_current">
				<a href="#" id="jplayer_playlist_item_${i}" tabindex="${i}" class="jplayer_playlist_current">${elementTitle}</a>
				${elementArtist}
			</li>
		`
    }
}

openTrackList()

soundList.addEventListener('click', e => {
    const target = e.target
    if (target.classList.contains('jplayer_playlist_current')) {
        const tapIndexNo = target.children[0].attributes.tabindex.value
        loadTrack(tapIndexNo)
        playSong()
    }
})

autoBtn.addEventListener('click', autoplaySwitch)
playBtn.addEventListener('click', justPlay)
previous.addEventListener('click', previoustrack)
nextBtn.addEventListener('click', nexttrack)
volumeIcon.addEventListener('click', muteSound)
recentVolume.addEventListener('change', volumeChange)
slider.addEventListener('change', changeDuration)
burger.addEventListener('click', listTrigger)
closeList.addEventListener('click', listTrigger)


//
// if ('mediaSession' in navigator) {
//     navigator.mediaSession.metadata = new MediaMetadata({
//         title: "TITLE",
//         artist: "ARTIST",
//         album: "ALBUM",
//         artwork: [{
//             sizes: "320x180",// <- MUST BE EXACTLY!
//             src: "https://i.ytimg.com/vi/yAruCvT7P7Y/hqdefault.jpg?sqp=-oaymwEZCNACELwBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLAfHWw5BHrQugGsdPYy4eIXcqMTnQ",
//             type: ""
//         }]
//     });
//
//     navigator.mediaSession.setActionHandler('play', function () { });
//     navigator.mediaSession.setActionHandler('pause', function () { });
//     // navigator.mediaSession.setActionHandler('seekbackward', function () { });
//     // navigator.mediaSession.setActionHandler('seekforward', function () { });
//     navigator.mediaSession.setActionHandler('previousSong', function () { });
//     navigator.mediaSession.setActionHandler('nextSong', function () { });
// }