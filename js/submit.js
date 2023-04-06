function recoverSelectedElement(listName, replaceStr) {
    let list = [];
    let listChildren = document.getElementById(listName).children;
    for (let i = 0; i < listChildren.length; i++) {
        if (listChildren.item(i).className === "task selected-genre")
            list.push(listChildren.item(i).id.replace(replaceStr, ''));
    }
    return list;
}

function addListToUrl(list, name) {
    let str = "";
    for (let i = 0; i < list.length; i++) {
        str += "&" + name + "=" + list.at(i);
    }
    if (str.trim().length === 0)
        return "&" + name + "=";
    return str;
}

/* Submit search */

function recoverSelectedElementTag(listName, replaceStr) {
    let list = [];
    let listChildren = document.getElementById(listName).children;
    for (let j = 0; j < listChildren.length; j++) {
        for (let i = 0; i < listChildren[j].children.length; i++) {
            if (listChildren[j].children[i].className === "task-grp selected-genre")
                list.push(listChildren[j].children[i].id.replace(replaceStr, ''));
        }
    }
    return list;
}
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

function remove_unwanted_genre(anime_list, list_genre)
{
    let tmp_list = []
    for (let i = 0; i < anime_list.length; i++) {
        let isInside = true;
        for (let j = 0; j < list_genre.length; j++) {
            if (anime_list.at(i).media.genres.includes(list_genre.at(j)) === false) {
                isInside = false;
                break;
            }
        }
        if (isInside)
            tmp_list.push(anime_list.at(i));
    }
    return tmp_list;
}

function remove_unwanted_format(anime_list, format)
{
    let tmp_list = []

    for (let i = 0; i < anime_list.length; i++) {
        let isInside = true;
        for (let j = 0; j < format.length; j++) {
            if (format.at(j).toUpperCase() !== anime_list.at(i).media.format) {
                isInside = false;
                break;
            }
        }
        if (isInside)
            tmp_list.push(anime_list.at(i));
    }
    return tmp_list;
}

function remove_unwanted_year(anime_list, year)
{
    let tmp_list = []
    for (let i = 0; i < anime_list.length; i++) {
        if (anime_list[i].media.seasonYear !== null && year.includes(anime_list[i].media.seasonYear.toString())) {
            tmp_list.push(anime_list.at(i));
        }
    }
    return tmp_list;
}

function remove_unwanted_season(anime_list, season)
{
    let tmp_list = []
    for (let i = 0; i < anime_list.length; i++) {
        if (anime_list[i].media.season !== null && season.includes(anime_list[i].media.season)) {
            tmp_list.push(anime_list.at(i));
        }
    }
    return tmp_list;
}

let listTagEquivalent = ["Ensemble-Cast", "Female-Protagonist", "Male-Protagonist", "Primarily-Adult-Cast", "Primarily-Child-Cast",
    "Primarily-Female-Cast", "Primarily-Male-Cast", "Primarily-Teen-Cast", "Age-Regression", "Artificial-Intelligence", "Dissociative-Identities",
    "Monster-Boy", "Monster-Girl", "Office-Lady", "Shrine-Maiden", "Tanned-Skin", "Language-Barrier", "School-Club", "Achronological-Order",
    "Time-Skip", "Alternate-Universe", "Augmented-Reality", "Urban-Fantasy", "Virtual-World", "Full-CGI", "Full-Color", "No-Dialogue",
    "Stop-Motion", "Battle-Royale", "Martial-Arts", "Classic-Literature", "Surreal-Comedy", "Coming-of-Age", "Body-Swapping", "Fairy-Tale",
    "Super-Power", "Video-Games", "Card-Battle", "American-Football", "Ice-Skating", "Scuba-Diving", "Table-Tennis",
    "Cosmic-Horror", "Death-Game", "Ero-Guro", "Found-Family", "Gender-Bending", "LGBTQ+-Themes", "Lost-Civilization", "Memory-Manipulation", "Otaku-Culture",
    "Software-Development", "Age-Gap", "Boys'-Love", "Female-Harem", "Love-Triangle", "Male-Harem", "Mixed-Gender-Harem", "Teens'-Love",
    "Space-Opera", "Time-Manipulation", "Real-Robot", "Super-Robot", "Cute-Boys-Doing-Cute-Things", "Cute-Girls-Doing-Cute-Things", "Family-Life"];

function remove_unwanted_tag(anime_list, tagsList)
{
    let tmp_list = []
    for (let i = 0; i < anime_list.length; i++) {
        for (let j = 0; j < tagsList.length; j++) {
            const res = anime_list.at(i).media.tags.filter(obj => Object.values(obj).some(val => val.includes(tagsList.at(j))));
            if (res.length > 0) {
                tmp_list.push(anime_list.at(i));
                break;
            }
            else if (listTagEquivalent.includes(tagsList.at(j)) && anime_list.at(i).media.tags.filter(obj => Object.values(obj).some(val => val.includes(tagsList.at(j).replaceAll('-', ' ')))).length > 0) {
                tmp_list.push(anime_list.at(i));
                break;
            }

        }
    }
    return tmp_list;
}

function remove_unwanted_studio(anime_list, studio)
{
    let studioId = parseInt(studio);
    let tmp_list = []
    for (let i = 0; i < anime_list.length; i++) {
        for (let j = 0; j < anime_list.at(i).media.studios.nodes.length; j++) {
            if (anime_list.at(i).media.studios.nodes[j].id === studioId) {
                tmp_list.push(anime_list.at(i));
                break;
            }
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
    let genre_list = recoverSelectedElement('list', 'genre-selector-check-');
    let formatList = recoverSelectedElement('listFormat', 'format-selector-check-');
    let tagList = recoverSelectedElementTag('tag-list', 'tag-selector-check-');
    let yearList = recoverSelectedElement('listYear', 'year-selector-check-');
    let seasonList = recoverSelectedElement('listSeason', 'season-selector-check-');

    let tmp = [];
    for (let i = 0; i < data.data.MediaListCollection.lists.length; i++) {
        if (data.data.MediaListCollection.lists[i].status !== null)
            tmp.push(data.data.MediaListCollection.lists[i]);
    }
    let list_data = clean_array(remove_unwanted_state, tmp, state_list);
    let new_list_data = clean_array(remove_unwanted_genre, list_data, genre_list);
    let new_list_data_format = clean_array(remove_unwanted_format, new_list_data, formatList);
    let new_list_data_year = clean_array(remove_unwanted_year, new_list_data_format, yearList);
    let new_list_data_season = clean_array(remove_unwanted_season, new_list_data_year, seasonList);
    let studio = document.getElementById("studio").value.split('/').filter(item => item).filter((v) => v !== ' ')[3];
    let new_tmp;
    if (document.getElementById("studio").value.trim() !== "")
        new_tmp = clean_array(remove_unwanted_studio, new_list_data_season, studio);
    else 
        new_tmp = new_list_data_season;
    return clean_array(remove_unwanted_tag, new_tmp, tagList);
}
function get_list_already_in(data, datas)
{
    let list_anime = [];
    for (let i = 0; i < data.length; i++) {
        let tmp = data[i].comment.split('\n');
        for (let j = 0; j < tmp.length; j++) {
            if (tmp[j].includes("https://anilist.co")) {
                if ((tmp[j].match(/\//g) || []).length >= 6) {
                    tmp[j] = tmp[j].slice(0, tmp[j].length - 1);
                    tmp[j] = tmp[j].slice(0, tmp[j].lastIndexOf('/'));
                }
                list_anime.push(tmp[j]);
            }
        }
    }
    let new_list_data = []
    if (list_anime.length > 0) {
        for (let i = 0; i < datas.length; i++) {
            let tmp = []
            for (let j = 0; j < datas[i].entries.length; j++) {
                if (list_anime.indexOf(datas[i].entries[j].media.siteUrl) === -1) {
                    tmp.push(datas[i].entries[j]);
                }
            }
            if (tmp.length > 0) {
                datas.at(i).entries = tmp;
                new_list_data.push(datas[i]);
            }
        }
    } else {
        return datas;
    }
    return new_list_data;
}

function swap(arr, xp, yp)
{
    var temp = arr[xp];
    arr[xp] = arr[yp];
    arr[yp] = temp;
}

function compare_date(element1, element2)
{
    if (element1.completedAt.year === null)
        return 1;
    else if (element2.completedAt.year === null)
        return 0;
    else if (element1.completedAt.year < element2.completedAt.year)
        return 0
    else if (element2.completedAt.year < element1.completedAt.year)
        return 1;
    else if (element1.completedAt.month < element2.completedAt.month)
        return 0
    else if (element2.completedAt.month < element1.completedAt.month)
        return 1;
    else if (element1.completedAt.day < element2.completedAt.day)
        return 0
    else if (element2.completedAt.day < element1.completedAt.day)
        return 1;
    return 0;
}

function sort_by_date(data) {
    let tmp = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].entries.length; j++) {
            tmp.push(data[i].entries[j]);
        }
    }
    for (let i = 0; i < tmp.length - 1; i++) {
        for (let j = 0; j < tmp.length - i - 1; j++) {
            if (compare_date(tmp[j], tmp[j + 1]) !== 0) {
                swap(tmp, j, j + 1);
            }
        }
    }
    return tmp;
}

function get_challenge_principal(threadId, datas) {
    let query = "query ($threadId: Int) {\n" +
        "  ThreadComment(id: $threadId) {\n" +
        "    id\n" +
        "    siteUrl\n" +
        "    createdAt\n" +
        "    comment\n" +
        "    childComments\n" +
        "  }\n" +
        "}";
    let my_variables = {threadId};
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
            let res = get_list_already_in(data.data.ThreadComment, datas);
            if (data.data.ThreadComment[0].childComments !== null) {
                for (let i = 0; i < data.data.ThreadComment[0].childComments.length; i++) {
                    res = get_list_already_in(data.data.ThreadComment[0].childComments, res);
                }
            }
            display_data(sort_by_date(res));
        });
}

function create_element_to_display(data) {
    let all_data = parse_data(data);
    let challenge = document.getElementById('challenge').value;
    if (challenge !== null && challenge !== "") {
        let tmp = challenge.split('/');
        get_challenge_principal(parseInt(tmp[tmp.length - 1]), all_data)
    } else {
        display_data(sort_by_date(all_data));
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
        "source\n" +
        "    countryOfOrigin\n" +
        "    studios {\n" +
        "      nodes {\n" +
        "        name\n" +
        "        id\n" +
        "      }\n" +
        "    }\n" +
        "    tags {\n" +
        "        name\n" +
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
        "}\n" + "\n";
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