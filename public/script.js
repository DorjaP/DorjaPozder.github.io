let allWeatherData = []; // Store CSV data

// Fetch and display CSV data
window.addEventListener('DOMContentLoaded', function() {
    fetch('/weather_Small.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvText => {
            if (!csvText.trim()) {
                console.error('CSV file is empty');
                displayWeather([]);
                return;
            }

            console.log('Raw CSV Content (first 200 chars):', csvText.substring(0, 200));

            const data = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true // Let PapaParse convert numbers automatically
            });

            if (!data.data || data.data.length === 0) {
                console.error('No data parsed from CSV. Errors:', data.errors);
                displayWeather([]);
                return;
            }

            console.log('Raw CSV Data (first 3 rows):', data.data.slice(0, 3));
            console.log('CSV Headers:', Object.keys(data.data[0]));

            allWeatherData = data.data.map((row, index) => {
                // Clean and convert fields
                const cleanValue = (value, field, rowIndex, defaultValue = 'N/A') => {
                    if (value === null || value === undefined || value === '') {
                        console.warn(`Empty value for ${field} at row ${rowIndex + 2}`);
                        return defaultValue;
                    }
                    return value;
                };

                const cleanNumber = (value, field, rowIndex) => {
                    const cleaned = cleanValue(value, field, rowIndex, 0);
                    if (typeof cleaned === 'number' && !isNaN(cleaned)) {
                        return cleaned;
                    }
                    console.warn(`Invalid number for ${field} at row ${rowIndex + 2}: "${cleaned}"`);
                    return 0;
                };

                return {
                    rowId: `row_${index}_${Date.now()}`, // Unique ID for cart
                    temperature: cleanNumber(row['Temperature'], 'Temperature', index),
                    humidity: cleanNumber(row['Humidity'], 'Humidity', index),
                    windSpeed: cleanNumber(row['Wind Speed'], 'Wind Speed', index),
                    precipitation: cleanNumber(row['Precipitation (%)'], 'Precipitation (%)', index),
                    cloudCover: cleanValue(row['Cloud Cover'], 'Cloud Cover', index),
                    pressure: cleanNumber(row['Atmospheric Pressure'], 'Atmospheric Pressure', index),
                    uvIndex: cleanNumber(row['UV Index'], 'UV Index', index),
                    season: cleanValue(row['Season'], 'Season', index),
                    visibility: cleanNumber(row['Visibility (km)'], 'Visibility (km)', index),
                    location: cleanValue(row['Location'], 'Location', index),
                    weatherType: cleanValue(row['Weather Type'], 'Weather Type', index)
                };
            });

            console.log('Parsed Weather Data (first 3 rows):', allWeatherData.slice(0, 3));
            console.log('Total Rows Parsed:', allWeatherData.length);

            displayWeather(allWeatherData.slice(0, 15)); // Display first 15 rows
        })
        .catch(error => {
            console.error('Error loading CSV:', error);
            displayWeather([]);
        });

    // Apply filters on button click
    document.getElementById('apply-filters').addEventListener('click', filterWeather);
});

// Display weather data in dynamic table
function displayWeather(data) {
    const tbody = document.querySelector('#dynamic-weather-table tbody');
    tbody.innerHTML = '';
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12">Nema podataka za odabrane filtre ili CSV nije učitan.</td></tr>';
        return;
    }
    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.temperature}</td>
            <td>${row.humidity}</td>
            <td>${row.windSpeed}</td>
            <td>${row.precipitation}</td>
            <td>${row.cloudCover}</td>
            <td>${row.pressure}</td>
            <td>${row.uvIndex}</td>
            <td>${row.season}</td>
            <td>${row.visibility}</td>
            <td>${row.location}</td>
            <td>${row.weatherType}</td>
            <td><button onclick="dodajUKosaricu(${index})">+</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Filter weather data
function filterWeather() {
    const season = document.getElementById('filter-season').value;
    const location = document.getElementById('filter-location').value;
    const weatherType = document.getElementById('filter-weather-type').value;

    const filteredData = allWeatherData.filter(row => {
        const seasonMatch = !season || row.season === season;
        const locationMatch = !location || row.location === location;
        const weatherTypeMatch = !weatherType || row.weatherType === weatherType;
        return seasonMatch && locationMatch && weatherTypeMatch;
    });

    console.log('Filtered Data (first 3 rows):', filteredData.slice(0, 3));
    console.log('Filtered Rows:', filteredData.length);
    displayWeather(filteredData.slice(0, 15)); // Display first 15 rows of filtered data
}

// Add to cart
function dodajUKosaricu(index) {
    const day = allWeatherData[index];  // Get the correct object
    let kosarica = JSON.parse(localStorage.getItem('kosarica')) || [];
    if (!kosarica.some(item => item.rowId === day.rowId)) {
        kosarica.push(day);
        localStorage.setItem('kosarica', JSON.stringify(kosarica));
        alert('Dan dodan u košaricu!');
    } else {
        alert('Dan je već u košarici!');
    }
}
