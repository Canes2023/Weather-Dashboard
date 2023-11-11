const apiKey = 'c38c3d33c7be0220bb56ba6e232e6c51';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const weatherContainer = document.getElementById('weather-container');
const historyList = document.getElementById('history-list');

// Load search history from localStorage on page load
const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
renderSearchHistory();

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const city = cityInput.value;
  getWeather(city);
});

function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
      addCityToHistory(city);
    })
    .catch(error => console.error('Error fetching weather data:', error));
}

function displayWeather(data) {
  const { name, main, wind, weather } = data;
  const weatherHtml = `
    <div>
      <h2>${name} - ${new Date().toLocaleDateString()}</h2>
      <p>Temperature: ${main.temp} °F</p>
      <p>Humidity: ${main.humidity}%</p>
      <p>Wind Speed: ${wind.speed} m/s</p>
      <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" alt="Weather Icon">
    </div>
  `;
  weatherContainer.innerHTML = weatherHtml;
}

function addCityToHistory(city) {
  // Added city to search history
  searchHistory.unshift(city);

  // Saved search history to localStorage
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  // Rendered updated search history
  renderSearchHistory();
}

function renderSearchHistory() {
  // Cleared existing list items
  historyList.innerHTML = '';

  // Rendered each city in the search history
  searchHistory.forEach(city => {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.addEventListener('click', () => getWeather(city));
    historyList.appendChild(listItem);
  });
}