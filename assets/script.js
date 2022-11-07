function initPage() {
    const cityEl = document.getElementById ("searchCity");
    const searchEl = document.getElementById ("searchBtn");
    const clearEl = document.getElementById ("clearHistory");
    const nameEl = document.getElementById ("city-Name");
    const currentIconEl = document.getElementById ("currentIcon");
    const currentTempEl = document.getElementById ("temperature");
    const currentHumEl = document.getElementById ("humidity");
    const currentWindEl = document.getElementById ("windspeed");
    const historyEl = document.getElementById("history")
    var fivedayEl = document.getElementById ("fivedayDisplay");
    var currentWeatherEl = document.getElementById("current-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    const apiKey = "a4b429260a736a34655e8ace2ca39f38";

    function weatherInfo(cityName) {

        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {
                currentWeatherEl.classList.remove("d-none");

                const todayDate = new Date(response.data.dt * 1000);
                const day = todayDate.getDate();
                const month = todayDate.getMonth() + 1;
                const year = todayDate.getFullYear();
                nameEl.innerHTML = response.data.name + "(" + month + "/" + day + "/" + year +") ";
                let weatherIcon = response.data.weather[0].icon;
                currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentIconEl.setAttribute("alt", response.data.weather[0].description);
                currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " °F";
                currentHumEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                let cityID = response.data.id;
                let weatherQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                axios.get(weatherQueryURL)
                    .then(function (response) {
                        fivedayEl.classList.remove("d-none");

                        const weatherForeEls = document.querySelectorAll(".weatherFore");
                        for (i = 0; i < weatherForeEls.length; i++) {
                            weatherForeEls[i].innerHTML = "";
                            const weatherForeIndex = i * 8 + 4;
                            const weatherForeDate = new Date(response.data.list[weatherForeIndex].dt * 1000);
                            const weatherForeDay = weatherForeDate.getDate();
                            const weatherForeMonth = weatherForeDate.getMonth() + 1;
                            const weatherForeYear = weatherForeDate.getFullYear();
                            const weatherForeDateEl = document.createElement("p");
                            weatherForeDateEl.setAttribute("class", "mt-4 mb=0 weatherFore-date");
                            weatherForeDate.innerHTML = weatherForeMonth + "/" + weatherForeDay + "/" + weatherForeYear;
                            weatherForeEls[i].append(weatherForeDate);

                            const iForecastEl = document.createElement("img");
                            iForecastEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[weatherForeIndex].weather[0].icon + "@2x.png");
                            iForecastEl.setAttribute("alt", response.data.list[weatherForeIndex].weather[0].description);
                            weatherForeEls[i].append(iForecastEl);
                            const foreTempEl = document.createElement("p");
                            foreTempEl.innerHTML = "Temperature: " + k2f(response.data.list[weatherForeIndex].main.temp + " °F");
                            weatherForeEls[i].append(foreTempEl);
                            const foreHumEl = document.createElement("p");
                            foreHumEl.innerHTML = "Humidity: " + response.data.list[weatherForeIndex].main.humidity + "%");
                            weatherForeEls[i].append(foreHumEl);
                        }
                    })
            })
    }

}