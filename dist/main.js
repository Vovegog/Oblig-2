const checkboxes1 = document.getElementById('selection1');
const checkboxes2 = document.getElementById('selection2');
const checkboxes3 = document.getElementById('selection3');

const var1 = ["Befolkning", "Areal", "Landareal", "Innbyggere"];
const var1_values = ["Folkemengde", "ArealKm2", "LandArealKm2", "FolkeLandArealKm2"];
const var2 = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];
const var3 = ["1505 Kristiansund", "1506 Molde", "1508 Ålesund", "1554 Averøy"];
const var3_values = ["1505", "1506", "1508", "1554"];

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

// We need our URL to the localhost server we will send the JSON query to
const url = 'https://data.ssb.no/api/v0/no/table/11342';

JSON_query = {};

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

// Now we need to assign the getcheckedvalues function to button with id "check_variables" with an onClick function in our HTML file
// We need to wrap it in a function, this way we can call the API with the checked values as arguments if we have all checkboxes needed checked
function API_callFunction() {
  try {
      query = JSON.stringify(getCheckedValues());
      console.log(query); // Check if the query is correct. And it seems like it is!

      // Now we need to send the JSON query to the URL using a fetch POST request
    fetch (url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: query,
    })
    .then(response => console.log(response.json()));
  } catch (error) {
      console.log(error);
  }
}

// Now we need to assign the getcheckedvalues function to button with id "check_variables" with an onClick function in our HTML file
document.getElementById('check_variables').addEventListener('click', API_callFunction);

/*

So, this works. We get a good response with a correctly formatted JSON response.
Befolkning, Areal, Landareal, Innbyggere
2020, 2021
And with Kristiansund and Molde checked, it yields this:

value:
(16) [24179, 24099, 87, 87, 86, 86, 281, 280, 31967, 31870, 1503, 1503, 1435, 1435, 22, 22]
0: 24179
1: 24099
2: 87
3: 87
4: 86
5: 86
6: 281
7: 280
8: 31967
9: 31870
10: 1503
11: 1503
12: 1435
13: 1435
14: 22
15: 22

This shows us that the response is befolkning Kristiansund in 2020, then 2021. Then it shows areal 2020, 2021. Landareal 2020, 2021. Innbyggere 2020, 2021, and then it swaps over to Molde and does it all over again. This is exactly what we wanted.

Now we need to create a function that can take this data and create a dynamic table with it. Into the thinking box we go..

*/

/* Example of the JSON query we want to create, taken from the SSB API documentation
JSON
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
} */