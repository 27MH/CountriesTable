let countriesData;
let originalCountriesData;
let localCountries = [];
let perPage = 10;
let whichPage = 0;
let Border = [];
let switchDirection = 0;
let direction = "asc";

function myDisplayer(apiData, numPerPage = 10, currentPage = 0) {
  let index = 0;
  let counter = 0;
  let data = apiData;
  let pages = data.length / numPerPage;
  let myPages;
  let section = currentPage * numPerPage;

  countriesData = apiData;
  whichPage = currentPage;
  ///handle 20 case
  if (data.length % numPerPage !== 0) {
    pages += 1;
  }

  myPages =
    '<button onclick="myDisplayer(countriesData,perPage,' +
    (whichPage - 1) +
    ')"><<</button>';

  let myTable = `<table class="tab" id="myTab"> \n\
    <tr>\n\
    <th><p>Save to <br> local Storage</p></th>\n\
    <th onclick="sortTable('name')">Name</th>\n\
    <th onclick="sortTable('cca3')">alpha3Code</th>\n\
    <th onclick="sortTable('population')">population</th>\n\
    <th onclick="sortTable('capital')">Capital</th>\n\
    <th>Show Borders</th>\n\
    </tr><tr>`;

  //LOOP THROUGH ARRAY & GENERATE ROWS-CELLS

  for (let country in countriesData) {
    country = Number(country) + section;
    if (counter < numPerPage && country !== data.length) {
      myTable += `<td><input type="checkbox" onclick="checkBoxesvalue(${country},countriesData,localCountries)"/></td>`;
      myTable += `<td>${countriesData[country].name}</td>`;
      myTable += `<td>${countriesData[country].cca3}</td>`;
      myTable += `<td>${countriesData[country].population}</td>`;
      myTable += `<td>${countriesData[country].capital}</td>`;
      myTable +=
        '<td><button class="open" onclick="showBorders(countriesData[' +
        Number(country) +
        "]," +
        country +
        ')">BORDERS</button></td>';

      // goto next row
      let next = index + 1;
      if (next !== data.length) {
        myTable += "</tr><tr>";
      }
      counter++;
      index++;
    } else {
      break;
    }
  }

  //close table
  myTable += "</table>";
  // //ATTACH HTML TO CONTAINER
  document.getElementById("container").innerHTML = myTable;
  /////

  ////pagination;
  for (let pagenum = 1; pagenum <= pages; pagenum++) {
    myPages +=
      '<button onclick="myDisplayer(countriesData,perPage,' +
      (pagenum - 1) +
      ')">' +
      pagenum +
      "</button>";
  }
  myPages +=
    '<button onclick="myDisplayer(countriesData,perPage,' +
    (whichPage + 1) +
    ')">>></button>';
  document.getElementById("pages").innerHTML = myPages;

  // add pagination buttons and set the click action for them
  document.getElementById("perPage").innerHTML =
    '#Per Page :\n\
  <button onclick="pagination(10, countriesData)">10</button>\n\
  <button onclick="pagination(20, countriesData)">20</button>\n\
  <button onclick="pagination(50, countriesData)">50</button>';
}

function checkBoxesvalue(country, countries, local) {
  let table = document.getElementById("myTab");
  let tr = table.getElementsByTagName("tr");
  let td1 = tr[country - perPage * whichPage + 1].getElementsByTagName("td")[0];
  let ch = td1.getElementsByTagName("input")[0];
  if (ch.checked === true) {
    local.push(countries[country]);
    ch.checked = true;
  } else {
    local.pop();
    ch.checked = false;
  }
  localStorage.setItem("countries", JSON.stringify(local));
}

//to choose #of countries per page
function pagination(num, countriesArr) {
  whichPage = 0;
  perPage = num;
  myDisplayer(countriesArr, perPage, whichPage);
}

//read api(json)
async function getText(callBack) {
  try {
    let myObject = await fetch("https://restcountries.com/v3.1/all");
    let myText = await myObject.text();
    let data = JSON.parse(myText);
    data = data.map((country) => ({
      name: country.name.common,
      capital: country.capital ? country.capital[0] : "",
      cca3: country.cca3,
      population: country.population,
      borders: country.borders ? country.borders : [],
    }));
    originalCountriesData = data;
    callBack(data);
  } catch (error) {
    callBack(JSON.parse(localStorage.getItem("countries")));
  }
}

//sort by headings
function sortTable(property) {
  let sortedData;
  if (switchDirection % 2 === 0) {
    direction = "asc";
    switchDirection++;
  } else {
    direction = "desc";
    switchDirection++;
  }
  sortedData = countriesData.sort((a, b) => compare(a, b, property, direction));
  myDisplayer(sortedData, perPage, whichPage);
}

function compare(a, b, property, direction) {
  if (direction === "asc") {
    return a[property] > b[property] ? 1 : -1;
  } else if (direction === "desc") {
    return a[property] < b[property] ? 1 : -1;
  }
}

//filtering

function filtering() {
  let input, filter;
  input = document.getElementById("myInput");
  filter = input.value.toLowerCase();
  let filteredArr = originalCountriesData.filter(
    (object) =>
      object.name.toLowerCase().includes(filter) ||
      object.cca3.toLowerCase().includes(filter) ||
      object.population.toString().includes(filter) ||
      object.capital.toLowerCase().includes(filter)
  );
  myDisplayer(filteredArr);
}

//borders
function showBorders(states, country) {
  let result = "";
  if (states.borders === undefined) {
    result = "No Borders Found";
  } else {
    result = "Borders are :<br>  " + states.borders;
  }
  let dialog = document.querySelector(".dialog");
  let closeButton = document.querySelector(".close");
  document.getElementById("result").innerHTML = result;
  dialog.show();
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
}

//function call
getText(myDisplayer);
