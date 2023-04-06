function format_date(number)
{
    if (number.length <= 1)
        return "0" + number;
    return number;
}

function createDate(dateObj)
{
    if (dateObj.year !== null && dateObj.month !== null && dateObj.day !== null)
        return dateObj.year.toString() + "-" + format_date(dateObj.month.toString()) + "-" + format_date(dateObj.day.toString());
    return "unknow";
}

function resume(data)
{
    let resume = {};

    for (let i = 0; i < data.data.MediaListCollection.lists.length; i++) {
        if (data.data.MediaListCollection.lists[i].status !== null) {
            for (let j = 0; j < data.data.MediaListCollection.lists[i].entries.length; j++) {
                let tmp = {};
                tmp["start"] = createDate(data.data.MediaListCollection.lists[i].entries[j].startedAt);
                tmp["end"] = createDate(data.data.MediaListCollection.lists[i].entries[j].completedAt);
                resume[data.data.MediaListCollection.lists[i].entries[j].media.siteUrl] = tmp;
            }
        }
    }
    return resume;
}

function search_through(data, comment)
{
    let comment_split = comment.split("\n");
    let completed = '✅';
    let finished = '❌';

    for (let i = 0; i < comment_split.length; i++) {
        if (comment_split[i].includes("Legend:")) {
            let info = comment_split[i].replaceAll('[', ' ').replaceAll(']', ' ').split(' ')
                .filter(item => item).filter((v) => v !== ' ');
            completed = info[1];
            finished = info[4];
        }
        if (comment_split[i].includes("https://anilist.co")) {
            let info = comment_split[i].replaceAll('(', ',').replaceAll(')', ',').split(',').filter(item => item).filter((v) => v !== ' ');
            let url = info[info.length - 1];
            if (url[url.length - 1] === '/')
                url = url.slice(0, -1);
            let urlPart = url.split('/').filter(item => item).filter((v) => v !== ' ');
            if (urlPart.length >= 5) {
                url = url.slice(0, url.length - 1);
                url = url.slice(0, url.lastIndexOf('/'));
            }
            if (data.hasOwnProperty(url) && !comment_split[i - 1].includes(completed) && comment_split[i - 1].includes('__')) {
                comment_split[i + 1] = "Start: " + data[url].start + " Finish: " + data[url].end + comment_split[i + 1].substring(36);
                const index = comment_split[i - 1].indexOf('[') + 1;
                comment_split[i - 1] = comment_split[i - 1].substring(0, index) + completed + comment_split[i - 1].substring(index + 1);
            } else if (!comment_split[i - 1].includes(completed) && comment_split[i - 1].includes("Start")) {
                const index = comment_split[i - 1].indexOf('[') + 1;
                comment_split[i - 1] = comment_split[i - 1].substring(0, index) + finished + comment_split[i - 1].substring(index + 1);
            }
        }
    }
    return comment_split;
}

function to_html(data)
{
    let text = "";
    for (let i = 0; i < data.length; i++) {
        text += data[i];
        text += "\n";
    }
    return text;
}

function fetch_personal(userId, comment) {
    let startQuery = "query ($userId: Int, $type: MediaType, $status: MediaListStatus)";
    let mediaStart = "  MediaListCollection(userId: $userId, type: $type, status: $status)";
    let type = "ANIME"
    let status = "COMPLETED"
    let my_variables = {userId, type, status};

    let query = startQuery + "{\n" +
        mediaStart + "{\n" +
        "    lists {\n" +
        "      name\n" +
        "      status\n" +
        "      entries {\n" +
        "        ...mediaListEntry\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}\n" + "\n" +
        "fragment mediaListEntry on MediaList {\n" +
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
        "    siteUrl\n" +
        "   }\n" +
        "  }\n" +
        "\n";
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

    let doc = document.getElementById("preview-challenge");
    let docChild = doc.children;
    while (docChild.length > 0) {
        doc.removeChild(docChild[0]);
    }
    fetch(url, options).then(response => response.json())
        .then(data => {
            let anime = resume(data);
            let comment_result = document.createElement("div");
            let val = to_html(search_through(anime, comment[0].comment));
            comment_result.innerText = val;
            comment_result.className = "comment-look";
            comment_result.id = "principal-comment";
            comment_result.tabIndex = "0";
            doc.appendChild(comment_result);
            $('#' + "principal-comment").on('keydown', function(event) {
                if (event.keyCode === 32) {
                    navigator.clipboard.writeText(val);
                }
            });
            if (comment[0].childComments !== null) {
                for (let i = 0; i < comment[0].childComments.length; i++) {
                    let sub_comment_result = document.createElement("div");
                    let sub = to_html(search_through(anime, comment[0].childComments[i].comment));
                    sub_comment_result.innerText = sub
                    sub_comment_result.className = "sub-comment-look";
                    sub_comment_result.id = "sub-comment-" + i.toString();
                    sub_comment_result.tabIndex = "0";
                    doc.appendChild(sub_comment_result);
                    $('#' + "sub-comment-" + i.toString()).on('keydown', function (event) {
                        if (event.keyCode === 32) {
                            navigator.clipboard.writeText(sub);
                        }
                    });
                }
            }
        });
}

async function get_challenge_info() {
    let challenges = document.getElementById("challenge").value.split("/");
    let id = parseInt(challenges[challenges.length - 1]);
    let doc = document.getElementById("preview-challenge");
    let awaitDoc = document.createElement("img");
    awaitDoc.src = "img/loading.gif";
    awaitDoc.className = "await-center";
    doc.appendChild(awaitDoc);
    let query = "query ($id: Int) {\n" +
        "  ThreadComment(id: $id) {\n" +
        "    userId\n" +
        "    comment\n" +
        "    childComments\n" +
        "  }\n" +
        "}\n";
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
    await fetch(url, options).then(response => response.json())
        .then(async data => {
            let userId = parseInt(data.data.ThreadComment[0].userId);
            fetch_personal(userId, data.data.ThreadComment);
        });
}

document.getElementById("button-search-bingo").addEventListener("click", get_challenge_info);
document.getElementById("challenge").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("button-search-bingo").click();
    }
});