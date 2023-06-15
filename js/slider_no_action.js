const listManga = ["Tier", "Special", "Manga City", "Completed", "Already Check"];
const listAnime = ["Timed Limit", "Tier", "Special", "Studio", "Franchise", "Legend", "Anthologies",
    "Classic", "Puzzle", "Genre", "Completed", "Already Check"];

// duplicate
function deleteChildren(elementName)
{
    let genreTable = document.getElementById(elementName);
    let child = genreTable.lastElementChild;
    while (child) {
        genreTable.removeChild(child);
        child = genreTable.lastElementChild;
    }
}

// duplicate
function listContentChange(list, listName) {
    const listFormat = document.getElementById(listName);
    const listFormatChildren = listFormat.children;
    for (let i = 0; i < listFormatChildren.length; i++) {
        const ids = listFormatChildren[i].id.split("-");
        const type = ids[ids.length - 1];
        listFormatChildren[i].hidden = !list.includes(type);
    }
}
function changeCategory()
{
    const label = document.getElementById("anime-manga-label");
    const checker = document.getElementById("checked-slider");
    const tagList = document.getElementById("tag-list-all");

    deleteChildren('preview-challenge-all');
    localStorage["manga"] = !checker.checked;

    if (label.innerHTML === "Manga") {
        label.innerHTML = "Anime";
        listContentChange(listAnime, "list");
    } else {
        label.innerHTML = "Manga";
        listContentChange(listManga, "list");
    }
    checker.checked = !checker.checked;
    while (tagList.children.length >= 2) {
        const ids = tagList.children[1].id.split("-");
        const type = ids[ids.length - 1];
        uncheck_tag(tagList.children[1].id, type, ids[0] + "-" + ids[1]);
    }
    get_user_information();
}

document.getElementById("switch-type").addEventListener("click", (e) => {
    changeCategory();
    e.preventDefault();
});

window.onload = () => {
    if (localStorage["manga"] === "true") {
        changeCategory();
    } else {
        listContentChange(listAnime, "list");
    }
}