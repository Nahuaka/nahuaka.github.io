let genreOpen = false;
let formatOpen = false;

let listGenre = ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mahou Shoujo",
    "Mecha", "Mystery", "Music", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];
let listFormat = ["Movie", "Music", "Special", "ONA", "OVA", "TV Short", "TV Show"];

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

addSelector("list", "genre-tag", listGenre, "genre-selector");
addSelector("listFormat", "format-tag", listFormat, "format-selector");

document.getElementById("genre-selector").addEventListener('input', searchIn.bind(null, "list", "genre-selector", 'down-arrow'));
document.getElementById("format-selector").addEventListener('input', searchIn.bind(null, "listFormat", "format-selector", 'down-arrow-format'));

window.addEventListener('click', function(e) {
    if (genreOpen && !document.getElementById('list').contains(e.target) && !document.getElementById('genre-selector-toggle').contains(e.target)) {
        document.querySelector('#list').classList.toggle('show');
        document.querySelector('.down-arrow').classList.toggle('rotate180');
        genreOpen = false;
    }
    if (formatOpen && !document.getElementById('listFormat').contains(e.target) && !document.getElementById('format-selector-toggle').contains(e.target)) {
        document.querySelector('#listFormat').classList.toggle('show');
        document.querySelector('.down-arrow-format').classList.toggle('rotate180');
        genreOpen = false;
    }
});

document.getElementById("random-form").addEventListener('submit', function (e) {
    let username = document.getElementById("username").value;
    if (username.trim().length === 0)
        return;
    let nbMax = document.getElementById('nb-max-episodes').value;
    let genreList = recoverSelectedElement('list-2', 'genre-selector-2-check-');
    let formatList = recoverSelectedElement('listFormat-2', 'format-selector-2-check-');

    e.preventDefault();

    let url = "http://localhost:8080/random?username=" + username + "&nbMax=" + nbMax.toString() + addListToUrl(genreList, "genre") +
        addListToUrl(formatList, "format");
    fetch(url).then(response => response.json())
        .then(data => {
            document.getElementById("random-solo-display").style.display = "block";
            document.getElementById("solo-cover").src = data.cover;
            document.getElementById('solo-anime-title').innerHTML = data.name;
            document.getElementById('solo-desc').innerHTML = data.description;
            document.getElementById('solo-origin').innerHTML = data.info.origin;
            document.getElementById('solo-year').innerHTML = data.info.year;
            document.getElementById('solo-names').innerHTML = data.info.other_name;
            document.getElementById('solo-episode').innerHTML = data.episode.number;
            document.getElementById('solo-duration').innerHTML = data.episode.duration;
            document.getElementById('solo-state').innerHTML = data.detail.state;
            let genreTable = document.getElementById('solo-genre');
            deleteChildren('solo-genre');
            let cellTitle = document.createElement('td');
            cellTitle.className = "info-cell legend-cell";
            cellTitle.innerHTML = "Genre";
            genreTable.appendChild(cellTitle);
            for (let i = 0; i < data.detail.genre.length; i++) {
                let cellGenre = document.createElement('td');
                cellGenre.className = "tag-card-table";
                cellGenre.innerHTML = data.detail.genre[i];
                genreTable.appendChild(cellGenre);
            }
        });
});