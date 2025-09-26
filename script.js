// TMDB API Configuration
// IMPORTANT: Replace 'YOUR_TMDB_API_KEY_HERE' with your actual free API key from https://www.themoviedb.org/settings/api
// Steps: 1. Sign up/login to TMDB. 2. Go to Settings > API. 3. Create a new API key (v3 auth). 4. Paste it here.
// Without a valid key, the app will show the error - it's required for real data!
const API_KEY = 'YOUR_TMDB_API_KEY_HERE'; // <- CHANGE THIS!

// Base URLs
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Genre lists (updated with accurate TMDB IDs for 2025)
const movieGenres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
];

const tvGenres = [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10762, name: 'Kids' },
    { id: 9648, name: 'Mystery' },
    { id: 10763, name: 'News' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10766, name: 'Soap' },
    { id: 10767, name: 'Talk' },
    { id: 10768, name: 'War & Politics' },
    { id: 37, name: 'Western' }
];

// DOM Elements
const choiceSection = document.getElementById('choice-section');
const genreSection = document.getElementById('genre-section');
const resultsSection = document.getElementById('results-section');
const moviesBtn = document.getElementById('movies-btn');
const seriesBtn = document.getElementById('series-btn');
const genreSelect = document.getElementById('genre-select');
const getRecommendationsBtn = document.getElementById('get-recommendations');
const resultsGrid = document.getElementById('results-grid');
const backBtn = document.getElementById('back-btn');

// Variables
let selectedType = ''; // 'movie' or 'tv'

// Event Listeners
moviesBtn.addEventListener('click', () => {
    selectedType = 'movie';
    populateGenres(movieGenres);
    showSection(genreSection);
    hideButtons();
});

seriesBtn.addEventListener('click', () => {
    selectedType = 'tv';
    populateGenres(tvGenres);
    showSection(genreSection);
    hideButtons();
});

getRecommendationsBtn.addEventListener('click', () => {
    const genreId = genreSelect.value;
    if (!genreId) {
        alert('Please select a genre first!');
        return;
    }
    if (API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
        alert('Please add your TMDB API key to script.js! Sign up at https://www.themoviedb.org/settings/api');
        return;
    }
    fetchRecommendations(selectedType, genreId);
});

backBtn.addEventListener('click', () => {
    resetApp();
});

// Functions
function populateGenres(genres) {
    // Clear existing options except the placeholder
    genreSelect.innerHTML = '<option value="">Choose a genre...</option>';
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

function showSection(sectionToShow) {
    // Hide all sections
    choiceSection.classList.add('hidden');
    genreSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    // Show target
    sectionToShow.classList.remove('hidden');
}

function hideButtons() {
    moviesBtn.style.display = 'none';
    seriesBtn.style.display = 'none';
}

function resetApp() {
    showSection(choiceSection);
    genreSelect.innerHTML = '<option value="">Choose a genre...</option>';
    resultsGrid.innerHTML = '';
    moviesBtn.style.display = 'block';
    seriesBtn.style.display = 'block';
    getRecommendationsBtn.textContent = 'Get Recommendations';
}

async function fetchRecommendations(type, genreId) {
    getRecommendationsBtn.textContent = 'Loading...';
    getRecommendationsBtn.disabled = true;
    resultsGrid.innerHTML = '<div class="loader"></div>'; // Visual feedback
    
    try {
        const endpoint = type === 'movie' ? 'discover/movie' : 'discover/tv';
        const url = `${BASE_URL}/${endpoint}?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&language=en-US`;
        
        console.log('Fetching from:', url); // For debugging - check browser console
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} - Check your API key or try again.`);
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            resultsGrid.innerHTML = '<p>No recommendations found for this genre. Try another!</p>';
            showSection(resultsSection);
            return;
        }
        
        displayResults(data.results.slice(0, 12), type); // Show up to 12
        showSection(resultsSection);
        
    } catch (error) {
        console.error('Fetch error:', error);
        resultsGrid.innerHTML = `<p>Error: ${error.message}</p>`;
        showSection(resultsSection);
        alert(`Oops! ${error.message}\n\nIf this persists, ensure your TMDB API key is valid and active. Test it in a browser: https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`);
    } finally {
        getRecommendationsBtn.textContent = 'Get Recommendations';
        getRecommendationsBtn.disabled = false;
    }
}

function displayResults(items, type) {
    resultsGrid.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const img = document.createElement('img');
        img.src = item.poster_path ? `${IMG_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
        img.alt = (item.title || item.name) + ' poster';
        img.loading = 'lazy';
        
        const info = document.createElement('div');
        info.classList.add('card-info');
        
        const title = document.createElement('h3');
        title.textContent = item.title || item.name;
        
        const rating = document.createElement('p');
        rating.innerHTML = `⭐ ${item.vote_average.toFixed(1)} / 10`;
        
        info.appendChild(title);
        info.appendChild(rating);
        card.appendChild(img);
        card.appendChild(info);
        resultsGrid.appendChild(card);
    });
}

// Initialize
resetApp();
