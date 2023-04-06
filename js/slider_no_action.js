function changeCategory()
{
    const label = document.getElementById("anime-manga-label");
    const checker = document.getElementById("checked-slider");

    localStorage["manga"] = !checker.checked;

    if (label.innerHTML === "Manga")
        label.innerHTML = "Anime";
    else
        label.innerHTML = "Manga";
    checker.checked = !checker.checked;
    get_user_information();
}

document.getElementById("switch-type").addEventListener("click", (e) => {
    changeCategory();
    e.preventDefault();
});

if (localStorage["manga"] === "true") {
    changeCategory();
}
