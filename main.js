let numberOfBear=0;
let numberOfCity=0;
let numberOfBanner=0;
let numberOfRss = 0;
let number = 0;

let map = [[]];

let listElement = []

let listOfBear = [];
let listOfBanner = [];
let listOfRss = [];

const card = document.getElementById('ce')

const bear = document.getElementById('bear')
const city = document.getElementById('city')
const banner = document.getElementById('banner')
const rss = document.getElementById('rss')
const container = document.getElementById('container')

bear.addEventListener('click', addBearToMap)
city.addEventListener('click', addCityToMap);
banner.addEventListener('click', addBannerToMap);
rss.addEventListener('click', addRssToMap);

function addBearToMap(e) {
  if (numberOfBear < 2) {
    const newBear = document.createElement("div");
    newBear.className = "bear-object";
    newBear.id = "bear-id-" + numberOfBear;
    newBear.addEventListener('mousedown', mouseDown)
    container.appendChild(newBear);
    listElement.push(newBear);
    listOfBear.push(newBear.id);
    numberOfBear += 1;
    return newBear;
  }
  return null;
}

function addCityToMap(e) {
  const newCity = document.createElement("div");
  newCity.className = "city-object";
  newCity.id = numberOfCity + "-city";
  newCity.addEventListener('mousedown', mouseDown)
  container.appendChild(newCity);
  listElement.push(newCity);
  numberOfCity += 1;
  return newCity;
}

function addRssToMap(e) {
  const newRss = document.createElement("div");
  newRss.className = "rss-object";
  newRss.id = "rss-id-" + numberOfRss;
  newRss.addEventListener('mousedown', mouseDown)
  container.appendChild(newRss);
  listElement.push(newRss);
  listOfRss.push(newRss.id);
  numberOfRss += 1;
  return newRss;
}

function addBannerToMap() {
  const newBannerRadius = document.createElement("div");
  newBannerRadius.className = "banner-radius";
  newBannerRadius.id = "banner-radius-id-" + numberOfBanner; 
  const newBannerPoint = document.createElement("div");
  newBannerPoint.className = "banner-object"
  newBannerRadius.appendChild(newBannerPoint);
  newBannerRadius.addEventListener('mousedown', mouseDown)
  container.appendChild(newBannerRadius);
  listElement.push(newBannerRadius);
  listElement.push(newBannerPoint);
  numberOfBanner += 1;
  listOfBanner.push(newBannerRadius.id);
  return newBannerRadius;
}

let currentElementTarget;

function mouseDown(e){
    startX = e.clientX
    startY = e.clientY

    for (let el of listElement) {
      el.removeEventListener('mousemove', mouseDown)
    }

    currentElementTarget = e;

    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
}

function mouseMove(e){
  let newX = startX - e.clientX 
  let newY = startY - e.clientY
  
  startX = e.clientX
  startY = e.clientY

  if ((currentElementTarget.target.offsetLeft - newX) < 240) {
    currentElementTarget.target.style.left = 240 + 'px'
  } else {
    currentElementTarget.target.style.left = (currentElementTarget.target.offsetLeft - newX) + 'px'
  }
  currentElementTarget.target.style.top = (currentElementTarget.target.offsetTop - newY) + 'px'
  mouseFollowbanner(currentElementTarget, (currentElementTarget.target.offsetTop - newY), (currentElementTarget.target.offsetLeft - newX))
}

function mouseUp(e){
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('mouseup', mouseUp)

  console.log(startY/40.90)

  y = parseInt(currentElementTarget.target.style.top)
  x = parseInt(currentElementTarget.target.style.left)

  newTop = 40 * Math.round( y / 40);
  newLeft = 40 * Math.round( x / 40);
  currentElementTarget.target.style.top = newTop + 'px'
  currentElementTarget.target.style.left = newLeft + 'px'

  mouseFollowbanner(currentElementTarget, newTop, newLeft);

  for (let el of listElement) {
    el.addEventListener('mousedown', mouseDown);
  }
}

function mouseFollowbanner(e, y, x){
  if (e.target.className == "banner-radius") {
    e.target.children[0].style.top = (y + 120) + 'px'
    e.target.children[0].style.left = (x + 120) + 'px'
  } else if (e.target.className == "banner-object") {
    e.target.parentNode.style.top = (y - 120) + 'px'
    e.target.parentNode.style.left = (x - 120) + 'px'
  }
}

let memberList = new Map();

////////////////////////////////////////////////////////////

function addUsernameToCity(city, username) {
  const usernameText = document.createElement("div");
  usernameText.className = "username";
  usernameText.innerText = username;

  city.appendChild(usernameText);
}

function onUsernameClick(user, addCityButton) {
  userCity = addCityToMap(city);
  userCity.style.backgroundImage="url(" + user.picture + ")";
  user.id = numberOfCity;
  if (user.picture.length > 72) {
    userCity.innerText = "";
  }
  userCity.id = user.city;
  addCityButton.className = "add-city green-hg";
  addUsernameToCity(userCity, user.username);
  return userCity;
}

function fillUserInfo(line) {
  let user = {}
  let info = line.split(";")
  user.fid = info[0]
  user.username = info[1]
  user.picture = info[2]
  user.cityId = "city-id-" + number;
  user.city = "user-city-" + number;
  user.addCityButtonId = "add-city-btn-id" + number;
  number += 1;

  return user;
}

function fillUserInfoFromSave(information) {
  let user = {}
  user.fid = information[0]
  user.username = information[1]
  user.picture = information[2]
  user.cityId = "city-id-" + number;
  user.city = "user-city-" + number;
  user.addCityButtonId = "add-city-btn-id" + number;
  number += 1;

  return user;
}

function addUserThumbnail(user) {
  const thumbnail = document.createElement("img");
  thumbnail.className = "thumbnail";
  thumbnail.src = user.picture;

  return thumbnail;
}

function addUsername(user) {
  const name = document.createElement("p");
  name.innerText = user.username;
  
  return name;
}

function createCrossButton() {
  const cross = document.createElement("img");
  cross.className = "delete-btn"
  cross.src = "cross.png";
  
  return cross;
}

function createCityLink(user) {
  const addCityButton = document.createElement("div");
  addCityButton.className = "add-city red-hg";
  addCityButton.id = user.addCityButtonId;
  
  addCityButton.appendChild(addUserThumbnail(user));
  addCityButton.appendChild(addUsername(user));

  return addCityButton;
}

function deleteCity(user) {
  const addCityButtonId = document.getElementById(user.addCityButtonId);
  if (addCityButtonId.className == "add-city red-hg") {
    return;
  }
  addCityButtonId.className = "add-city red-hg";
  memberList.delete(user.cityId);
  document.getElementById(user.city).remove();
  const currentCityId = document.getElementById(user.cityId);
  currentCityId.innerText = "[0]";
  numberOfCity -= 1;

  let cpy = memberList;
  for (let keypair of cpy) {
    let usr = keypair[1];
    if (usr.id > user.id && usr.id != 0) {
      memberList.delete(usr.cityId);
      usr.id -= 1;
      memberList.set(usr.cityId, usr);
    }
  }
  user.id = 0;
  memberList.set(user.cityId, user);
}

function addCity(user, addCityButton) {
  const addCityButtonId = document.getElementById(user.addCityButtonId);
  if (addCityButtonId.className == "add-city red-hg") {
    userCity = onUsernameClick(user, addCityButton);
  }
  return userCity;
}

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    let lines = contents.split("\n");
    const userList = document.getElementById('member-list')
    for (let line of lines) {
      if (line == "") {
        continue;
      }
      let user = fillUserInfo(line);

      let addCityButton = createCityLink(user);

      addCityButton.addEventListener("click", function() { addCity(user, addCityButton); }, false);

      memberList.set(user.cityId, user);
      let cross = createCrossButton();      

      cross.addEventListener("click", function() { deleteCity(user); }, false);

      const userLi = document.createElement("li");
      userLi.className = "member-line";
      userLi.appendChild(cross);
      userLi.appendChild(addCityButton);
      userList.appendChild(userLi);
    }
  }
  reader.readAsText(file);
}



function saveBear(e) {
  let saved = "";
  for (let keypair of memberList) {
    let usr = keypair[1];
    console.log(usr);
    let cityObject = document.getElementById(usr.city);
    let citySave = usr.fid + ";" + usr.username + ";" + usr.picture;
    if (cityObject) {
      console.log(cityObject.style.top);
      citySave += ";" + cityObject.style.top + ";" + cityObject.style.left + "\n";
    } else {
      citySave += "\n";
    }
    saved += citySave;
  }
  saved += "="
  for (let bear of listOfBear) {
    let bearPosition = document.getElementById(bear);
    saved += bearPosition.style.top + ";" + bearPosition.style.left + "\n";
  }
  saved += "="
  for (let rss of listOfRss) {
    let rssPosition = document.getElementById(rss);
    saved += rssPosition.style.top + ";" + rssPosition.style.left + "\n";
  }
  saved += "="
  for (let banner of listOfBanner) {
    let bannerPosition = document.getElementById(banner);
    saved += bannerPosition.style.top + ";" + bannerPosition.style.left + "\n";
  }
  let blobdtMIME =
  new Blob([saved], { type: "text/plain" })
  let url = URL.createObjectURL(blobdtMIME)
  let anele = document.createElement("a")
  anele.setAttribute("download", "Downloaded Successfully");
  anele.href = url;
  anele.click();
  console.log(blobdtMIME)
}

function loadBear(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  memberList = new Map();
  numberOfBear=0;
  numberOfCity=0;
  numberOfBanner=0;
  numberOfRss = 0;
  number = 0;
  map = [[]];
  listElement = []
  listOfBear = [];
  listOfBanner = [];
  listOfRss = [];
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    let lines = contents.split("=");
    let cities = lines[0].split("\n");
    let bears = lines[1].split("\n");
    let rssList = lines[2].split("\n");
    let banners = lines[3].split("\n");
    const userList = document.getElementById('member-list')
    // city
    for (let line of cities) {
      if (line == "") {
        continue;
      }
      let savedElement = line.split(";")
      let user = fillUserInfoFromSave(savedElement);
      let addCityButton = createCityLink(user);

      addCityButton.addEventListener("click", function() { addCity(user, addCityButton); }, false);

      memberList.set(user.cityId, user);
      let cross = createCrossButton();      

      cross.addEventListener("click", function() { deleteCity(user); }, false);

      const userLi = document.createElement("li");
      userLi.className = "member-line";
      userLi.appendChild(cross);
      userLi.appendChild(addCityButton);
      userList.appendChild(userLi);

      if (savedElement.length > 3) {
        let city = addCity(user, addCityButton);
        city.style.top = savedElement[3];
        city.style.left = savedElement[4];
      }
    }
    // bear
    for (let line of bears) {
      if (line == "") {
        continue;
      }
      let info = line.split(";");
      let bear = addBearToMap();
      bear.style.top = info[0];
      bear.style.left = info[1];
    }
    // rss
    for (let line of rssList) {
      if (line == "") {
        continue;
      }
      let info = line.split(";");
      let rss = addRssToMap();
      rss.style.top = info[0];
      rss.style.left = info[1];
    }
    // banner
    for (let line of banners) {
      if (line == "") {
        continue;
      }
      let info = line.split(";");
      let bannerRadius = addBannerToMap();
      bannerRadius.style.top = info[0];
      bannerRadius.style.left = info[1];
      bannerRadius.children[0].style.top = parseInt(bannerRadius.style.top) + 120 + 'px';
      bannerRadius.children[0].style.left = parseInt(bannerRadius.style.left) + 120 + 'px';
    }
  }
  reader.readAsText(file);
}

document.getElementById('saveBear').addEventListener('click', saveBear)
document.getElementById('load-input').addEventListener('change', loadBear, false)

document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);