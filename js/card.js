function uncheck_tag(tag_name, name, selectorName) {
    let tag = document.getElementById(tag_name);
    let genre_tag = document.getElementById("tag-list-all");
    let labelFound = document.getElementById(selectorName + "-check-" + name);
    let check_item = document.getElementById(selectorName + '-check-item-' + name);
    genre_tag.removeChild(tag);
    labelFound.className = "task";
    check_item.className = "right-element hide";
}

function check_uncheck_list(name, listName, selectorName) {
    let genre_tag = document.getElementById("tag-list-all");
    let labelFound = document.getElementById(selectorName + "-check-" + name);
    let check_item = document.getElementById(selectorName + '-check-item-' + name);
    document.getElementById(selectorName).value = "";
    let listChildren = document.getElementById(listName).children;
    for (let i = 0; i < listChildren.length; i++) {
        listChildren.item(i).style.display = "block";
    }
    if (labelFound.className === "task selected-genre") {
        let tag = document.getElementById(selectorName + "-tag-" + name);
        genre_tag.removeChild(tag);
        labelFound.className = "task";
        check_item.className = "right-element hide";
    } else {
        let tag = document.createElement('span');
        tag.id = selectorName + "-tag-" + name;
        tag.innerHTML = name;
        tag.className = "tag-card tagcard-" + selectorName;
        genre_tag.appendChild(tag);
        tag.addEventListener('click', uncheck_tag.bind(null, selectorName + "-tag-" + name, name, selectorName));
        labelFound.className = "task selected-genre";
        check_item.className = "right-element";
    }
}

function addSelector(listName, tagName, list, selectorName) {
    let selector = document.getElementById(listName);
    for (let i = 0; i < list.length; i++) {
        let label = document.createElement('label');
        label.htmlFor = selectorName + "-check-item-" + list.at(i);
        label.className = "task";
        label.id = selectorName + "-check-" + list.at(i);
        label.innerHTML = list.at(i);
        let span_check_mark = document.createElement("span");
        span_check_mark.innerHTML = "&#10004;";
        span_check_mark.className = "right-element hide";
        span_check_mark.id = selectorName + "-check-item-" + list.at(i);
        label.appendChild(span_check_mark);
        selector.appendChild(label);
        label.addEventListener('click', check_uncheck_list.bind(null, list.at(i), listName, selectorName));
    }
}

function searchIn(listName, selectorName, arrowName) {
    let selector = document.getElementById(selectorName);
    let listChildren = document.getElementById(listName).children;
    for (let i = 0; i < listChildren.length; i++) {
        listChildren.item(i).style.display = "block";
    }
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
