function format_date(number)
{
    if (number.length <= 1)
        return "0" + number;
    return number;
}

let totalDuration = 0;

function createRightInfo(data) {
    let div = document.createElement('div');
    div.className = "right-info";
    let season = document.createElement('p');
    if (data.media.season !== null) {
        season.className = "season";
        if (data.media.seasonYear !== null)
            season.innerHTML = data.media.season + " " + data.media.seasonYear;
        else
            season.innerHTML = data.media.season;
    } else if (data.media.startDate) {
        season.className = "season";
        const year = ( data.media.startDate.year !== null ) ? data.media.startDate.year.toString() : "YYYY";
        const month = ( data.media.startDate.month !== null ) ? format_date(data.media.startDate.month.toString()) : "MM";
        const day = ( data.media.startDate.day !== null ) ? format_date(data.media.startDate.day.toString()) : "DD";
        season.innerHTML = year + "-" + month + "-" + day;
    }
    let smiley = document.createElement('img');
    smiley.className = "smiley-rate";
    if (data.media.averageScore >= 80)
        smiley.src = "img/good.png";
    else if (data.media.averageScore >= 60)
        smiley.src = "img/medium-good.png"
    else if (data.media.averageScore >= 40 || data.media.averageScore === null)
        smiley.src = "img/medium.png"
    else if (data.media.averageScore >= 20)
        smiley.src = "img/medium-bad.png"
    else
        smiley.src = "img/bad.png"
    let rate = document.createElement('p');
    rate.className = "rate";
    if (data.media.averageScore !== null)
        rate.innerHTML = data.media.averageScore.toString() + "%";
    else
        rate.innerHTML = "";
    div.appendChild(season);
    div.appendChild(smiley);
    div.appendChild(rate);
    return div;
}

function createHiddenInfo(data) {
    let div = document.createElement('div');
    div.id = data.media.id.toString();
    div.className = "hidden-info";
    div.style.display = "none";
    div.appendChild(createRightInfo(data));
    let state = document.createElement('p');
    state.innerHTML = data.status;
    state.className = "info-p";
    div.appendChild(state);
    if (data.media.episodes !== null) {
        let ep = document.createElement('p');
        ep.className = "info-p";
        if (data.media.episodes === 1)
            ep.innerHTML = data.media.format + " - " + data.media.duration + " minutes";
        else
            ep.innerHTML = data.media.format + " - " + data.media.episodes + " episodes";
        div.appendChild(ep);
    } else if (data.media.chapters !== null) {
        let ch = document.createElement('p');
        ch.className = "info-p";
        if (data.media.volumes !== null)
            ch.innerHTML = data.media.format + " - " + data.media.chapters + " Chapters " + data.media.volumes + " Volumes";
        else
            ch.innerHTML = data.media.format + " - " + data.media.chapters + " Chapters";
        div.appendChild(ch);
    }
    if (data.media.duration != null) {
        let dur = document.createElement('p');
        dur.className = "info-p";
        dur.innerHTML = "Episode duration: " + data.media.duration.toString() + " minutes";
        div.appendChild(dur);
    }
    for (let i = 0; i < data.media.genres.length; i++) {
        let cellGenre = document.createElement('span');
        cellGenre.className = "tag-card";
        cellGenre.innerHTML = data.media.genres[i];
        div.appendChild(cellGenre);
    }
    div.appendChild(document.createElement('hr'))
    let started = document.createElement('p');
    started.className = "info-p";
    started.innerHTML = "Started Date: ";
    if (data.startedAt != null && data.startedAt.year != null && data.startedAt.month != null && data.startedAt.day != null)
        started.innerHTML += data.startedAt.year.toString() + "/" + format_date(data.startedAt.month.toString()) + "/" + format_date(data.startedAt.day.toString());
    div.appendChild(started);
    started.addEventListener("contextmenu", function() {
        let textValue = "";
        if (data.startedAt != null && data.startedAt.year != null && data.startedAt.month != null && data.startedAt.day != null)
            textValue = "Start: " + data.startedAt.year.toString() + "-" + format_date(data.startedAt.month.toString()) + "-" + format_date(data.startedAt.day.toString()) + " ";
        if (data.completedAt != null && data.completedAt.year != null && data.completedAt.month != null && data.completedAt.day != null)
            textValue += "Finish: " + data.completedAt.year.toString() + "-" + format_date(data.completedAt.month.toString()) + "-" + format_date(data.completedAt.day.toString());
        navigator.clipboard.writeText(textValue);
    })
    let finished = document.createElement('p');
    finished.className = "info-p";
    finished.innerHTML = "Finished Date: ";
    if (data.completedAt != null && data.completedAt.year != null && data.completedAt.month != null && data.completedAt.day != null)
        finished.innerHTML += data.completedAt.year.toString() + "/" + format_date(data.completedAt.month.toString()) + "/" + format_date(data.completedAt.day.toString());
    div.appendChild(finished);
    return div;
}

function createCover(url, id, urlAnime) {
    let tmp = document.createElement('img');
    tmp.src = url;
    tmp.alt = "anime-cover-small-" + id;
    tmp.className = "small-anime-random-cover";
    return tmp;
}

function createTitleRefDot(state, name, url)
{
    let tmp = document.createElement('a');
    tmp.href = url;
    tmp.className = "anime-name";
    let dot = "";
    if (state === "CURRENT")
        dot = '<span class="dot watching"></span>';
    else if (state === "PLANNING")
        dot = "<span class='dot planned'></span>";
    else if (state === "COMPLETED")
        dot = "<span class='dot watched'></span>";
    else if (state === "DROPPED")
        dot = "<span class='dot dropped'></span>";
    else if (state === "PAUSED")
        dot = "<span class='dot paused'></span>";
    else if (state === "REPEATING")
        dot = "<span class='dot rewatched'></span>";
    tmp.innerHTML = dot + name;
    return tmp;
}
function createGlobDiv(id, data)
{
    let tmp = document.createElement('div');
    tmp.id = "preview-" + id;
    tmp.className = "anime-preview col-md-3";
    tmp.tabIndex = "0";
    tmp.addEventListener('mouseover', function () {tmp.style.cursor = "pointer";})
    tmp.addEventListener('mouseout', function () {tmp.style.cursor = "initial";})
    tmp.addEventListener("click", function () {
        if (document.getElementById(id).style.display === "none") {
            if (data.media.episodes !== null && data.media.episodes !== 1)
                totalDuration += data.media.duration * data.media.episodes;
            else
                totalDuration += data.media.duration;
            document.getElementById(id).style.display = "block";
        } else {
            if (data.media.episodes !== null && data.media.episodes !== 1)
                totalDuration -= data.media.duration * data.media.episodes;
            else
                totalDuration -= data.media.duration;
            document.getElementById(id).style.display = "none";
        }
        document.getElementById("duration-value").innerText = totalDuration.toString();
    })

    return tmp;
}

function deleteChildren(elementName)
{
    let genreTable = document.getElementById(elementName);
    let child = genreTable.lastElementChild;
    while (child) {
        genreTable.removeChild(child);
        child = genreTable.lastElementChild;
    }
}

function display_data(data)
{
    totalDuration = 0;
    document.getElementById("duration-value").innerText = totalDuration.toString();
    document.getElementById("total-value").innerText = data.length.toString();
    let allPreview = document.getElementById('preview-search');
    deleteChildren('preview-search')
    for (let i = 0; i < data.length; i++) {
            let globDiv = createGlobDiv(data[i].media.id.toString(), data[i]);

            globDiv.appendChild(createCover(data[i].media.coverImage.large, data[i].media.id.toString(), data[i].media.siteUrl));
            globDiv.appendChild(createTitleRefDot(data[i].status, data[i].media.title.userPreferred,
                data[i].media.siteUrl));
            globDiv.appendChild(createHiddenInfo(data[i]));
            allPreview.appendChild(globDiv);
            $('#' + "preview-" + data[i].media.id.toString()).on('keydown', function(event) {
                if (event.keyCode === 32) {
                    let textValue = "";
                    if (data[i].startedAt != null && data[i].startedAt.year != null && data[i].startedAt.month !=
                        null && data[i].startedAt.day != null)
                        textValue = "Start: " + data[i].startedAt.year.toString() + "-" +
                            format_date(data[i].startedAt.month.toString()) + "-" +
                            format_date(data[i].startedAt.day.toString()) + " ";
                    if (data[i].completedAt != null && data[i].completedAt.year != null &&
                        data[i].completedAt.month != null && data[i].completedAt.day != null)
                        textValue += "Finish: " + data[i].completedAt.year.toString() + "-" +
                            format_date(data[i].completedAt.month.toString()) + "-" +
                            format_date(data[i].completedAt.day.toString());
                    navigator.clipboard.writeText(textValue);
                }
                event.preventDefault();
            });
    }
}