const languageSelect = document.getElementById('language-select');
const seasonSelect = document.getElementById('season-select');
const episodeSelect = document.getElementById('episode-select');
const player = document.getElementById('player');

let episodesData = [];

function fetchEpisodes(lang = 'en', season = null) {
  let url = '/api/episodes?lang=' + lang;
  if (season) url += '&season=' + season;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      episodesData = data;
      populateSeasons();
    })
    .catch(err => console.error('Failed to load episodes:', err));
}

function populateSeasons() {
  seasonSelect.innerHTML = '';
  episodesData.forEach(season => {
    const option = document.createElement('option');
    option.value = season.season;
    option.textContent = season.title;
    seasonSelect.appendChild(option);
  });
  seasonSelect.selectedIndex = 0;
  populateEpisodes();
}

function populateEpisodes() {
  episodeSelect.innerHTML = '';
  const selectedSeason = episodesData.find(s => s.season == seasonSelect.value);
  if (!selectedSeason) return;
  selectedSeason.episodes.forEach(ep => {
    const option = document.createElement('option');
    option.value = ep.filename;
    option.textContent = ep.title;
    episodeSelect.appendChild(option);
  });
  episodeSelect.selectedIndex = 0;
  // Only play if there is at least one episode
  if (episodeSelect.options.length > 0) {
    playEpisode(episodeSelect.value);
  } else {
    player.removeAttribute('src');
    player.load();
  }
}

function playEpisode(filename) {
  if (!filename) return;
  player.src = `/video/${filename}`;
  player.play();
  player.focus();
}

languageSelect.addEventListener('change', () => {
  fetchEpisodes(languageSelect.value);
});

seasonSelect.addEventListener('change', () => {
  fetchEpisodes(languageSelect.value, seasonSelect.value);
});

episodeSelect.addEventListener('change', () => {
  playEpisode(episodeSelect.value);
});

// Load default language episodes on page load
fetchEpisodes('en');
