const checkboxes1 = document.getElementById('selection1');
const checkboxes2 = document.getElementById('selection2');
const checkboxes3 = document.getElementById('selection3');

const var1 = ["Befolkning", "Areal", "Landareal", "Innbyggere"];
const var1_values = ["Folkemengde", "ArealKm2", "LandArealKm2", "FolkeLandArealKm2"];
const var2 = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];
const var3 = ["1554 Averøy", "1505 Kristiansund", "1506 Molde", "1508 Ålesund"];
const var3_values = ["1554", "1505", "1506", "1508"];

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

// Get the checked values
function getCheckedValues() {
    const checkedValues1 = Array.from(checkboxes1.querySelectorAll('input[type="checkbox"]:checked')).map(item => item.value);
    const checkedValues2 = Array.from(checkboxes2.querySelectorAll('input[type="checkbox"]:checked')).map(item => item.value);
    const checkedValues3 = Array.from(checkboxes3.querySelectorAll('input[type="checkbox"]:checked')).map(item => item.value);

    // Check if at least one checkbox is checked in each array
    if (checkedValues1.length === 0 || checkedValues2.length === 0 || checkedValues3.length === 0) {
        throw new Error('At least one checkbox must be checked in each array');
    }

    console.log(checkedValues1, checkedValues2, checkedValues3);
}


// Add a button to get the checked values
const button = document.createElement('button');

button.textContent = 'Get checked values';
button.addEventListener('click', getCheckedValues);
document.body.appendChild(button);


/*
JSON query

{
  "query": [
    {
      "code": "Region",
      "selection": {
        "filter": "item",
        "values": [
          "0",
          "31",
          "3101",
          "99",
          "9999"
        ]
      }
    },
    {
      "code": "ContentsCode",
      "selection": {
        "filter": "item",
        "values": [
          "Folkemengde",
          "ArealKm2",
          "LandArealKm2",
          "FolkeLandArealKm2"
        ]
      }
    },
    {
      "code": "Tid",
      "selection": {
        "filter": "item",
        "values": [
          "2007",
          "2008",
          "2009",
          "2023",
          "2024"
        ]
      }
    }
  ],
  "response": {
    "format": "json-stat2"
  }
}

*/