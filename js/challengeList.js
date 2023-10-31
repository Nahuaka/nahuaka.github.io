const delay = ms => new Promise(res => setTimeout(res, ms));
let categoryOpen = false;
const stateManga = ["Reading", "Plan to read", "Completed", "Rereading", "Paused", "Dropped"];
const stateAnime = ["Completed", "Watching", "Rewatching", "Planned", "Dropped", "Paused"]

document.querySelector('.select-field').addEventListener('click', () => {
    document.querySelector('#list').classList.toggle('show');
    document.querySelector('.down-arrow').classList.toggle('rotate180');
    categoryOpen = !categoryOpen;
});

let listCategory = ["Timed Limit", "Tier", "Special", "Studio", "Franchise", "Legend", "Anthologies",
    "Classic", "Puzzle", "Genre", "Manga City", "Completed", "Already Check"];

function searchInTag(listName, selectorName) {
    let selector = document.getElementById(selectorName);
    let listChildren = document.getElementById(listName).children;
    for (let i = 0; i < listChildren.length; i++) {
        listChildren.item(i).style.display = "block";
    }
    if (listName === "list")
        categoryOpen = true;
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

window.addEventListener('click', function(e){
    if (categoryOpen && !document.getElementById('list').contains(e.target) && !document.getElementById('category-selector-toggle').contains(e.target)) {
        document.querySelector('#list').classList.toggle('show');
        document.querySelector('.down-arrow').classList.toggle('rotate180');
        categoryOpen = false;
    }
});

addSelector("list", "category-tag", listCategory, "category-selector");
document.getElementById("category-selector").addEventListener('input', searchInTag.bind(null, "list", "category-selector"));


let all_challenge_id = []
let data_challenge = {}
let all_challenge_manga_id = []

const associate = new Map([["timed-limit", "Timed Limit"], ["tier", "Tier"], ["special", "Special"],
    ["studio", "Studio"], ["franchise", "Franchise"], ["legend", "Legend"], ["anthologies", "Anthologies"],
    ["classic", "Classic"], ["puzzle", "Puzzle"], ["genre", "Genre"], ["manga-city", "Manga City"], ["completed", "Completed"], ["checking", "Already Check"]]);

function which_category(id, url)
{
    let archiveChallenge = JSON.parse(localStorage["archive"]);
    let checkChallenge = JSON.parse(localStorage["checking"]);
    if (archiveChallenge.includes(url))
        return "completed";
    if (checkChallenge.includes(url))
        return "checking";
    if (data_challenge.hasOwnProperty(id))
        return data_challenge[id].category;
    return "unknow";
}

let all_elements = new Map([]);
let all_challenge = new Map([]);

async function display_to_it(url, id, exist, selectedCategory)
{
    let category = which_category(id, url);
    if (selectedCategory.length > 0 && selectedCategory.includes(associate.get(category))) {
        let elementExists = null;
        let allChallenge = null;
        if (all_elements.has(category) === false) {
            elementExists = document.createElement("div");
            elementExists.className = "col challenge-list";
            elementExists.id = category;
            let title = document.createElement("h2");
            title.className = "challenge-category";
            title.innerHTML = associate.get(category);
            elementExists.appendChild(title);
            let separation = document.createElement("hr");
            separation.className = "separation";
            elementExists.appendChild(separation);
            allChallenge = document.createElement("div");
            allChallenge.className = "horizontal-scroll-wrapper";
            allChallenge.id = category + "-challenge";
            elementExists.appendChild(allChallenge);
        } else {
            elementExists = all_elements.get(category);
            allChallenge = all_challenge.get(category + "-challenge");
        }
        let challenge = document.createElement("div");
        let challenge_url = document.createElement("a");
        let challenge_picture = document.createElement("img");
        if (exist === true) {
            challenge_picture.className = "challenge-picture";
            challenge.className = "challenge-preview";
        } else {
            challenge_picture.className = "challenge-picture-not";
            challenge.className = "challenge-preview not";
        }
        challenge.id = id.toString();
        challenge_picture.src = data_challenge[id].thumbnail;
        challenge_url.href = url;
        challenge_url.appendChild(challenge_picture);
        challenge.appendChild(challenge_url);
        allChallenge.appendChild(challenge);
        all_elements.set(category, elementExists);
        all_challenge.set(category + "-challenge", allChallenge);
    }
}

let possessed_challenge = [];

// duplicate

function recoverSelectedElementWithDefault(listName, replaceStr) {
    let list = [];
    let listChildren = document.getElementById(listName).children;
    for (let i = 0; i < listChildren.length; i++) {
        if (listChildren.item(i).className === "task selected-genre")
            list.push(listChildren.item(i).id.replace(replaceStr, ''));
    }
    if (list.length === 0) {
        for (let i = 0; i < listChildren.length; i++) {
            if (listChildren.item(i).hidden === false) {
                list.push(listChildren.item(i).id.replace(replaceStr, ''));
            }
        }
    }
    return list;
}

async function get_all_user_comment_thread(userId, page) {
    let query = "query ($page: Int, $userId: Int) {\n" +
        "  Page(page: $page) {\n" +
        "    pageInfo {\n" +
        "      hasNextPage\n" +
        "    }\n" +
        "    threadComments(userId: $userId) {\n" +
        "      siteUrl\n" +
        "      id\n" +
        "      threadId\n" +
        "    }\n" +
        "  }\n" +
        "}\n";
    let my_variables = {page, userId};
    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: my_variables
            })
        };
    await fetch(url, options).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Something went wrong');
        })
        .then(async data => {
            const checker = document.getElementById("checked-slider");
            let selectedCategory = recoverSelectedElementWithDefault('list', 'category-selector-check-');
            for (let i = 0; i < data.data.Page.threadComments.length; i++) {
                if (!checker.checked && all_challenge_id.includes(data.data.Page.threadComments[i].threadId) === true && possessed_challenge.includes(data.data.Page.threadComments[i].threadId) === false) {
                    await display_to_it(data.data.Page.threadComments[i].siteUrl, data.data.Page.threadComments[i].threadId, true, selectedCategory)
                    possessed_challenge.push(data.data.Page.threadComments[i].threadId);
                } else if (checker.checked && all_challenge_manga_id.includes(data.data.Page.threadComments[i].threadId) === true && possessed_challenge.includes(data.data.Page.threadComments[i].threadId) === false) {
                    await display_to_it(data.data.Page.threadComments[i].siteUrl, data.data.Page.threadComments[i].threadId, true, selectedCategory)
                    possessed_challenge.push(data.data.Page.threadComments[i].threadId);
                }
            }
            if (data.data.Page.pageInfo.hasNextPage === true) {
                await get_all_user_comment_thread(userId, page + 1);
            }
        });
}

function swap(arr, xp, yp)
{
    var temp = arr[xp];
    arr[xp] = arr[yp];
    arr[yp] = temp;
}

function compareNames(el1, el2) {
    const el1Name = data_challenge[el1.id].name;
    const el2Name = data_challenge[el2.id].name;
    let compValue = 0;
    let i = 0;

    if (el1.className.includes("not"))
        compValue += 1000;
    if (el2.className.includes("not"))
        compValue -= 1000;
    while (el1Name[i] === el2Name[i] && i < el1Name.length && i < el2Name.length)
        i++;
    return (el1Name.charCodeAt(i) - el2Name.charCodeAt(i)) + compValue;
}

function sort_category(category)
{
    if (all_elements.has(category) && all_challenge.has(category + "-challenge")) {
        let allChallenge = all_elements.get(category);
        let allPreview = all_challenge.get(category + "-challenge").children;
        let previewGroup = all_challenge.get(category + "-challenge");
        let row = document.getElementById("preview-challenge-all");

        let tmp = []
        for (let i = 0; i < allPreview.length; i++)
            tmp.push(allPreview[i]);
        for (let i = 0; i < tmp.length - 1; i++) {
            for (let j = 0; j < tmp.length - i - 1; j++) {
                if (compareNames(tmp[j], tmp[j + 1]) > 0) {
                    swap(tmp, j, j + 1);
                }
            }

        }
        for (let i = 0; i < allPreview.length; i++)
            previewGroup.removeChild(allPreview[i]);
        for (let i = 0; i < tmp.length; i++)
            previewGroup.appendChild(tmp[i]);
        row.appendChild(allChallenge);
    }
}


async function get_user_information() {
    let nameUser = document.getElementById("user-name").value;
    let row = document.getElementById("preview-challenge-all");

    let awaitDoc = document.createElement("img");
    awaitDoc.src = "img/loading.gif";
    awaitDoc.className = "await-center";
    row.appendChild(awaitDoc);
    let rowChild = document.getElementById("preview-challenge-all").children;

    if (nameUser.trim().length === 0)
        return;
    let query = "query ($nameUser: String) {\n" +
        "  User(name: $nameUser) {\n" +
        "    id\n" +
        "  }\n" +
        "}\n";
    let my_variables = {nameUser};
    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: my_variables
            })
        };
    all_elements = new Map([]);
    all_challenge = new Map([]);
    while (rowChild.length > 0)
        row.removeChild(rowChild[0]);
    await fetch(url, options).then(response => response.json())
        .then(async data => {
            await get_all_user_comment_thread(data.data.User.id, 1);
        });
    const checker = document.getElementById("checked-slider");
    let ids = [];
    if (checker.checked) {
        ids = all_challenge_manga_id;
    } else
        ids = all_challenge_id;
    let selectedCategory = recoverSelectedElementWithDefault('list', 'category-selector-check-');
    for (let i = 0; i < ids.length; i++) {
        if (possessed_challenge.includes(ids[i]) === false) {
            await display_to_it("https://anilist.co/forum/thread/" + ids[i].toString() , ids[i], false, selectedCategory);
        }
    }
    if (associate.has("completed"))
        sort_category("completed");
    if (associate.has("checking")) {
        sort_category("checking");
    }
    associate.forEach((value, key) => {
        if (key !== "completed" && key !== "checking")
            sort_category(key);
    });
    possessed_challenge = []
}

if (typeof localStorage["archive"] === 'undefined')
    localStorage["archive"] = JSON.stringify([]);

if (typeof localStorage["checking"] === 'undefined')
    localStorage["checking"] = JSON.stringify([]);

if (typeof localStorage["archive-manga"] === 'undefined')
    localStorage["archive-manga"] = JSON.stringify([]);

if (typeof localStorage["checking-manga"] === 'undefined')
    localStorage["checking-manga"] = JSON.stringify([]);

document.getElementById("button-search-challenge").addEventListener("click", get_user_information);

document.getElementById("button-archive-challenge").addEventListener("click", (e) => {
    const checker = document.getElementById("checked-slider");
    if (checker.checked)
        archiveChallenge = JSON.parse(localStorage["archive-manga"])
    else
        archiveChallenge = JSON.parse(localStorage["archive"]);
    let challengeUrl = document.getElementById("archive-link").value;
    if (challengeUrl === null || challengeUrl.trim().length <= 0)
        return;
    archiveChallenge.push(challengeUrl);
    if (checker.checked)
        localStorage["archive-manga"] = JSON.stringify(archiveChallenge);
    else
        localStorage["archive"] = JSON.stringify(archiveChallenge);
    get_user_information();
});

document.getElementById("button-archive-challenge-reset").addEventListener("click", (e) => {
    const checker = document.getElementById("checked-slider");
    if (checker.checked)
        localStorage["archive-manga"] = JSON.stringify(archiveChallenge);
    else
        localStorage["archive"] = JSON.stringify(archiveChallenge);
    get_user_information();
});

document.getElementById("button-archive-challenge-remove").addEventListener("click", (e) => {
    const checker = document.getElementById("checked-slider");
    if (checker.checked)
        archiveChallenge = JSON.parse(localStorage["archive-manga"])
    else
        archiveChallenge = JSON.parse(localStorage["archive"]);
    let challengeUrl = document.getElementById("archive-link").value;
    if (challengeUrl === null || challengeUrl.trim().length <= 0)
        return;
    const index = archiveChallenge.indexOf(challengeUrl);
    if (index > -1) {
        archiveChallenge.splice(index, 1);
        if (checker.checked)
            localStorage["archive-manga"] = JSON.stringify(archiveChallenge);
        else
            localStorage["archive"] = JSON.stringify(archiveChallenge);
    }
    get_user_information();
});

document.getElementById("button-checking-challenge").addEventListener("click", (e) => {
    const checker = document.getElementById("checked-slider");
    if (checker.checked)
        archiveChallenge = JSON.parse(localStorage["checking-manga"])
    else
        archiveChallenge = JSON.parse(localStorage["checking"]);
    let challengeUrl = document.getElementById("checking-link").value;
    if (challengeUrl === null || challengeUrl.trim().length <= 0)
        return;
    archiveChallenge.push(challengeUrl);
    if (checker.checked)
        localStorage["checking-manga"] = JSON.stringify(archiveChallenge);
    else
        localStorage["checking"] = JSON.stringify(archiveChallenge);
    get_user_information();
});

document.getElementById("button-checking-challenge-reset").addEventListener("click", (e) => {
    const checker = document.getElementById("checked-slider");
    if (checker.checked)
        localStorage["checking-manga"] = JSON.stringify([]);
    else
        localStorage["checking"] = JSON.stringify([]);
    get_user_information();
});

document.getElementById("button-checking-challenge-unreset").addEventListener("click", (e) => {
    let archiveChallenge;
    const checker = document.getElementById("checked-slider");
    if (checker.checked)
        archiveChallenge = JSON.parse(localStorage["checking-manga"])
    else
        archiveChallenge = JSON.parse(localStorage["checking"]);
    let challengeUrl = document.getElementById("checking-link").value;
    if (challengeUrl === null || challengeUrl.trim().length <= 0)
        return;
    const index = archiveChallenge.indexOf(challengeUrl);
    if (index > -1) {
        archiveChallenge.splice(index, 1);
        if (checker.checked)
            localStorage["checking-manga"] = JSON.stringify(archiveChallenge);
        else
            localStorage["checking"] = JSON.stringify(archiveChallenge);
    }
    get_user_information();
});


$.get('/datas/challenge.csv', function(data) {
    const lines = data.split("\n");

    for (let i = 0; i < lines.length; i++) {
        let tmp = lines[i].split(";");
        let info = {};
        info["thumbnail"] = tmp[1];
        info["name"] = tmp[2];
        info["category"] = tmp[3];
        info["type"] = tmp[4].trim().replace('\r', '');
        if (info["type"] === "ANIME") {
            data_challenge[parseInt(tmp[0])] = info;
            all_challenge_id.push(parseInt(tmp[0]));
        } else {
            data_challenge[parseInt(tmp[0])] = info;
            all_challenge_manga_id.push(parseInt(tmp[0]));
        }
    }
});




