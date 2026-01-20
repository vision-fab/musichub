// MusicHub - Favourites Page Logic

// DOM Elements
const favouritesGrid = document.getElementById('favouritesGrid');
const emptyState = document.getElementById('emptyState');
const favouriteCount = document.getElementById('favouriteCount');
const totalDuration = document.getElementById('totalDuration');
const genreCount = document.getElementById('genreCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const userMenuContainer = document.getElementById('userMenuContainer');
const mobileUserMenu = document.getElementById('mobileUserMenu');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkLoginStatus();
    
    // Load favourites
    loadFavourites();
    
    // Setup event listeners
    setupFavouriteEventListeners();
});

// Check if user is logged in and update UI
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('currentUser');
    
    if (!isLoggedIn) {
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
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

// Load favourites from localStorage
function loadFavourites() {
    // Get favourites from localStorage
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    
    // Update statistics
    updateStatistics(favourites);
    
    // Check if there are favourites
    if (favourites.length === 0) {
        showEmptyState();
        return;
    }
    
    // Hide empty state
    if (emptyState) emptyState.style.display = 'none';
    
    // Clear current grid
    favouritesGrid.innerHTML = '';
    
    // Create favourite cards
    favourites.forEach(song => {
        const favouriteCard = createFavouriteCard(song);
        favouritesGrid.appendChild(favouriteCard);
    });
}

// Update statistics
function updateStatistics(favourites) {
    if (!favourites || favourites.length === 0) {
        favouriteCount.textContent = '0';
        totalDuration.textContent = '0';
        genreCount.textContent = '0';
        return;
    }
    
    // Count favourites
    favouriteCount.textContent = favourites.length;
    
    // Calculate total duration (simplified)
    let totalMinutes = 0;
    favourites.forEach(song => {
        const duration = song.duration.split(':');
        if (duration.length === 2) {
            totalMinutes += parseInt(duration[0]) + parseInt(duration[1]) / 60;
        } else if (duration.length === 3) {
            totalMinutes += parseInt(duration[0]) * 60 + parseInt(duration[1]) + parseInt(duration[2]) / 60;
        }
    });
    
    totalDuration.textContent = Math.round(totalMinutes);
    
    // Count unique genres
    const genres = new Set(favourites.map(song => song.genre));
    genreCount.textContent = genres.size;
}

// Create favourite card HTML
function createFavouriteCard(song) {
    const card = document.createElement('div');
    card.className = 'favourite-card';
    card.setAttribute('data-id', song.id);
    
    card.innerHTML = `
        <div class="favourite-card-inner">
            <div class="favourite-image">
                <img src="${song.cover}" alt="${song.title}" loading="lazy">
                <div class="favourite-badge">${song.genre}</div>
            </div>
            
            <div class="favourite-info">
                <div class="favourite-header">
                    <div>
                        <h3 class="favourite-title">${song.title}</h3>
                        <p class="favourite-artist">${song.artist}</p>
                    </div>
                    <button class="remove-btn" data-id="${song.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="favourite-meta">
                    <span class="meta-item">
                        <i class="far fa-clock"></i> ${song.duration}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-headphones"></i> ${song.spotifyListeners}
                    </span>
                    <span class="meta-item">
                        <i class="far fa-calendar"></i> ${song.releaseDate.split('-')[0]}
                    </span>
                </div>
                
                <div class="favourite-external-links">
                    <a href="${song.spotifyUrl}" class="external-btn spotify-btn small" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-spotify"></i> Spotify
                    </a>
                    <a href="${song.youtubeUrl}" class="external-btn youtube-btn small" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-youtube"></i> YouTube
                    </a>
                </div>
                
                <div class="favourite-actions">
                    <button class="action-btn view-lyrics" data-id="${song.id}">
                        <i class="fas fa-align-left"></i> View Lyrics
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Show empty state
function showEmptyState() {
    if (emptyState) {
        emptyState.style.display = 'flex';
    }
    
    favouritesGrid.innerHTML = '';
    favouritesGrid.appendChild(emptyState);
}

// Setup event listeners
function setupFavouriteEventListeners() {
    // Clear All button
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', showClearAllModal);
    }
    
    // Instagram dropdown
    const instagramLink = document.getElementById('instagramLink');
    const instagramDropdown = document.getElementById('instagramDropdown');
    
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
    
    // Favourites grid events (delegation)
    favouritesGrid.addEventListener('click', function(event) {
        const target = event.target;
        const favouriteCard = target.closest('.favourite-card');
        
        // Remove button
        if (target.closest('.remove-btn')) {
            event.stopPropagation();
            const button = target.closest('.remove-btn');
            const songId = parseInt(button.getAttribute('data-id'));
            removeFromFavourites(songId);
        }
        
        // View lyrics button
        if (target.closest('.view-lyrics')) {
            event.stopPropagation();
            const button = target.closest('.view-lyrics');
            const songId = parseInt(button.getAttribute('data-id'));
            viewLyrics(songId);
        }
        
        // Click on favourite card (but not on remove button or external links)
        if (favouriteCard && !target.closest('.remove-btn') && !target.closest('.view-lyrics') && !target.closest('a')) {
            const songId = parseInt(favouriteCard.getAttribute('data-id'));
            viewLyrics(songId);
        }
        
        // Prevent default for external links (they should work normally)
        if (target.closest('a')) {
            // Let the link work normally
            return;
        }
    });
}

// Remove song from favourites
function removeFromFavourites(songId) {
    // Get current favourites
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    
    // Find song index
    const index = favourites.findIndex(fav => fav.id === songId);
    
    if (index !== -1) {
        // Remove from array
        favourites.splice(index, 1);
        
        // Save back to localStorage
        localStorage.setItem('favourites', JSON.stringify(favourites));
        
        // Reload favourites
        loadFavourites();
        
        // Show notification
        showNotification('Removed from favourites');
    }
}

// Show clear all favourites modal
function showClearAllModal() {
    const modal = document.getElementById('clearAllModal');
    if (!modal) return;
    
    modal.classList.add('show');
    
    // Setup modal events
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('#clearAllCancel');
    const confirmBtn = modal.querySelector('#clearAllConfirm');
    
    const closeModal = () => {
        modal.classList.remove('show');
    };
    
    closeBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;
    
    confirmBtn.onclick = function() {
        // Clear favourites from localStorage
        localStorage.removeItem('favourites');
        
        // Close modal
        closeModal();
        
        // Reload favourites
        loadFavourites();
        
        // Show notification
        showNotification('All favourites cleared', 'info');
    };
    
    // Close modal when clicking outside
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
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
        
        // Redirect after delay
        setTimeout(() => {
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

// View lyrics
function viewLyrics(songId) {
    // Store song ID for lyrics page
    sessionStorage.setItem('currentSongId', songId);
    
    // Navigate to lyrics page
    window.location.href = 'lyrics.html';
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