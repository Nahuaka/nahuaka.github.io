const formatAnime = ["Movie", "Music", "Special", "ONA", "OVA", "TV Short", "TV"];
const formatManga = ["Manga", "Light Novel", "One Shot"];
const stateManga = ["Reading", "Plan to read", "Completed", "Rereading", "Paused", "Dropped"];
const stateAnime = ["Completed", "Watching", "Rewatching", "Planned", "Dropped", "Paused"]

function listChange(list, listName) {
    const listFormat = document.getElementById(listName);
    const listFormatChildren = listFormat.children;
    for (let i = 0; i < listFormatChildren.length; i++) {
        const ids = listFormatChildren[i].id.split("-");
        const type = ids[ids.length - 1];
        listFormatChildren[i].hidden = !list.includes(type);
    }
}

function changeDisplay() {
    const seasonDiv = document.getElementById("season-div");
    
    seasonDiv.hidden = !seasonDiv.hidden;
}

function switchType()
{
    const label = document.getElementById("anime-manga-label");
    const checker = document.getElementById("checked-slider");
    const tagList = document.getElementById("tag-list-all");

    deleteChildren('preview-search');
    if (checker.checked === true) {
        label.innerHTML = "Anime";
        listChange(formatAnime, "listFormat");
        listChange(stateAnime, "listState");
        changeDisplay();
    } else {
        listChange(formatManga, "listFormat");
        listChange(stateManga, "listState");
        label.innerHTML = "Manga";
        changeDisplay();
    }
    checker.checked = !checker.checked;
    localStorage["manga"] = checker.checked;
    while (tagList.children.length >= 2) {
        const ids = tagList.children[1].id.split("-");
        const type = ids[ids.length - 1];
        uncheck_tag(tagList.children[1].id, type, ids[0] + "-" + ids[1]);
    }
}

document.getElementById("switch-type").addEventListener("click", (e) => {
    switchType();
    e.preventDefault();
});

window.onload = () => {
    if (localStorage["manga"] === "true") {
        switchType();
    } else {
        listChange(formatAnime, "listFormat");
        listChange(stateAnime, "listState");
    }
}