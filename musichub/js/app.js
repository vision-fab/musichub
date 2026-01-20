// MusicHub - Home Page Logic

// DOM Elements
const songsGrid = document.getElementById('songsGrid');
const genreButtons = document.querySelectorAll('.genre-btn');
const userMenuContainer = document.getElementById('userMenuContainer');
const mobileUserMenu = document.getElementById('mobileUserMenu');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const instagramLink = document.getElementById('instagramLink');
const instagramDropdown = document.getElementById('instagramDropdown');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkLoginStatus();
    
    // Load all songs initially
    loadSongs('all');
    
    // Setup event listeners
    setupEventListeners();
    
    // Update hero stats
    updateHeroStats();
});

// Check if user is logged in and update UI
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('currentUser');
    
    // Update user menu
    updateUserMenu(isLoggedIn, username);
}

// Update user menu based on login status
function updateUserMenu(isLoggedIn, username) {
    if (userMenuContainer) {
        if (isLoggedIn && username) {
            userMenuContainer.innerHTML = `
                <div class="user-menu">
                    <button class="user-menu-btn" id="userMenuBtn">
                        <span>${username}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="#" class="user-dropdown-item logout" id="logoutBtn">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                </div>
            `;
        } else {
            userMenuContainer.innerHTML = `
                <a href="login.html" class="btn-login">Login</a>
            `;
        }
    }
    
    if (mobileUserMenu) {
        if (isLoggedIn && username) {
            mobileUserMenu.innerHTML = `
                <div class="mobile-user-menu-content">
                    <div class="mobile-user-info">
                        <i class="fas fa-user-circle"></i>
                        <span>${username}</span>
                    </div>
                    <a href="#" class="mobile-nav-link logout-mobile" id="logoutBtnMobile">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </div>
            `;
        } else {
            mobileUserMenu.innerHTML = `
                <a href="login.html" class="mobile-nav-link">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
            `;
        }
    }
}

// Update hero stats
function updateHeroStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 2) {
        statNumbers[0].textContent = `${songs.length}+`;
        statNumbers[1].textContent = `${new Set(songs.map(s => s.artist)).size}+`;
    }
}

// Load songs based on genre filter
function loadSongs(genre) {
    // Clear current songs
    songsGrid.innerHTML = '';
    
    // Filter songs by genre
    let filteredSongs = songs;
    if (genre !== 'all') {
        filteredSongs = songs.filter(song => song.genre.toLowerCase() === genre.toLowerCase());
    }
    
    // Check if there are songs to display
    if (filteredSongs.length === 0) {
        songsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-music"></i>
                <h3>No Songs Found</h3>
                <p>Try selecting a different genre</p>
            </div>
        `;
        return;
    }
    
    // Create song cards
    filteredSongs.forEach(song => {
        const songCard = createSongCard(song);
        songsGrid.appendChild(songCard);
    });
}

// Create song card HTML
function createSongCard(song) {
    // Check if song is in favourites
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const isFavourite = favourites.some(fav => fav.id === song.id);
    
    const card = document.createElement('div');
    card.className = 'song-card';
    card.setAttribute('data-id', song.id);
    card.setAttribute('data-genre', song.genre.toLowerCase());
    
    card.innerHTML = `
        <div class="song-card-inner">
            <div class="song-image">
                <img src="${song.cover}" alt="${song.title}" loading="lazy">
                <div class="song-badge">${song.genre}</div>
            </div>
            
            <div class="song-info">
                <div class="song-header">
                    <h3 class="song-title">${song.title}</h3>
                    <button class="favourite-btn ${isFavourite ? 'active' : ''}" data-id="${song.id}">
                        <i class="${isFavourite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                
                <p class="song-artist">${song.artist}</p>
                
                <div class="song-meta">
                    <span class="meta-item">
                        <i class="far fa-clock"></i> ${song.duration}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-headphones"></i> ${song.spotifyListeners}
                    </span>
                </div>
                
                <div class="song-external-links">
                    <a href="${song.spotifyUrl}" class="external-btn spotify-btn small" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-spotify"></i> Spotify
                    </a>
                    <a href="${song.youtubeUrl}" class="external-btn youtube-btn small" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-youtube"></i> YouTube
                    </a>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Genre filter buttons
    genreButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            genreButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Load songs for selected genre
            const genre = this.getAttribute('data-genre');
            loadSongs(genre);
        });
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu') && 
            !event.target.closest('.mobile-menu-btn') &&
            mobileMenu.style.display === 'block') {
            mobileMenu.style.display = 'none';
        }
    });
    
    // Instagram dropdown
    if (instagramLink && instagramDropdown) {
        instagramLink.addEventListener('click', function(e) {
            e.preventDefault();
            instagramDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.instagram-dropdown')) {
                instagramDropdown.classList.remove('show');
            }
        });
    }
    
    // User menu events (delegation)
    document.addEventListener('click', function(event) {
        const target = event.target;
        
        // User menu button
        if (target.closest('#userMenuBtn')) {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) {
                dropdown.classList.toggle('show');
            }
        }
        
        // Close user dropdown when clicking outside
        if (!target.closest('.user-menu') && !target.closest('#userMenuBtn')) {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        }
        
        // Logout button
        if (target.closest('#logoutBtn') || target.closest('#logoutBtnMobile')) {
            event.preventDefault();
            showLogoutModal();
        }
    });
    
    // Song grid events (delegation) - DIPERBARUI untuk favorite button
    songsGrid.addEventListener('click', function(event) {
        const target = event.target;
        const songCard = target.closest('.song-card');
        const favouriteBtn = target.closest('.favourite-btn');
        
        // Favourite button - TIDAK navigate ke lyrics page
        if (favouriteBtn) {
            event.preventDefault();
            event.stopPropagation();
            const songId = parseInt(favouriteBtn.getAttribute('data-id'));
            toggleFavourite(songId, favouriteBtn);
            return false; // Mencegah event bubbling
        }
        
        // Click on song card (but not on favourite button or external links)
        if (songCard && !target.closest('.favourite-btn') && !target.closest('a')) {
            const songId = parseInt(songCard.getAttribute('data-id'));
            viewLyrics(songId);
        }
        
        // Prevent default for external links (they should work normally)
        if (target.closest('a')) {
            // Let the link work normally
            return;
        }
    });
}

// Toggle favourite status
function toggleFavourite(songId, button) {
    const song = songs.find(s => s.id === songId);
    if (!song) return;
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // Get current favourites from localStorage
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    
    // Check if song is already in favourites
    const index = favourites.findIndex(fav => fav.id === songId);
    
    if (index === -1) {
        // Add to favourites
        favourites.push(song);
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.classList.add('active');
        showNotification('Added to favourites');
    } else {
        // Remove from favourites
        favourites.splice(index, 1);
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.classList.remove('active');
        showNotification('Removed from favourites');
    }
    
    // Save back to localStorage
    localStorage.setItem('favourites', JSON.stringify(favourites));
}

// View lyrics in new page
function viewLyrics(songId) {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // Store song ID for lyrics page
    sessionStorage.setItem('currentSongId', songId);
    
    // Navigate to lyrics page
    window.location.href = 'lyrics.html';
}

// Show logout confirmation modal
function showLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (!modal) return;
    
    modal.classList.add('show');
    
    // Setup modal events
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('#logoutCancel');
    const confirmBtn = modal.querySelector('#logoutConfirm');
    
    const closeModal = () => {
        modal.classList.remove('show');
    };
    
    closeBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;
    
    confirmBtn.onclick = function() {
        // Clear login status
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        
        // Close modal
        closeModal();
        
        // Show notification
        showNotification('Logged out successfully', 'info');
        
        // Update UI and redirect after delay
        setTimeout(() => {
            updateUserMenu(false, null);
            window.location.href = 'index.html';
        }, 1000);
    };
    
    // Close modal when clicking outside
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (mobileMenu.style.display === 'block') {
        mobileMenu.style.display = 'none';
    } else {
        mobileMenu.style.display = 'block';
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