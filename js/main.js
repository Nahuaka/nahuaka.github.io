let stateOpen = false;
let genreOpen = false;
let formatOpen = false;
let yearOpen = false;
let seasonOpen = false;

  document.querySelector('.select-field').addEventListener('click', () => {
    document.querySelector('#list').classList.toggle('show');
    document.querySelector('.down-arrow').classList.toggle('rotate180');
    genreOpen = !genreOpen;
  });

  document.querySelector('.select-field-format').addEventListener('click', () => {
    document.querySelector('#listFormat').classList.toggle('show');
    document.querySelector('.down-arrow-format').classList.toggle('rotate180');
    formatOpen = !formatOpen;
  });

  document.querySelector('.select-field-year').addEventListener('click', () => {
    document.querySelector('#listYear').classList.toggle('show');
    document.querySelector('.down-arrow-year').classList.toggle('rotate180');
    yearOpen = !yearOpen;
  });

  document.querySelector('.select-field-season').addEventListener('click', () => {
    document.querySelector('#listSeason').classList.toggle('show');
    document.querySelector('.down-arrow-season').classList.toggle('rotate180');
    seasonOpen = !seasonOpen;
  });

document.querySelector('.select-field-state').addEventListener('click',()=>{
  document.querySelector('#listState').classList.toggle('show');
  stateOpen = !stateOpen;
  document.querySelector('.down-arrow-state').classList.toggle('rotate180');
});


  let listGenre = ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mahou Shoujo",
    "Mecha", "Mystery", "Music", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];
  let listFormat = ["Movie", "Music", "Special", "ONA", "OVA", "TV Short", "TV", "Manga", "Light Novel", "One Shot"];


  let listYears = []

  for (let i = 2023; i >= 1920; i--) {
    listYears.push(i.toString());
  }

function searchInTag(listName, selectorName, arrowName) {
  let selector = document.getElementById(selectorName);
  let listChildren = document.getElementById(listName).children;
  for (let i = 0; i < listChildren.length; i++) {
    listChildren.item(i).style.display = "block";
  }
  if (listName === "list")
    genreOpen = true;
  else if (listName === "listFormat")
    formatOpen = true;
  else if (listName === "listYear")
    yearOpen = true;
  else if (listName === "listSeason")
    seasonOpen = true;
  else if (listName === "listState")
    stateOpen = true;
  if (selector.value != null || selector.value.trim().length !== 0) {
    for (let i = 0; i < listChildren.length; i++) {
      let child = listChildren.item(i);
      let value = child.innerHTML;
      if (!value.toLowerCase().startsWith(selector.value.toLowerCase())) {
        listChildren.item(i).style.display = "none";
      }
    }
  }
}

  let listSeason = ["WINTER", "SPRING", "SUMMER", "FALL"];

  let listState = ["Completed", "Watching", "Rewatching", "Planned", "Dropped", "Paused", "Reading", "Plan to read", "Rereading"];

  addSelector("list", "genre-tag", listGenre, "genre-selector");
  addSelector("listFormat", "format-tag", listFormat, "format-selector");
  addSelector("listYear", "year-tag", listYears, "year-selector");
  addSelector("listSeason", "season-tag", listSeason, "season-selector");
  addSelector("listState", "state-tag", listState, "state-selector");

  document.getElementById("genre-selector").addEventListener('input', searchInTag.bind(null, "list", "genre-selector", 'down-arrow'));
  document.getElementById("format-selector").addEventListener('input', searchInTag.bind(null, "listFormat", "format-selector", 'down-arrow-format'));

  document.getElementById("year-selector").addEventListener('input', searchInTag.bind(null, "listYear", "year-selector", 'down-arrow-year'));
  document.getElementById("season-selector").addEventListener('input', searchInTag.bind(null, "listSeason", "season-selector", 'down-arrow-season'));
  document.getElementById("state-selector").addEventListener('input', searchInTag.bind(null, "listState", "state-selector", 'down-arrow-state'));


window.addEventListener('click', function(e){

  if (stateOpen && !document.getElementById('listState').contains(e.target) && !document.getElementById('state-selector-toggle').contains(e.target)) {
    document.querySelector('#listState').classList.toggle('show');
    document.querySelector('.down-arrow-state').classList.toggle('rotate180');
    stateOpen = false;
  }
  if (genreOpen && !document.getElementById('list').contains(e.target) && !document.getElementById('genre-selector-toggle').contains(e.target)) {
    document.querySelector('#list').classList.toggle('show');
    document.querySelector('.down-arrow').classList.toggle('rotate180');
    genreOpen = false;
  }
  if (formatOpen && !document.getElementById('listFormat').contains(e.target) && !document.getElementById('format-selector-toggle').contains(e.target)) {
    document.querySelector('#listFormat').classList.toggle('show');
    document.querySelector('.down-arrow-format').classList.toggle('rotate180');
    formatOpen = false;
  }
  if (yearOpen && !document.getElementById('listYear').contains(e.target) && !document.getElementById('year-selector-toggle').contains(e.target)) {
    document.querySelector('#listYear').classList.toggle('show');
    document.querySelector('.down-arrow-year').classList.toggle('rotate180');
    yearOpen = false;
  }
  if (seasonOpen && !document.getElementById('listSeason').contains(e.target) && !document.getElementById('season-selector-toggle').contains(e.target)) {
    document.querySelector('#listSeason').classList.toggle('show');
    document.querySelector('.down-arrow-season').classList.toggle('rotate180');
    seasonOpen = false;
  }
});