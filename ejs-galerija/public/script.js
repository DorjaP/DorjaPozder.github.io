window.addEventListener('DOMContentLoaded', function() {
    fetch('weather_Small.csv')
      .then(response => response.text())
      .then(csvText => {
        const data = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true
        }).data;
  
        console.log(data); // Check your data in console
  
        buildTable(data); // Build the table with the fetched data
      })
      .catch(error => {
        console.error('Error loading CSV:', error);
      });
  });
  
  function buildTable(data) {
    const table = document.createElement('table'); // Create a <table> element
    table.classList.add('data-table'); // (optional) Add a class for styling
  
    const thead = document.createElement('thead'); // Table header
    const tbody = document.createElement('tbody'); // Table body
  
    // Build the table header row
    const headerRow = document.createElement('tr');
    const headers = Object.keys(data[0]); // Get keys from the first object
  
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
  
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    // Build the table body rows
    const first15Rows = data.slice(0,15);
    first15Rows.forEach(rowData => {
      const row = document.createElement('tr');
  
      headers.forEach(header => {
        const td = document.createElement('td');
        td.textContent = rowData[header];
        row.appendChild(td);
      });
  
      table.appendChild(row);
    });
  
    // Finally, put the table into the page
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = ''; // Clear old content if any
    tableContainer.appendChild(table);
  }
  