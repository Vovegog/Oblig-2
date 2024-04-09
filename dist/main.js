const checkboxes1 = document.getElementById('selection1');
const checkboxes2 = document.getElementById('selection2');
const checkboxes3 = document.getElementById('selection3');

const var1 = ["Befolkning", "Areal", "Landareal", "Innbyggere"];
const var1_values = ["Folkemengde", "ArealKm2", "LandArealKm2", "FolkeLandArealKm2"];
const var2 = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];
const var3 = ["1505 Kristiansund", "1506 Molde", "1508 Ålesund", "1554 Averøy"];
const var3_values = ["1505", "1506", "1508", "1554"];

/* ----------------- VARIABLES ----------------- */
// Declare our variables
let JSON_query = {};
let queryResponse = {};
let dstable = [];
const url = 'http://localhost:80/apicall';

/* ----------------- FUNCTIONS ----------------- */

// Create a checkbox class for easy construction
class Checkboxes {
    constructor(name, id, value) {
        this.name = name;
        this.type = "checkbox";
        this.checked = false;
        this.id = id;
        this.value = value;
    }
}

// Use the class to create the checkboxes
checkboxes1.innerHTML = var1.map((item, index) => {
    const checkbox = new Checkboxes("selection1", `${item}`, value = var1_values[index]);
    return `<input type="${checkbox.type}" id="${checkbox.id}" name="${checkbox.name}" value="${checkbox.value}"><label for="${checkbox.id}">${checkbox.id}</label><br>`;
}).join('');

checkboxes2.innerHTML = var2.map((item, index) => {
    const checkbox = new Checkboxes("selection2", `${item}`, value = item);
    return `<input type="${checkbox.type}" id="${checkbox.id}" name="${checkbox.name}" value="${checkbox.value}"><label for="${checkbox.id}">${checkbox.id}</label><br>`;
}).join('');

checkboxes3.innerHTML = var3.map((item, index) => {
    const checkbox = new Checkboxes("selection3", `${item}`, value = var3_values[index]);
    return `<input type="${checkbox.type}" id="${checkbox.id}" name="${checkbox.name}" value="${checkbox.value}"><label for="${checkbox.id}">${checkbox.id}</label><br>`;
}).join('');

// Function to get the checked values
function getCheckedValues() {
    const checkedValues1 = Array.from(checkboxes1.querySelectorAll('input[type="checkbox"]:checked')).map(item => item.value);
    const checkedValues2 = Array.from(checkboxes2.querySelectorAll('input[type="checkbox"]:checked')).map(item => item.value);
    const checkedValues3 = Array.from(checkboxes3.querySelectorAll('input[type="checkbox"]:checked')).map(item => item.value);

    // Check if at least one checkbox is checked in each array
    if (checkedValues1.length === 0 || checkedValues2.length === 0 || checkedValues3.length === 0) {
        throw new Error('At least one checkbox must be checked in each array');
    }

    console.log(checkedValues1, checkedValues2, checkedValues3);
    return JSON_query = {
        "query": [
            {
                "code": "Region",
                "selection": {
                    "filter": "item",
                    "values": checkedValues3
                }
            },
            {
                "code": "ContentsCode",
                "selection": {
                    "filter": "item",
                    "values": checkedValues1
                }
            },
            {
                "code": "Tid",
                "selection": {
                    "filter": "item",
                    "values": checkedValues2
                }
            }
        ],
        "response": {
            "format": "json-stat2"
        }
    }
}

function tableCreate(dstable) {
    let table = document.createElement('table');
    let header = table.createTHead();
    let row = header.insertRow(0);
    let cell = row.insertCell(0);
    cell.innerHTML = "Region";
    cell = row.insertCell(1);
    cell.innerHTML = "Statistikkvariabel";
    cell = row.insertCell(2);
    cell.innerHTML = "År";
    cell = row.insertCell(3);
    cell.innerHTML = "Verdi";
    row.classList.add('header-row');
    let body = table.createTBody();
    let lastRegion = '';
    for (let i = 1; i < dstable.length; i++) {
        let row = body.insertRow(i - 1);
        for (let j = 0; j < dstable[i].length; j++) {
            let cell = row.insertCell(j);
            cell.innerHTML = dstable[i][j];
            if (j === 0) { // Here we check if the name of the region is the same. If it is, add to class repeated-region for CSS purposes
                cell.classList.add('region-name');
                if (dstable[i][j] === lastRegion) {
                    cell.classList.add('repeated-region');
                }
                lastRegion = dstable[i][j];
            }
        }
    }
    return table;
}

/* ----------------- API CALL ----------------- */

// Now we need to assign the getcheckedvalues function to button with id "check_variables" with an onClick function in our HTML file
// We need to wrap it in a function, this way we can call the API with the checked values as arguments if we have all checkboxes needed checked
async function API_callFunction() {
  try {
      JSON_query = JSON.stringify(getCheckedValues());
      console.log(JSON_query); // Check if the query is correct. And it seems like it is!

      // Now we need to send the JSON query to the URL using a fetch POST request
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON_query,
    })
    .then(response => queryResponse = response.json())
    .then(queryResponse => {
    if (queryResponse !== undefined) {
        console.log(queryResponse);
        dstable = queryResponse.table;
        console.log(dstable);
        // Check if the div is empty, if not, clear it
        if (document.getElementById('SSB_table').innerHTML !== "") {
            document.getElementById('SSB_table').innerHTML = "";
        }
        // Now we append the table to the div with id "SSB_table" by running the tableCreate function
        document.getElementById('SSB_table').appendChild(tableCreate(dstable));
    }
    })
  } catch (error) {
      console.log(error);
  }
};

/* ----------------- EVENT LISTENER ----------------- */

// Now we need to assign the API_callFunction to our button with id "check_variables" with an onClick function in our HTML file
document.getElementById('check_variables').addEventListener('click', API_callFunction);
