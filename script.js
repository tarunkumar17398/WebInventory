document.getElementById('search-button').addEventListener('click', function() {
    var category = document.getElementById('category-dropdown').value;
    var searchTerm = document.getElementById('search-input').value;
    fetchDataAndDisplayResults(category, searchTerm);
});

function fetchDataAndDisplayResults(category, searchTerm) {
    const csvFileUrl = 'https://drive.google.com/uc?export=download&id=1E9ZOgHwKDAqaheKCMhzh2Yzxe9MoO-_b'; // Replace with your actual file ID

    fetch(csvFileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log("CSV Data:", data); // Log the fetched data
            let csvData = parseCSVData(data);
            let filteredData = filterData(csvData, category, searchTerm);
            displayResults(filteredData);
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
}


function parseCSVData(data) {
    let rows = data.split('\n');
    let headers = rows[0].split(',');

    return rows.slice(1).map(row => {
        let values = row.split(',');
        let object = {};
        headers.forEach((header, index) => {
            object[header.trim()] = values[index].trim();
        });
        return object;
    });
}


function filterData(csvData, category, searchTerm) {
    return csvData.filter(item => {
        // Assuming 'category' is a key in your CSV data
        // and the search term is to be matched against the 'Particulars' field
        let isCategoryMatch = item['Category'] === category; // Replace 'Category' with the actual key name for category in your CSV
        let isSearchTermMatch = item['Particulars'].toLowerCase().includes(searchTerm.toLowerCase());

        return isCategoryMatch && isSearchTermMatch;
    });
}


function displayResults(filteredData) {
    let resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = ''; // Clear previous results

    if (filteredData.length === 0) {
        resultContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    let table = document.createElement('table');
    table.setAttribute('class', 'result-table'); // Add a class for styling if needed

    // Create header row
    let headerRow = table.insertRow();
    let headers = ['Item Code', 'Particulars', 'Height', 'Weight']; // Adjust these headers based on your CSV structure
    headers.forEach(headerText => {
        let header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });

    // Add data rows
    filteredData.forEach(item => {
        let row = table.insertRow();
        headers.forEach(header => {
            let cell = row.insertCell();
            cell.textContent = item[header]; // Make sure this matches the keys in your objects
        });
    });

    resultContainer.appendChild(table);
}

