let countriesData;
let localCountries = [];
let perPage = 10;
let where = 0;
let Border = [];
let switchDirection = 0;
let direction = "asc";
function myDisplayer(apiData, numPerPage = 10, whichPage = 0) {
  let index = 0;
  let counter = 0;
  let data = JSON.parse(apiData);
  let pages = data.length / numPerPage;
  let myPages;
  countriesData = data;
  where = whichPage;
  let section = whichPage * numPerPage;
  ///handle 20 case
  if (data.length % numPerPage !== 0) {
    pages += 1;
  }

  myPages =
    '<button onclick="myDisplayer(JSON.stringify(countriesData),perPage,' +
    (where - 1) +
    ')"><<</button>';

  let myTable =
    '<table class="tab" id="myTab"> \n\
                                <tr>\n\
                                <th><p>Save to <br> local Storage</p></th>\n\
                                <th onclick="sortTable(2,countriesData)">Name</th>\n\
                                <th onclick="sortTable(3,countriesData)">alpha3Code</th>\n\
                                <th onclick="sortTable(4,countriesData)">population</th>\n\
                                <th onclick="sortTable(5,countriesData)">Capital</th>\n\
                                <th>Show Borders</th>\n\
                                </tr><tr>';

  //LOOP THROUGH ARRAY & GENERATE ROWS-CELLS

  for (let country in data) {
    country = Number(country) + section;
    if (counter < numPerPage && country !== data.length) {
      let Capital = data[country].capital;
      if (Capital === undefined) {
        Capital = "unKnown";
        data[country].capital = Capital;
      }

      myTable += `<td><input type="checkbox" onclick="checkBoxesvalue(${country},countriesData,localCountries)"/></td>`;
      myTable += `<td>${data[country].name.common}</td>`;
      myTable += `<td>${data[country].cca3}</td>`;
      myTable += `<td>${data[country].population}</td>`;
      myTable += `<td>${Capital}</td>`;
      myTable +=
        '<td><button onclick="showBorders(countriesData[' +
        Number(country) +
        '])">BORDERS</button></td>';

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
      '<button onclick="myDisplayer(JSON.stringify(countriesData),perPage,' +
      (pagenum - 1) +
      ')">' +
      pagenum +
      "</button>";
  }
  myPages +=
    '<button onclick="myDisplayer(JSON.stringify(countriesData),perPage,' +
    (where + 1) +
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
  let td1 = tr[country - perPage * where + 1].getElementsByTagName("td")[0];
  let ch = td1.getElementsByTagName("input")[0];
  if (ch.checked === true) {
    local.push(countries[country]);
    ch.checked = true;
  } else {
    local.pop();
    ch.checked = false;
  }
  console.log(local.length);
  localStorage.setItem("countries", JSON.stringify(local));
}

//to choose #of countries per page
function pagination(num, arr) {
  where = 0;
  perPage = num;
  myDisplayer(JSON.stringify(arr), perPage, where);
}

//read api(json)
async function getText(callBack) {
  try {
    let myObject = await fetch("https://restcountries.com/v3.1/all");
    let myText = await myObject.text();
    callBack(myText);
  } catch {
    callBack(localStorage.getItem("countries"));
  }
}
//function call
getText(myDisplayer);

//sort by headings
function sortTable(columnNum, array) {
  let jsonn;
  if (switchDirection % 2 === 0) {
    direction = "asc";
    switchDirection++;
  } else {
    direction = "desc";
    switchDirection++;
  }
  switch (columnNum) {
    case 2:
      if (direction === "asc") {
        arr.sort((a, b) => {
          let fa = a.name.common;
          let fb = b.name.common;

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
      } else {
        array.sort((a, b) => {
          let fa = a.name.common;
          let fb = b.name.common;

          if (fa < fb) {
            return 1;
          }
          if (fa > fb) {
            return -1;
          }
          return 0;
        });
      }
      break;

    case 3:
      if (direction === "asc") {
        array.sort((a, b) => {
          let fa = a.cca3;
          let fb = b.cca3;

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
      } else {
        array.sort((a, b) => {
          let fa = a.cca3;
          let fb = b.cca3;

          if (fa < fb) {
            return 1;
          }
          if (fa > fb) {
            return -1;
          }
          return 0;
        });
      }
      break;

    case 4:
      if (direction === "asc") {
        array.sort((a, b) => {
          return a.population - b.population;
        });
      } else {
        array.sort((a, b) => {
          return b.population - a.population;
        });
      }
      break;
    case 5:
      if (direction === "asc") {
        array.sort((a, b) => {
          let fa = a.capital;
          let fb = b.capital;

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
      } else {
        array.sort((a, b) => {
          let fa = a.capital;
          let fb = b.capital;

          if (fa < fb) {
            return 1;
          }
          if (fa > fb) {
            return -1;
          }
          return 0;
        });
      }
      break;

    default:
      break;
  }

  jsonn = JSON.stringify(array);
  myDisplayer(jsonn, perPage, where);
}

///////////////////

//filtering

function filtering() {
  let input, filter, table, tr, td, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toLowerCase();
  table = document.getElementById("myTab");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows and coloumns to filter data
  for (let i = 0; i < tr.length; i++) {
    td1 = tr[i].getElementsByTagName("td")[1];
    td2 = tr[i].getElementsByTagName("td")[2];
    td3 = tr[i].getElementsByTagName("td")[3];
    td4 = tr[i].getElementsByTagName("td")[4];

    if (td1 || td2 || td3 || td4) {
      txtValue1 = td1.innerText;
      txtValue2 = td2.innerText;
      txtValue3 = td3.innerText;
      txtValue4 = td4.innerText;
      if (
        txtValue1.toLowerCase().indexOf(filter) > -1 ||
        txtValue2.toLowerCase().indexOf(filter) > -1 ||
        txtValue3.toLowerCase().indexOf(filter) > -1 ||
        txtValue4.toLowerCase().indexOf(filter) > -1
      ) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

//borders
function showBorders(states) {
  if (states.borders === undefined) {
    alert("NO borders found");
  } else {
    alert("Borders are : " + states.borders);
  }
}
