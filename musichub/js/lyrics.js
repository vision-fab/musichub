// MusicHub - Lyrics Page Logic

// DOM Elements
const lyricsTitle = document.getElementById('lyricsTitle');
const lyricsArtist = document.getElementById('lyricsArtist');
const lyricsCover = document.getElementById('lyricsCover');
const lyricsGenre = document.getElementById('lyricsGenre');
const lyricsRelease = document.getElementById('lyricsRelease');
const lyricsListeners = document.getElementById('lyricsListeners');
const lyricsDuration = document.getElementById('lyricsDuration');
const lyricsText = document.getElementById('lyricsText');
const favouriteBtn = document.getElementById('favouriteBtn');
const spotifyBtn = document.getElementById('spotifyBtn');
const youtubeBtn = document.getElementById('youtubeBtn');
const navButtons = document.querySelectorAll('.nav-btn');
const lyricsSections = document.querySelectorAll('.lyrics-section');
const fontSizeDown = document.getElementById('fontSizeDown');
const fontSizeUp = document.getElementById('fontSizeUp');
const darkModeToggle = document.getElementById('darkModeToggle');

// Current song data
let currentSong = null;
let currentSongIndex = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkLoginStatus();
    
    // Load song data
    loadSongData();
    
    // Setup event listeners
    setupLyricsEventListeners();
    
    // Initialize font size
    lyricsText.style.fontSize = '16px';
});

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }
}

// Load song data
function loadSongData() {
    // Get song ID from sessionStorage
    const songId = parseInt(sessionStorage.getItem('currentSongId')) || 1;
    
    // Find song in data
    currentSong = songs.find(song => song.id === songId);
    currentSongIndex = songs.findIndex(song => song.id === songId);
    
    if (!currentSong) {
        // Default to first song if not found
        currentSong = songs[0];
        currentSongIndex = 0;
    }
    
    // Update UI with song data
    updateSongUI();
    
    // Check if song is in favourites
    updateFavouriteButton();
}

// Update UI with song data
function updateSongUI() {
    if (!currentSong) return;
    
    // Update header
    lyricsTitle.textContent = currentSong.title;
    lyricsArtist.textContent = currentSong.artist;
    lyricsCover.src = currentSong.cover;
    lyricsCover.alt = `${currentSong.title} by ${currentSong.artist}`;
    
    // Update metadata
    lyricsGenre.innerHTML = `<i class="fas fa-tag"></i> ${currentSong.genre}`;
    lyricsRelease.innerHTML = `<i class="far fa-calendar"></i> ${formatDate(currentSong.releaseDate)}`;
    lyricsListeners.innerHTML = `<i class="fas fa-headphones"></i> ${currentSong.spotifyListeners} listeners`;
    lyricsDuration.innerHTML = `<i class="far fa-clock"></i> ${currentSong.duration}`;
    
    // Update lyrics text
    updateLyricsText();
    
    // Update about section
    updateAboutSection();
    
    // Update artist section
    updateArtistSection();
    
    // Update external links
    if (spotifyBtn) spotifyBtn.href = currentSong.spotifyUrl;
    if (youtubeBtn) youtubeBtn.href = currentSong.youtubeUrl;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Update lyrics text
function updateLyricsText() {
    if (!currentSong) return;
    
    // Format lyrics with HTML
    const formattedLyrics = currentSong.lyrics
        .split('\n')
        .map(line => {
            // Check if line is a section header (in brackets)
            if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
                return `<div class="lyrics-section-header">${line}</div>`;
            }
            // Check if line contains chorus indicator
            else if (line.toLowerCase().includes('chorus')) {
                return `<div class="lyrics-chorus">${line}</div>`;
            }
            // Check if line contains verse indicator
            else if (line.toLowerCase().includes('verse')) {
                return `<div class="lyrics-verse">${line}</div>`;
            }
            // Regular line
            else if (line.trim()) {
                return `<p>${line}</p>`;
            }
            // Empty line
            else {
                return '<br>';
            }
        })
        .join('');
    
    lyricsText.innerHTML = formattedLyrics;
}

// Update about section
function updateAboutSection() {
    if (!currentSong) return;
    
    const songDescription = document.getElementById('songDescription');
    const songKey = document.getElementById('songKey');
    const songBPM = document.getElementById('songBPM');
    const songLanguage = document.getElementById('songLanguage');
    const songExplicit = document.getElementById('songExplicit');
    
    if (songDescription) songDescription.textContent = currentSong.description;
    if (songKey) songKey.textContent = currentSong.key;
    if (songBPM) songBPM.textContent = currentSong.bpm;
    if (songLanguage) songLanguage.textContent = currentSong.language;
    if (songExplicit) songExplicit.textContent = currentSong.explicit;
}

// Update artist section
function updateArtistSection() {
    if (!currentSong) return;
    
    const artistName = document.getElementById('artistName');
    const artistGenre = document.getElementById('artistGenre');
    const artistBio = document.getElementById('artistBio');
    const artistSongs = document.getElementById('artistSongs');
    const artistFollowers = document.getElementById('artistFollowers');
    const artistOrigin = document.getElementById('artistOrigin');
    const artistAvatar = document.getElementById('artistAvatar');
    
    if (artistName) artistName.textContent = currentSong.artist;
    if (artistGenre) artistGenre.textContent = currentSong.genre;
    if (artistBio) artistBio.textContent = currentSong.artistBio;
    if (artistSongs) artistSongs.textContent = currentSong.artistSongs;
    if (artistFollowers) artistFollowers.textContent = currentSong.artistFollowers;
    if (artistOrigin) artistOrigin.textContent = currentSong.artistOrigin;
    
    // Create artist avatar with initials
    if (artistAvatar) {
        const initials = currentSong.artist
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
        
        artistAvatar.textContent = initials;
        artistAvatar.style.background = `linear-gradient(135deg, var(--primary-color), var(--accent-color))`;
    }
}

// Update favourite button state
function updateFavouriteButton() {
    if (!currentSong || !favouriteBtn) return;
    
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const isFavourite = favourites.some(fav => fav.id === currentSong.id);
    
    if (isFavourite) {
        favouriteBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Favourites';
        favouriteBtn.classList.add('active');
    } else {
        favouriteBtn.innerHTML = '<i class="far fa-heart"></i> Add to Favourites';
        favouriteBtn.classList.remove('active');
    }
}

// Setup event listeners
function setupLyricsEventListeners() {
    // Navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Favourite button
    if (favouriteBtn) {
        favouriteBtn.addEventListener('click', toggleFavourite);
    }
    
    // Font size controls
    if (fontSizeDown) {
        fontSizeDown.addEventListener('click', () => adjustFontSize(-1));
    }
    
    if (fontSizeUp) {
        fontSizeUp.addEventListener('click', () => adjustFontSize(1));
    }
    
    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Back button in header
    const backBtn = document.querySelector('.back-btn');
    if (backBtn && backBtn.closest('.lyrics-header')) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.history.back();
        });
    }
}

// Show specific section
function showSection(sectionName) {
    // Update navigation buttons
    navButtons.forEach(button => {
        if (button.getAttribute('data-section') === sectionName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Show corresponding section
    lyricsSections.forEach(section => {
        if (section.id === `${sectionName}Section`) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

// Toggle favourite status
function toggleFavourite() {
    if (!currentSong) return;
    
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const isFavourite = favourites.some(fav => fav.id === currentSong.id);
    
    if (isFavourite) {
        // Remove from favourites
        const index = favourites.findIndex(fav => fav.id === currentSong.id);
        favourites.splice(index, 1);
        showNotification('Removed from favourites');
    } else {
        // Add to favourites
        favourites.push(currentSong);
        showNotification('Added to favourites');
    }
    
    // Save back to localStorage
    localStorage.setItem('favourites', JSON.stringify(favourites));
    
    // Update button
    updateFavouriteButton();
}

// Adjust font size
function adjustFontSize(delta) {
    const currentSize = parseInt(getComputedStyle(lyricsText).fontSize);
    const newSize = currentSize + delta;
    
    // Limit font size between 12px and 24px
    if (newSize >= 12 && newSize <= 24) {
        lyricsText.style.fontSize = `${newSize}px`;
        showNotification(`Font size: ${newSize}px`, 'info');
    }
}

// Toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.contains('lyrics-dark-mode');
    
    if (isDark) {
        body.classList.remove('lyrics-dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        showNotification('Light mode activated', 'info');
    } else {
        body.classList.add('lyrics-dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        showNotification('Dark mode activated', 'info');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 3000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

// Hide notification
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}