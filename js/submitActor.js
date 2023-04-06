/* Submit search */

const element_change = new Map([["Completed", "COMPLETED"], ["Watching", "CURRENT"],
    ["Rewatching", "REPEATING"], ["Planned", "PLANNING"], ["Dropped", "DROPPED"], ["Paused", "PAUSED"],
    ["Reading", "CURRENT"], ["Plan to read", "PLANNING"], ["Rereading", "REPEATING"]]);

function recoverSelectedElementChange(listName, replaceStr) {
    let list = [];
    let listChildren = document.getElementById(listName).children;
    for (let i = 0; i < listChildren.length; i++) {
        if (listChildren.item(i).className === "task selected-genre")
            list.push(element_change.get(listChildren.item(i).id.replace(replaceStr, '')));
    }
    return list;
}

function remove_unwanted_state(data, state_list) {
    let tmp_list = []
    for (let i = 0; i < data.length; i++) {
        if (state_list.includes(data.at(i).status)) {
            tmp_list.push(data.at(i));
        }
    }
    return tmp_list;
}

function clean_array(func, list, filter)
{
    let new_list = []
    if (filter.length > 0) {
        for (let i = 0; i < list.length; i++) {
            let tmp = func(list.at(i).entries, filter);
            if (tmp.length > 0) {
                list.at(i).entries = tmp;
                new_list.push(list.at(i));
            }
        }
    } else
        new_list = list;
    return new_list;
}

function parse_data(data) {
    let state_list = recoverSelectedElementChange('listState', 'state-selector-check-');

    let tmp = [];
    for (let i = 0; i < data.data.MediaListCollection.lists.length; i++) {
        if (data.data.MediaListCollection.lists[i].status !== null)
            tmp.push(data.data.MediaListCollection.lists[i]);
    }
    return clean_array(remove_unwanted_state, tmp, state_list);
}

function check_these(listVoiceActor, listAnime, tmp, anime)
{
    for (let i = 0; i < listVoiceActor.length; i++) {
        for (let j = 0; j < listAnime.length; j++) {
            if (listVoiceActor[i].id === listAnime[j].id) {
                tmp.push(anime);
                return tmp;
            }
        }
    }
    return tmp;
}

function get_actor_voice(id, datas) {
    console.log(id);
    let query = "query ($id: Int) {\n" +
        "  Staff(id: $id) {\n" +
        "    first: characters(page: 1) {\n" +
        "      nodes {\n" +
        "        id\n" +
        "      }\n" +
        "    }\n" +
        "    second: characters(page: 2) {\n" +
        "      nodes {\n" +
        "        id\n" +
        "      }\n" +
        "    }\n" +
        "    third: characters(page: 3) {\n" +
        "      nodes {\n" +
        "        id\n" +
        "      }\n" +
        "    }\n" +
        "    fourth: characters(page: 4) {\n" +
        "      nodes {\n" +
        "        id\n" +
        "      }\n" +
        "    }\n" +
        "    fifth: characters(page: 5) {\n" +
        "      nodes {\n" +
        "        id\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}";
    let my_variables = {id};
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
    fetch(url, options).then(response => response.json())
        .then(data => {
            console.log(data);
            let tmp = [];
            for (let i = 0; i < datas.length; i++) {
                let listTmp = []
                for (let j = 0; j < datas[i].entries.length; j++) {
                    let voiceActorList = [data.data.Staff.first.nodes, data.data.Staff.second.nodes, data.data.Staff.third.nodes, data.data.Staff.fourth.nodes, data.data.Staff.fifth.nodes]
                    let animeCharacter = [datas[i].entries[j].media.first.nodes, datas[i].entries[j].media.second.nodes, datas[i].entries[j].media.third.nodes, datas[i].entries[j].media.fourth.nodes, datas[i].entries[j].media.fifth.nodes]
                    for (let m = 0; m < voiceActorList.length; m++) {
                        for (let n = 0; n < animeCharacter.length; n++) {
                            listTmp = check_these(voiceActorList[m], animeCharacter[n], listTmp, datas[i].entries[j]);
                        }
                    }
                }
                if (listTmp.length > 0) {
                    console.log(listTmp);
                    datas.at(i).entries = listTmp;
                    tmp.push(datas[i]);
                }
            }
        display_data(tmp);
        });
}

function create_element_to_display(data) {
    let all_data = parse_data(data);
    let challenge = document.getElementById('challenge').value;
    if (challenge !== null && challenge !== "") {
        let tmp = challenge.split('/').filter(item => item).filter((v) => v !== ' ');
        get_actor_voice(parseInt(tmp[3]), all_data)
    }
}

function fetch_search(userName, startAtStr, endAtStr) {
    let startQuery = "query ($userName: String, $type: MediaType";
    let mediaStart = "  MediaListCollection(userName: $userName, type: $type";
    const checker = document.getElementById("checked-slider");
    let type = "ANIME"
    if (checker.checked)
        type = "MANGA";
    let my_variables = {userName, type};

    if (startAtStr !== "InvalidDate" && (endAtStr === "" || endAtStr === "InvalidDate") && startAtStr !== "") {
        startQuery += ", $startAt: FuzzyDateInt";
        mediaStart += ", startedAt_greater: $startAt";
        let startAt = parseInt(startAtStr);
        my_variables = {userName, type, startAt};
    }
    else if (endAtStr !== "InvalidDate" && (startAtStr === "" || startAtStr === "InvalidDate") && endAtStr !== "") {
        startQuery += ", $endAt: FuzzyDateInt";
        mediaStart += ", completedAt_greater: $endAt";
        let endAt = parseInt(endAtStr);
        my_variables = {userName, type, endAt};
    } else if (endAtStr !== "InvalidDate" && endAtStr !== "" && startAtStr !== "InvalidDate" && startAtStr !== "") {
        startQuery += ", $startAt: FuzzyDateInt";
        mediaStart += ", startedAt_greater: $startAt";
        startQuery += ", $endAt: FuzzyDateInt";
        mediaStart += ", completedAt_greater: $endAt";
        let startAt = parseInt(startAtStr);
        let endAt = parseInt(endAtStr);
        my_variables = {userName, type, startAt, endAt};
    }
    let query = startQuery + ") {\n" +
        mediaStart + ") {\n" +
        "    lists {\n" +
        "      name\n" +
        "      status\n" +
        "      isCustomList\n" +
        "      isCompletedList: isSplitCompletedList\n" +
        "      entries {\n" +
        "        ...mediaListEntry\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}\n" + "\n" +
        "fragment mediaListEntry on MediaList {\n" +
        "  status\n" +
        "  startedAt {\n" +
        "    year\n" +
        "    month\n" +
        "    day\n" +
        "  }\n" +
        "  completedAt {\n" +
        "    year\n" +
        "    month\n" +
        "    day\n" +
        "  }\n" +
        "  media {\n" +
        "    id\n" +
        "    siteUrl\n" +
        "    source\n" +
        "    countryOfOrigin\n" +
        "    studios {\n" +
        "      nodes {\n" +
        "        name\n" +
        "        id\n" +
        "      }\n" +
        "    }\n" +
        "    first: characters(page: 1) {\n" +
        "      nodes {\n" +
        "        id\n" +
        "      }\n" +
        "    }\n" +
        "    second: characters(page: 2) {\n" +
        "      nodes {\n" +
        "        id\n" +
        "      }\n" +
        "    }\n" +
        "    third: characters(page: 3) {\n" +
        "      nodes {\n" +
        "        id\n" +
        "      }\n" +
        "    }\n" +
        "    fourth: characters(page: 4) {\n" +
        "      nodes {\n" +
        "        id\n" +
        "      }\n" +
        "    }\n" +
        "    fifth: characters(page: 5) {\n" +
        "      nodes {\n" +
        "        id\n" +
        "      }\n" +
        "    }\n" +
        "    tags {\n" +
        "      name\n" +
        "    }\n" +
        "    season\n" +
        "    seasonYear\n" +
        "    title {\n" +
        "      userPreferred\n" +
        "      romaji\n" +
        "      english\n" +
        "      native\n" +
        "    }\n" +
        "    coverImage {\n" +
        "      extraLarge\n" +
        "      large\n" +
        "    }\n" +
        "    type\n" +
        "    format\n" +
        "    status(version: 2)\n" +
        "    description\n" +
        "    episodes\n" +
        "    chapters\n" +
        "    volumes\n" +
        "    duration\n" +
        "    averageScore\n" +
        "    popularity\n" +
        "    countryOfOrigin\n" +
        "    genres\n" +
        "    bannerImage\n" +
        "    startDate {\n" +
        "      year\n" +
        "      month\n" +
        "      day\n" +
        "    }\n" +
        "  }\n" +
        "}\n";
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

    fetch(url, options).then(response => response.json())
        .then(data => create_element_to_display(data));
}

document.getElementById("search-form").addEventListener('submit', function (e) {
    let username = document.getElementById("user-name").value;
    if (username.trim().length === 0)
        return;

    e.preventDefault();

    const dateStart = new Date(Date.parse(document.getElementById('started-date').value));
    dateStart.setDate(dateStart.getDate() - 1);
    let finishedDate = new Date(Date.parse(document.getElementById('finished-date').value));
    finishedDate.setDate(finishedDate.getDate() - 1);


    let allPreview = document.getElementById('preview-search');
    deleteChildren('preview-search');
    let awaitDoc = document.createElement("img");
    awaitDoc.src = "img/loading.gif";
    awaitDoc.className = "await-center";
    allPreview.appendChild(awaitDoc);
    fetch_search(username,
        dateStart.toLocaleDateString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'}).replaceAll('.', '').split(' ').join('').toString()
        , finishedDate.toLocaleDateString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'}).replaceAll('.', '').split(' ').join('').toString());
})

let stateOpen = false;

function searchInTag(listName, selectorName, arrowName) {
    let selector = document.getElementById(selectorName);
    let listChildren = document.getElementById(listName).children;
    for (let i = 0; i < listChildren.length; i++) {
        listChildren.item(i).style.display = "block";
    }
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

document.querySelector('.select-field-state').addEventListener('click',()=>{
    document.querySelector('#listState').classList.toggle('show');
    stateOpen = !stateOpen;
    document.querySelector('.down-arrow-state').classList.toggle('rotate180');
});

let listState = ["Completed", "Watching", "Rewatching", "Planned", "Dropped", "Paused", "Reading", "Plan to read", "Rereading"];

addSelector("listState", "state-tag", listState, "state-selector");

document.getElementById("state-selector").addEventListener('input', searchInTag.bind(null, "listState", "state-selector", 'down-arrow-state'));

window.addEventListener('click', function(e){

    if (stateOpen && !document.getElementById('listState').contains(e.target) && !document.getElementById('state-selector-toggle').contains(e.target)) {
        document.querySelector('#listState').classList.toggle('show');
        document.querySelector('.down-arrow-state').classList.toggle('rotate180');
        stateOpen = false;
    }
});

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

function switchType()
{
    const label = document.getElementById("anime-manga-label");
    const checker = document.getElementById("checked-slider");
    const tagList = document.getElementById("tag-list-all");

    deleteChildren('preview-search');
    if (checker.checked === true) {
        label.innerHTML = "Anime";
        listChange(stateAnime, "listState");
    } else {
        listChange(stateManga, "listState");
        label.innerHTML = "Manga";
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
        listChange(stateAnime, "listState");
    }
}