function initPage() {
    const cityEl = document.getElementById ("input-city");
    const searchEl = document.getElementById ("searchBtn");
    const clearEl = document.getElementById ("clear-history");
    const nameEl = document.getElementById ("city-name");
    const currentIconEl = document.getElementById ("currentIcon");
    const currentTempEl = document.getElementById ("temperature");
    const currentHumidityEl = document.getElementById ("humidity");
    const currentWindEl = document.getElementById ("windspeed");
    const historyEl = document.getElementById("history")
    var fivedayEl = document.getElementById ("fiveday");
    var currentWeatherEl = document.getElementById("current-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    
    // Assigning API to variable //
    const myapiKey = "a4b429260a736a34655e8ace2ca39f38";

    function weatherInfo(cityName) {
        // Current weather get request from Open Weather API //
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + myapiKey;
        axios.get(queryURL)
            .then(function (response) {
                
                currentWeatherEl.classList.remove("d-none");

                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year +") ";
                let weatherIcon = response.data.weather[0].icon;
                currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                currentIconEl.setAttribute("alt", response.data.weather[0].description);
                currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                // Get 5-day forecast for selected city //
                let cityID = response.data.id;
                let weatherQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + myapiKey;
                axios.get(weatherQueryURL)
                    .then(function (response) {
                        fivedayEl.classList.remove("d-none");
                        
                        // Parse response to display 5-day forecast //
                        const forecastEls = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecastEls.length; i++) {
                            forecastEls[i].innerHTML = "";
                            const forecastIndex = i * 8 + 4;
                            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate();
                            const forecastMonth = forecastDate.getMonth() + 1;
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEls[i].append(forecastDateEl);

                            // Current weather icon //
                            const forecastWeatherEl = document.createElement("img");
                            forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecastEls[i].append(forecastWeatherEl);
                            const forecastTempEl = document.createElement("p");
                            forecastTempEl.innerHTML = "Temperature: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                            forecastEls[i].append(forecastTempEl);
                            const forecastHumidityEl = document.createElement("p");
                            forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecastEls[i].append(forecastHumidityEl);
                        }
                    })
                });
    }

    // Search history from local storage //
    searchEl.addEventListener("click", function () {
        const searchInput = cityEl.value;
        weatherInfo(searchInput);
        searchHistory.push(searchInput);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    // Clear search history //
    clearEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 +32);
    }

    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white text-center");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                weatherInfo(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        weatherInfo(searchHistory[searchHistory.length - 1]);
    }
}

initPage();