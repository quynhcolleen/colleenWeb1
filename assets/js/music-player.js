// Simple Music Player
document.addEventListener("DOMContentLoaded", () => {
  const tracks = [
    {
      title: "Wilderness",
      artist: "Jinx FTRE",
      artwork: "./assets/artwork/WILDERNESS.jpg",
      audioSrc: "./assets/audio/wilderness.mp3",
    },
    {
      title: "Tò Te Tí (Remix)",
      artist: "Jinx FTRE, Wrens Evan, itsnk",
      artwork: "./assets/artwork/4t.jpg",
      audioSrc: "./assets/audio/toteti.mp3",
    },
    {
      title: "Stay With Me",
      artist: "Curdz, BINNE, Jinx FTRE, My Linh",
      artwork: "./assets/artwork/swm.jpg",
      audioSrc: "./assets/audio/swm.mp3",
    },
    {
      title: "Vulnerable",
      artist: "Tuanuki, Jinx FTRE",
      artwork: "./assets/artwork/vul.jpg",
      audioSrc: "./assets/audio/vul.mp3",
    },
    {
      title: "Thao Túng Tâm Trí (Remix)",
      artist: "Jinx FTRE, windsor boy",
      artwork: "./assets/artwork/riel.png",
      audioSrc: "./assets/audio/tttt.mp3",
    },
    {
      title: "Mơ Làm Ma (Remix)",
      artist: "Kyozaku, Cloud Nine, Jinx FTRE, KZann",
      artwork: "./assets/artwork/ngot.png",
      audioSrc: "./assets/audio/mlm.mp3",
    },
    {
      title: "Ngáo Ngơ (Remix)",
      artist: "Jinx FTRE",
      artwork: "./assets/artwork/clmm.png",
      audioSrc: "./assets/audio/nn.mp3",
    },
  ]

  let currentTrackIndex = 0
  const audio = new Audio()
  let isPlaying = false
  let isMuted = false
  let previousVolume = 0.8 // Default volume at 80%
  let isDragging = false

  const playBtn = document.getElementById("play-btn")
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")
  const trackArtwork = document.getElementById("track-artwork")
  const trackTitle = document.getElementById("track-title")
  const trackArtist = document.getElementById("track-artist")
  const progressBar = document.getElementById("progress-bar")
  const progress = document.getElementById("progress")
  const seekHandle = document.getElementById("seek-handle")
  const currentTimeEl = document.getElementById("current-time")
  const totalTimeEl = document.getElementById("total-time")
  const minimizeBtn = document.getElementById("minimize-btn")
  const expandBtn = document.getElementById("expand-btn")
  const player = document.getElementById("music-player")

  // Volume control elements
  const volumeBtn = document.getElementById("volume-btn")
  const volumeSlider = document.getElementById("volume-slider")

  // Check if elements exist (in case the player is not included in the page)
  if (!playBtn || !player) return

  // Set initial volume
  audio.volume = previousVolume

  function loadTrack(trackIndex) {
    const track = tracks[trackIndex]
    audio.src = track.audioSrc
    trackTitle.textContent = track.title
    trackArtist.textContent = track.artist
    trackArtwork.src = track.artwork

    audio.addEventListener("loadedmetadata", () => {
      const minutes = Math.floor(audio.duration / 60)
      const seconds = Math.floor(audio.duration % 60)
      totalTimeEl.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    })
  }

  function playTrack() {
    audio.play()
    isPlaying = true
    playBtn.innerHTML = '<i class="material-icons" style="font-size:36px">pause</i>'
  }

  function pauseTrack() {
    audio.pause()
    isPlaying = false
    playBtn.innerHTML = '<i class="material-icons" style="font-size:36px">play_arrow</i>'
  }

  function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length
    loadTrack(currentTrackIndex)
    if (isPlaying) playTrack()
  }

  function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length
    loadTrack(currentTrackIndex)
    if (isPlaying) playTrack()
  }

  // Volume control functions
  function updateVolumeIcon() {
    if (audio.volume === 0 || isMuted) {
      volumeBtn.innerHTML = '<i class="material-icons" style="font-size: 22px">volume_off</i>'
    } else {
      volumeBtn.innerHTML = '<i class="material-icons" style="font-size: 22px">volume_up</i>'
    }
  }

  function toggleMute() {
    if (isMuted) {
      audio.volume = previousVolume
      volumeSlider.value = previousVolume * 100
      isMuted = false
    } else {
      previousVolume = audio.volume
      audio.volume = 0
      volumeSlider.value = 0
      isMuted = true
    }
    updateVolumeIcon()
  }

  // Seeking functions
  function updateProgress() {
    if (!isDragging) {
      const progressPercent = (audio.currentTime / audio.duration) * 100
      progress.style.width = `${progressPercent}%`
      seekHandle.style.left = `${progressPercent}%`

      const minutes = Math.floor(audio.currentTime / 60)
      const seconds = Math.floor(audio.currentTime % 60)
      currentTimeEl.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }
  }

  function setProgress(e) {
    const width = progressBar.clientWidth
    const clickX = e.offsetX
    const duration = audio.duration

    audio.currentTime = (clickX / width) * duration
  }

  function startDrag(e) {
    isDragging = true
    document.addEventListener("mousemove", drag)
    document.addEventListener("mouseup", stopDrag)

    // Initial position update
    drag(e)
  }

  function drag(e) {
    if (isDragging) {
      const progressRect = progressBar.getBoundingClientRect()
      const clickX = e.clientX - progressRect.left
      const width = progressRect.width

      // Ensure we stay within bounds
      let percent = (clickX / width) * 100
      percent = Math.max(0, Math.min(100, percent))

      // Update visual progress
      progress.style.width = `${percent}%`
      seekHandle.style.left = `${percent}%`

      // Update time display
      const duration = audio.duration || 0
      const currentTime = (percent / 100) * duration
      const minutes = Math.floor(currentTime / 60)
      const seconds = Math.floor(currentTime % 60)
      currentTimeEl.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }
  }

  function stopDrag(e) {
    if (isDragging) {
      const progressRect = progressBar.getBoundingClientRect()
      const clickX = e.clientX - progressRect.left
      const width = progressRect.width
      const duration = audio.duration || 0

      // Ensure we stay within bounds
      let percent = (clickX / width) * 100
      percent = Math.max(0, Math.min(100, percent))

      // Set the actual audio time
      audio.currentTime = (percent / 100) * duration

      isDragging = false
      document.removeEventListener("mousemove", drag)
      document.removeEventListener("mouseup", stopDrag)
    }
  }

  // Touch support for seeking
  function handleTouchStart(e) {
    const touch = e.touches[0]
    const progressRect = progressBar.getBoundingClientRect()
    const touchX = touch.clientX - progressRect.left
    const width = progressRect.width
    const duration = audio.duration || 0

    // Ensure we stay within bounds
    let percent = (touchX / width) * 100
    percent = Math.max(0, Math.min(100, percent))

    // Update visual progress
    progress.style.width = `${percent}%`
    seekHandle.style.left = `${percent}%`

    // Set the actual audio time
    audio.currentTime = (percent / 100) * duration
  }

  // Initialize
  loadTrack(currentTrackIndex)
  updateVolumeIcon()

  // Event listeners
  playBtn.addEventListener("click", () => {
    if (isPlaying) {
      pauseTrack()
    } else {
      playTrack()
    }
  })

  prevBtn.addEventListener("click", prevTrack)
  nextBtn.addEventListener("click", nextTrack)

  audio.addEventListener("timeupdate", updateProgress)
  audio.addEventListener("ended", nextTrack)

  // Progress bar seeking
  progressBar.addEventListener("click", setProgress)
  progressBar.addEventListener("mousedown", startDrag)

  // Touch support
  progressBar.addEventListener("touchstart", handleTouchStart)

  minimizeBtn.addEventListener("click", () => {
    player.classList.add("minimized")
  })

  expandBtn.addEventListener("click", () => {
    player.classList.remove("minimized")
  })

  // Volume control event listeners
  if (volumeBtn) {
    volumeBtn.addEventListener("click", toggleMute)
  }

  if (volumeSlider) {
    // Set initial slider value
    volumeSlider.value = audio.volume * 100

    volumeSlider.addEventListener("input", () => {
      const volume = volumeSlider.value / 100
      audio.volume = volume

      if (volume > 0) {
        isMuted = false
        previousVolume = volume
      } else {
        isMuted = true
      }

      updateVolumeIcon()
    })
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Only handle shortcuts if the player is visible
    if (player.classList.contains("minimized")) return

    // Space bar: Play/Pause
    if (e.code === "Space") {
      e.preventDefault() // Prevent page scrolling
      if (isPlaying) {
        pauseTrack()
      } else {
        playTrack()
      }
    }

    // Left arrow: Rewind 5 seconds
    if (e.code === "ArrowLeft") {
      audio.currentTime = Math.max(0, audio.currentTime - 5)
    }

    // Right arrow: Forward 5 seconds
    if (e.code === "ArrowRight") {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 5)
    }

    // Up arrow: Volume up
    if (e.code === "ArrowUp") {
      const newVolume = Math.min(1, audio.volume + 0.05)
      audio.volume = newVolume
      volumeSlider.value = newVolume * 100
      isMuted = false
      updateVolumeIcon()
    }

    // Down arrow: Volume down
    if (e.code === "ArrowDown") {
      const newVolume = Math.max(0, audio.volume - 0.05)
      audio.volume = newVolume
      volumeSlider.value = newVolume * 100
      if (newVolume === 0) {
        isMuted = true
      }
      updateVolumeIcon()
    }

    // M key: Mute/Unmute
    if (e.code === "KeyM") {
      toggleMute()
    }
  })
})
