let allWeatherData = []; // Store CSV data

// Fetch and display CSV data
window.addEventListener('DOMContentLoaded', function() {
    fetch('/weather_Small.csv')
        .then(response => response.text())
        .then(csvText => {
            const data = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: false // Keep values as strings initially
            }).data;

            console.log('Raw CSV Data (first 3 rows):', data.slice(0, 3)); // Log first 3 rows for debugging
            console.log('CSV Headers:', Object.keys(data[0])); // Log column names

            allWeatherData = data.map((row, index) => {
                // Clean and convert numeric fields
                const cleanNumber = (value, field, rowIndex) => {
                    if (value === null || value === undefined || value === '') {
                        console.warn(`Empty value for ${field} at row ${rowIndex + 2}`);
                        return 0; // Default to 0 for empty values
                    }
                    // Convert to string, remove quotes/spaces, and parse as number
                    const cleaned = String(value).replace(/['"]+/g, '').trim();
                    const number = Number(cleaned);
                    if (isNaN(number)) {
                        console.warn(`Invalid number for ${field} at row ${rowIndex + 2}: "${cleaned}" (raw: "${value}")`);
                        return 0; // Default to 0 for invalid numbers
                    }
                    return number;
                };

                // Map row data
                return {
                    temperature: cleanNumber(row['Temperature'], 'Temperature (°C)', index),
                    humidity: cleanNumber(row['Humidity'], 'Humidity', index),
                    windSpeed: cleanNumber(row['Wind Speed'], 'Wind Speed (km/h)', index),
                    precipitation: cleanNumber(row['Precipitation (%)'], 'Precipitation', index),
                    cloudCover: row['Cloud Cover'] || 'N/A',
                    pressure: cleanNumber(row['Atmospheric Pressure'], 'Atmospheric Pressure', index),
                    uvIndex: cleanNumber(row['UV Index'], 'UV Index', index),
                    season: row['Season'] || 'N/A',
                    visibility: cleanNumber(row['Visibility (km)'], 'Visibility (km)', index),
                    location: row['Location'] || 'N/A',
                    weatherType: row['Weather Type'] || 'N/A'
                };
            });

            console.log('Parsed Weather Data (first 3 rows):', allWeatherData.slice(0, 3)); // Log parsed data
            displayWeather(allWeatherData.slice(0, 15)); // Display first 15 rows
        })
        .catch(error => console.error('Error loading CSV:', error));

    // Apply filters on button click
    document.getElementById('apply-filters').addEventListener('click', filterWeather);
});

// Display weather data in dynamic table
function displayWeather(data) {
    const tbody = document.querySelector('#dynamic-weather-table tbody');
    tbody.innerHTML = '';
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11">Nema podataka za odabrane filtre.</td></tr>';
        return;
    }
    data.forEach(row => {
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

    displayWeather(filteredData.slice(0, 15)); // Display first 15 rows of filtered data
}