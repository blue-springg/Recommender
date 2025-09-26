// TMDB API Key - Replace with your own! Sign up at https://www.themoviedb.org/
const API_KEY = 'YOUR_TMDB_API_KEY_HERE'; // Get a free key from TMDB

// Base URL for TMDB API
const BASE_URL = 'https://api.themoviedb.org/3';

// Image base URL
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Genre lists (TMDB has separate IDs for movies and TV)
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
    { id: 10770, name: 'TV Movie' },
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
});

seriesBtn.addEventListener('click', () => {
    selectedType = 'tv';
    populateGenres(tvGenres);
    showSection(genreSection);
});

getRecommendationsBtn.addEventListener('click', () => {
    const genreId = genreSelect.value;
    if (genreId) {
        fetchRecommendations(selectedType, genreId);
    } else {
        alert('Please select a genre!');
    }
});

backBtn.addEventListener('click', () => {
    showSection(choiceSection);
    genreSelect.innerHTML = '<option value="">Choose a genre...</option>';
    resultsGrid.innerHTML = '';
});

// Functions
function populateGenres(genres) {
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

function showSection(section) {
    choiceSection.classList.add('hidden');
    genreSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    section.classList.remove('hidden');
}

async function fetchRecommendations(type, genreId) {
    try {
        const response = await fetch(`${BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`);
        const data = await response.json();
        displayResults(data.results, type);
        showSection(resultsSection);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Something went wrong. Check your API key or internet connection.');
    }
}

function displayResults(items, type) {
    resultsGrid.innerHTML = '';
    items.slice(0, 10).forEach(item => { // Limit to 10 for simplicity
        const card = document.createElement('div');
        card.classList.add('card');
        
        const img = document.createElement('img');
        img.src = item.poster_path ? `${IMG_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
        img.alt = item.title || item.name;
        
        const info = document.createElement('div');
        info.classList.add('card-info');
        
        const title = document.createElement('h3');
        title.textContent = item.title || item.name;
        
        const rating = document.createElement('p');
        rating.textContent = `Rating: ${item.vote_average} ⭐`;
        
        info.appendChild(title);
        info.appendChild(rating);
        card.appendChild(img);
        card.appendChild(info);
        resultsGrid.appendChild(card);
    });
}

// Initial show
showSection(choiceSection);
