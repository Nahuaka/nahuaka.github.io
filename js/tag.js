let tagOpen = false;

function searchInTagg(listName, selectorName, arrowName) {
  let selector = document.getElementById(selectorName);
  let listChildren = document.getElementById(listName).children;
  document.querySelector('#' + listName).classList.toggle('show', true);
  document.querySelector('.' + arrowName).classList.toggle('rotate180', true);
  for (let j = 0; j < listChildren.length; j++) {
    for (let i = 0; i < listChildren[j].children.length; i++) {
      listChildren[j].children[i].style.display = "block";
    }
  }
  tagOpen = true;
  if (selector.value != null || selector.value.trim().length !== 0) {
    for (let j = 0; j < listChildren.length; j++) {
      let counter = listChildren[j].children.length - 1;
      listChildren[j].style.display = "block";
      for (let i = 0; i < listChildren[j].children.length; i++) {
        let child = listChildren[j].children[i];
        let value = child.innerHTML;
        let type = child.className.includes("task-grp");
        if (listChildren[j].children[i].className !== "group-title" && type && !value.toLowerCase().startsWith(selector.value.toLowerCase())) {
          listChildren[j].children[i].style.display = "none";
          counter -= 1;
        }
      }
      if (counter === 0)
        listChildren[j].style.display = "none";
    }
  }
}

function uncheck_tag_theme(tag_name, name, selectorName) {
  let tag = document.getElementById(tag_name);
  let genre_tag = document.getElementById("tag-list-all");
  let labelFound = document.getElementById(selectorName + "-check-" + name.replaceAll(' ', '-'));
  let check_item = document.getElementById(selectorName + '-check-item-' + name.replaceAll(' ', '-'));
  genre_tag.removeChild(tag);
  labelFound.className = "task-grp";
  check_item.className = "right-element hide";
}

function check_uncheck_list_theme(name, listName, selectorName) {
  let genre_tag = document.getElementById("tag-list-all");
  let labelFound = document.getElementById(selectorName + "-check-" + name.replaceAll(' ', '-'));
  let check_item = document.getElementById(selectorName + '-check-item-' + name.replaceAll(' ', '-'));
  document.getElementById(selectorName).value = "";

  let listChildren = document.getElementById(listName).children;
  for (let i = 0; i < listChildren.length; i++) {
    listChildren.item(i).style.display = "block";
  }
  if (labelFound.className === "task-grp selected-genre") {
    let tag = document.getElementById(selectorName + "-tag-" + name.replaceAll(' ', '-'));
    genre_tag.removeChild(tag);
    labelFound.className = "task-grp";
    check_item.className = "right-element hide";
  } else {
    let tag = document.createElement('span');
    tag.id = selectorName + "-tag-" + name.replaceAll(' ', '-');
    tag.innerHTML = name;
    tag.className = "tag-card";
    genre_tag.appendChild(tag);
    tag.addEventListener('click', uncheck_tag_theme.bind(null, selectorName + "-tag-" + name.replaceAll(' ', '-'), name, selectorName));
    labelFound.className = "task-grp selected-genre";
    check_item.className = "right-element";
  }
}

function addSelectorTags(listName, tagName, allList, selectorName) {
  let selector = document.getElementById(listName);
  let categoryLen = Object.keys(allList).length;
  for (let i = 0; i < categoryLen; i++) {
    let div = document.createElement("div");
    div.className = "grp-dropdown-selector";
    let list = Object.values(allList).at(i);
    let groupTitle = document.createElement('h4');
    groupTitle.id = Object.keys(allList).at(i).replaceAll('/', '-').replaceAll(' ', '')
    groupTitle.className = "group-title";
    groupTitle.innerHTML = Object.keys(allList).at(i);
    div.appendChild(groupTitle);
    for (let j = 0; j < list.length; j++) {
      let label = document.createElement('label');
      label.htmlFor = selectorName + "-check-item-" + list.at(j).replaceAll(' ', '-');
      label.className = "task-grp";
      label.id = selectorName + "-check-" + list.at(j).replaceAll(' ', '-');
      label.innerHTML = list.at(j);
      let span_check_mark = document.createElement("span");
      span_check_mark.innerHTML = "&#10004;";
      span_check_mark.className = "right-element hide";
      span_check_mark.id = selectorName + "-check-item-" + list.at(j).replaceAll(' ', '-');
      label.appendChild(span_check_mark);
      div.appendChild(label);
      label.addEventListener('click', check_uncheck_list_theme.bind(null, list.at(j), listName, selectorName));
    }
    selector.appendChild(div);
  }
}


  let listTagCast = ["Anti-Hero", "Ensemble Cast", "Female Protagonist", "Male Protagonist", "Primarily Adult Cast", "Primarily Child Cast",
    "Primarily Female Cast", "Primarily Male Cast", "Primarily Teen Cast"];
  let listTagCastTraits = ["Age Regression", "Agender", "Aliens", "Amnesia", "Angels", "Anthropomorphism", "Artificial Intelligence", "Asexual",
    "Butler", "Centaur", "Chimera", "Chuunibyou", "Clone", "Cosplay", "Crossdressing", "Cyborg", "Delinquents", "Demons", "Detective", "Dinosaurs",
    "Disability", "Dissociative Identities", "Dragons", "Dullahan", "Elf", "Ghost", "Goblin", "Gods", "Gyaru", "Hikikomori", "Homeless", "Idol",
    "Kemonomimi", "Kuudere", "Maids", "Mermaid", "Monster Boy", "Monster Girl", "Nekomimi", "Ninja", "Nudity", "Nun", "Office Lady", "Oiran",
    "Ojou-sama", "Orphan", "Pirates", "Robots", "Samurai", "Shrine Maiden", "Skeleton", "Succubus", "Tanned Skin", "Teacher", "Tomboy", "Transgender",
    "Tsundere", "Twins", "Vampire", "Vikings", "Villainess", "VTuber", "Werewolf", "Witch", "Yandere", "Zombie"];
  let listTagDemographic = ["Josei", "Kids", "Seinen", "Shoujo", "Shounen"];
  let listTagScene = ["Bar", "Circus", "College", "Dungeon", "Foreign", "Language Barrier", "Outdoor", "Rural", "School", "School Club", "Urban",
    "Work"];
  let listTagTime = ["Achronological Order", "Anachronism", "Dystopian", "Historical", "Time Skip"];
  let listTagUniverse = ["Afterlife", "Alternate Universe", "Augmented Reality", "Omegaverse", "Post-Apocalyptic", "Space", "Urban Fantasy",
    "Virtual World"];
  let listTagTechnical = ["4-koma", "Achromatic", "Advertisement", "Anthology", "CGI", "Episodic", "Flash", "Full CGI", "Full Color", "No Dialogue",
    "Non-fiction", "POV", "Puppetry", "Rotoscoping", "Stop Motion"];
  let listTagTheme = ["Travel"];
  let listTagThemeAction = ["Archery", "Battle Royale", "Espionage", "Fugitive", "Guns", "Martial Arts", "Spearplay", "Swordplay"];
  let listTagThemeArt = ["Acting", "Calligraphy", "Classic Literature", "Drawing", "Fashion", "Food", "Makeup", "Photography", "Rakugo", "Writing"];
  let listTagThemeArtMusic = ["Band", "Dancing", "Musical"];
  let listTagThemeComedy = ["Parody", "Satire", "Slapstick", "Surreal Comedy"];
  let listTagThemeDrama = ["Bullying", "Coming of Age", "Conspiracy", "Rehabilitation", "Revenge", "Suicide", "Tragedy"];
  let listTagThemeFantasy = ["Alchemy", "Body Swapping", "Cultivation", "Fairy Tale", "Henshin", "Isekai", "Kaiju", "Magic", "Mythology",
    "Necromancy",
    "Shapeshifting", "Steampunk", "Super Power", "Superhero", "Wuxia", "Youkai"];
  let listTagThemeGame = ["E-Sports", "Video Games"];
  let listTagThemeGameCardBoardGame = ["Card Battle", "Go", "Karuta", "Mahjong", "Poker", "Shogi"];
  let listTagThemeGameSport = ["Airsoft", "American Football", "Athletics", "Badminton", "Baseball", "Basketball", "Boxing", "Cheerleading",
    "Cycling",
    "Fencing", "Fishing", "Fitness", "Football", "Golf", "Handball", "Ice Skating", "Judo", "Lacrosse", "Parkour", "Rugby", "Scuba Diving",
    "Skateboarding", "Sumo", "Surfing", "Swimming", "Table Tennis", "Tennis", "Volleyball", "Wrestling"];
  let listTagThemeOther = ["Adoption", "Animals", "Astronomy", "Autobiographical", "Biographical", "Body Horror", "Cannibalism", "Chibi",
    "Cosmic Horror", "Crime", "Crossover", "Death Game", "Denpa", "Drugs", "Economics", "Educational", "Environmental", "Ero Guro", "Found Family",
    "Gambling", "Gender Bending", "Gore", "LGBTQ%2B Themes", "Lost Civilization", "Medicine", "Memory Manipulation", "Meta", "Noir", "Otaku Culture",
    "Pandemic", "Philosophy", "Politics", "Reincarnation", "Religion", "Slavery", "Software Development", "Survival", "Terrorism", "Torture", "War"];
  let listTagOtherOrg = ["Assassins", "Cult", "Firefighters", "Gangs", "Mafia", "Military", "Police", "Triads", "Yakuza"];
  let listTagOtherVehicle = ["Aviation", "Cars", "Mopeds", "Motorcycles", "Ships", "Tanks", "Trains"];
  let listTagRomance = ["Age Gap", "Bisexual", "Boys%27 Love", "Female Harem", "Heterosexual", "Love Triangle", "Male Harem", "Mixed Gender Harem",
    "Teens' Love", "Yuri"];
  let listTagSci = ["Cyberpunk", "Space Opera", "Time Manipulation", "Tokusatsu"];
  let listTagMecha = ["Real Robot", "Super Robot"];
  let listTagSliceOfLife = ["Agriculture", "Cute Boys Doing Cute Things", "Cute Girls Doing Cute Things", "Family Life", "Iyashikei"];

  let listTags = {
    'Cast / Main Cast': listTagCast, 'Cast / Traits': listTagCastTraits, 'Demographic': listTagDemographic, 'Setting / Scene': listTagScene,
    'Setting / Time': listTagTime, 'Setting / Universe': listTagUniverse, 'Technical': listTagTechnical, 'Theme': listTagTheme,
    'Theme / Action': listTagThemeAction, 'Theme / Arts': listTagThemeArt, 'Theme / Arts-Music': listTagThemeArtMusic,
    'Theme / Comedy': listTagThemeComedy, 'Theme / Drama': listTagThemeDrama, 'Theme / Fantasy': listTagThemeFantasy,
    'Theme / Game': listTagThemeGame,
    'Theme / Game-Card & Game-Board': listTagThemeGameCardBoardGame, 'Theme / Game-Sport': listTagThemeGameSport, 'Theme / Other': listTagThemeOther,
    'Theme / Other-Organisations': listTagOtherOrg, 'Theme / Other-Vehicle': listTagOtherVehicle, 'Theme / Romance': listTagRomance,
    'Theme / Sci Fi': listTagSci, 'Theme / Sci Fi-Mecha': listTagMecha, 'Theme / Slice Of Life': listTagSliceOfLife
  };

  document.querySelector('.select-field-tag').addEventListener('click', () => {
    let listChildren = document.getElementById("tag-list").children;
    for (let j = 0; j < listChildren.length; j++) {
      listChildren[j].style.display = "block";
      for (let i = 0; i < listChildren[j].children.length; i++) {
        listChildren[j].children[i].style.display = "block";
      }
    }
    document.querySelector('#tag-list').classList.toggle('show');
    tagOpen = !tagOpen;
    document.querySelector('.down-arrow-tag').classList.toggle('rotate180');
  });


  addSelectorTags("tag-list", "tags-genre", listTags, "tag-selector");
  document.getElementById("tag-selector").addEventListener('input', searchInTagg.bind(null, "tag-list", "tag-selector", 'down-arrow-tag'));
  

window.addEventListener('click', function(e){
  if (tagOpen && !document.getElementById('tag-list').contains(e.target) && !document.getElementById('tag-selector-toggle').contains(e.target)) {
    document.querySelector('#tag-list').classList.toggle('show');
    document.querySelector('.down-arrow-tag').classList.toggle('rotate180');
    tagOpen = false;
  }
});