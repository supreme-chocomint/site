// Table caption, table heads, and div headers are assumed to be
// unique, and thus are NOT part properties of displays (although they
// are NOT accessed outside of the display objects) and are accessed by ID
// instead of class like everything else

var Minimalist = {

  name: "minimalist",
  tablePageSize: 5,

  init() {

    this.vaTable = document.querySelector(".minimalist.va-table");
    this.vaTableBody = document.querySelector(".minimalist.va-table-body");
    this.followTable = document.querySelector(".minimalist.follow-table");
    this.followTableBody = document.querySelector(".minimalist.follow-table-body");
    this.rolesTable = document.querySelector(".minimalist.roles-table");
    this.rolesTableBody = document.querySelector(".minimalist.roles-table-body");

    this.vaPopularTableBody = document.querySelector(".minimalist.va-popular-characters-body");
    this.vaUWTableBody = document.querySelector(".minimalist.va-uw-characters-body");
    this.vaMainTableBody = document.querySelector(".minimalist.va-main-characters-body");
    this.vaSupportTableBody = document.querySelector(".minimalist.va-support-characters-body");

  },

  activate() {

    document.getElementById("va-left-container").classList.add("minimalist");
    document.getElementById("va-right-container").classList.add("minimalist");
    document.getElementById("va-bottom-container").classList.add("minimalist");
    document.getElementById("left-col").classList.add("minimalist");
    document.getElementById("right-col").classList.add("minimalist");

    let subs = document.getElementById("va-bottom-container").children;
    for (let sub of subs) {
      sub.classList.add("one-half");
      sub.classList.add("column");
    }

    let detailsPage = document.getElementById("va-info-container");
    let tables = detailsPage.querySelectorAll("table.minimalist");
    for (let table of tables) {
      table.style.display = "";
    }

  },

  deactivate() {

    document.getElementById("va-left-container").classList.remove("minimalist");
    document.getElementById("va-right-container").classList.remove("minimalist");
    document.getElementById("va-bottom-container").classList.remove("minimalist");
    document.getElementById("left-col").classList.remove("minimalist");
    document.getElementById("right-col").classList.remove("minimalist");

    let subs = document.getElementById("va-bottom-container").children;
    for (let sub of subs) {
      sub.classList.remove("one-half");
      sub.classList.remove("column");
    }

    let detailsPage = document.getElementById("va-info-container");
    let tables = detailsPage.querySelectorAll("table.minimalist");
    for (let table of tables) {
      table.style.display = "none";
    }

  },

  // ---- Mutators ---- //

  addFollowTableEntry(metadata) {

    let row = document.createElement("tr");
    let nameCol = document.createElement("td");
    let name = document.createElement("a");
    let urlCol = document.createElement("td");
    let url = document.createElement("a");
    let deleteCol = document.createElement("td");
    let deleteLink = document.createElement("a");

    row.id = metadata.id;
    name.classList.add(metadata.id);  // for coordinating with VA table
    if (window.clicked == metadata.id) {
      name.classList.add("clicked");
    }

    name.innerHTML = metadata.name;
    name.href = "javascript:void(0)";
    name.onclick = function() {VADetailsOnClick(metadata.id)};

    url.innerHTML = "Show All";
    url.href = "javascript:void(0)";
    url.classList.add("internal_link");
    url.onclick = function() {VAOnClick(metadata.id)};

    deleteLink.innerHTML = "&times;";
    deleteLink.href = "javascript:void(0)";
    deleteCol.classList.add("symbol");
    deleteLink.classList.add("symbol");
    deleteLink.onclick = function() {
      unfollow(metadata);
    }

    nameCol.appendChild(name);
    urlCol.appendChild(url);
    deleteCol.appendChild(deleteLink);
    row.appendChild(nameCol);
    row.appendChild(urlCol);
    row.appendChild(deleteCol);
    this.followTableBody.appendChild(row);

  },

  addNoResultsIndicator(tableId) {
    let row = document.createElement("tr");
    this.appendNACells(row, 2);
    if (tableId == "va-table-body") {
      this.vaTableBody.appendChild(row);
    } else if (tableId == "roles-table-body"){
      this.rolesTableBody.appendChild(row);
    }
  },

  appendNACells(row, numCol) {
    for (let i = 0; i < numCol; i++) {
      let col = document.createElement("td");
      col.innerHTML = "N/A";
      row.appendChild(col);
    }
  },

  addVATableEntry(metadata) {

    let row = document.createElement("tr");
    let nameCol = document.createElement("td");
    let name = document.createElement("a");
    let imageCol = document.createElement("td");
    let image = document.createElement("img");
    let linkCol = document.createElement("td");
    let link = document.createElement("a");
    let numRolesCol = document.createElement("td");
    let numRoles = document.createElement("span");
    let followCol = document.createElement("td");
    let followState = document.createElement("a");

    name.innerHTML = metadata.name;
    name.href = "javascript:void(0)";
    name.onclick = function() {VADetailsOnClick(metadata.id)};
    nameCol.appendChild(name);
    row.appendChild(nameCol);

    image.src = metadata.image;
    image.alt = metadata.name;
    image.style.display = "none";
    imageCol.appendChild(image);

    link.innerHTML = "Show All";
    link.href = "javascript:void(0)";
    link.classList.add("internal_link");
    link.onclick = function() {VAOnClick(metadata.id)};
    linkCol.appendChild(link);
    row.appendChild(linkCol);

    numRolesInt = window.seasonalRolesCounter[metadata.id];
    if (numRolesInt) {
      numRoles.innerHTML = numRolesInt;
      numRolesCol.appendChild(numRoles);
      row.appendChild(numRolesCol);
    }

    if (isFollowed(metadata.id)) { followState.innerHTML = "★"; }
    else { followState.innerHTML = "☆"; }
    followState.href = "javascript:void(0)";
    followState.classList.add("symbol");  // makes character larger
    followCol.classList.add("symbol");  // centers character
    followState.onclick = function() {
      followState.innerHTML = toggleFollow(metadata);
    }

    name.classList.add(metadata.id);
    if (window.clicked == metadata.id) {
      name.classList.add("clicked");
    }
    followCol.appendChild(followState);
    row.appendChild(followCol);

    row.classList.add(metadata.language);
    this.vaTableBody.appendChild(row);

  },

  setVATableSize(numElements) {

    let vaTableHeaderRoles = document.getElementById("va-table-head-roles");
    let vaTableHeaderFollow = document.getElementById("va-table-head-follow");
    let vaTableState = this.vaTable.getAttribute("data-state");

    if (numElements == 0){
      vaTableHeaderRoles.style.display = "none";
      vaTableHeaderFollow.style.display = "none";
      addNoResultsIndicator("va-table-body");
    }

    else if (vaTableState == "search") {
      vaTableHeaderRoles.style.display = "none";
      vaTableHeaderFollow.style.display = "";
    }

    else {
      vaTableHeaderRoles.style.display = "";
      vaTableHeaderFollow.style.display = "";
    }
  },

  setVATableHeader(header) {
    let vaTableCaption = document.getElementById("va-table-caption");
    vaTableCaption.setAttribute("data-content", header);
  },

  addRolesTableEntry(metadata) {

    let row = document.createElement("tr");
    let showNameCol = document.createElement("td");
    let showName = document.createElement("a");
    let charaNameCol = document.createElement("td");
    let charaName = document.createElement("a");

    showName.innerHTML = metadata.showName;
    showName.href = metadata.showUrl;
    showName.target = "_blank";  // open in new tab
    charaName.innerHTML = metadata.characterName;
    charaName.href = metadata.characterUrl;
    charaName.target = "_blank";  // open in new tab

    showNameCol.appendChild(showName);
    charaNameCol.appendChild(charaName);
    row.appendChild(showNameCol);
    row.appendChild(charaNameCol);
    this.rolesTableBody.appendChild(row);

  },

  setRolesTableHeader(header) {
    let rolesTableCaption = document.getElementById("roles-table-caption");
    rolesTableCaption.setAttribute("data-content", header);
  },

  addCharacterEntry(containerId, role) {

    let character = role.character;
    let show = role.show;
    let tableBody;

    switch (containerId) {
      case "va-popular-characters":
        tableBody = this.vaPopularTableBody;
        break;
      case "va-uw-characters":
        tableBody = this.vaUWTableBody;
        break;
      case "va-main-characters":
        tableBody = this.vaMainTableBody;
        break;
      case "va-support-characters":
        tableBody = this.vaSupportTableBody;
        break;
    }

    let row = document.createElement("tr");
    let charaCol = document.createElement("td");
    let characterLink = document.createElement("a");
    let showCol = document.createElement("td");
    let showLink = document.createElement("a");

    characterLink.href = character.url;
    characterLink.target = "_blank";
    characterLink.innerHTML = character.name;
    characterLink.style.fontWeight = 'bold';
    charaCol.appendChild(characterLink);
    row.appendChild(charaCol);

    showLink.href = show.siteUrl;
    showLink.target = "_blank";
    showLink.innerHTML = show.title.romaji;
    showCol.appendChild(showLink);
    row.appendChild(showCol);

    tableBody.appendChild(row);

  },

  styleCharacterEntries(elementId) {},  // do nothing b/c they're table cells

  clearSideContainers() {
    this.vaPopularTableBody.innerHTML = "";
    this.vaUWTableBody.innerHTML = "";
  },

  clearButtomContainer() {
    this.vaMainTableBody.innerHTML = "";
    this.vaSupportTableBody.innerHTML = "";
  }

}

var Grid = {

  name: "grid",
  tablePageSize: 6,

  init() {

    /*
    this.vaTable = document.querySelector(".grid.va-table");
    this.vaTableBody = document.querySelector(".grid.va-table-body");
    this.followTable = document.querySelector(".grid.follow-table");
    this.followTableBody = document.querySelector(".grid.follow-table-body");
    this.rolesTable = document.querySelector(".grid.roles-table");
    this.rolesTableBody = document.querySelector(".grid.roles-table-body");
    */
    this.vaTable = document.querySelector(".minimalist.va-table");
    this.vaTableBody = document.querySelector(".minimalist.va-table-body");
    this.followTable = document.querySelector(".minimalist.follow-table");
    this.followTableBody = document.querySelector(".minimalist.follow-table-body");
    this.rolesTable = document.querySelector(".minimalist.roles-table");
    this.rolesTableBody = document.querySelector(".minimalist.roles-table-body");

    this.vaPopularTableBody = document.querySelector(".grid.va-popular-characters-body");
    this.vaUWTableBody = document.querySelector(".grid.va-uw-characters-body");
    this.vaMainTableBody = document.querySelector(".grid.va-main-characters-body");
    this.vaSupportTableBody = document.querySelector(".grid.va-support-characters-body");

  },

  activate() {

    document.getElementById("va-left-container").classList.add("grid");
    document.getElementById("va-right-container").classList.add("grid");
    document.getElementById("va-bottom-container").classList.add("grid");
    document.getElementById("left-col").classList.add("grid");
    document.getElementById("right-col").classList.add("grid");

  },

  deactivate() {

    document.getElementById("va-left-container").classList.remove("grid");
    document.getElementById("va-right-container").classList.remove("grid");
    document.getElementById("va-bottom-container").classList.remove("grid");
    document.getElementById("left-col").classList.remove("grid");
    document.getElementById("right-col").classList.remove("grid");

  },

  addFollowTableEntry(metadata) {

    let row = document.createElement("tr");
    let nameCol = document.createElement("td");
    let name = document.createElement("a");
    let urlCol = document.createElement("td");
    let url = document.createElement("a");
    let deleteCol = document.createElement("td");
    let deleteLink = document.createElement("a");

    row.id = metadata.id;
    name.classList.add(metadata.id);  // for coordinating with VA table
    if (window.clicked == metadata.id) {
      name.classList.add("clicked");
    }

    name.innerHTML = metadata.name;
    name.href = "javascript:void(0)";
    name.onclick = function() {VADetailsOnClick(metadata.id)};

    url.innerHTML = "Show All";
    url.href = "javascript:void(0)";
    url.classList.add("internal_link");
    url.onclick = function() {VAOnClick(metadata.id)};

    deleteLink.innerHTML = "&times;";
    deleteLink.href = "javascript:void(0)";
    deleteCol.classList.add("symbol");
    deleteLink.classList.add("symbol");
    deleteLink.onclick = function() {
      unfollow(metadata);
    }

    nameCol.appendChild(name);
    urlCol.appendChild(url);
    deleteCol.appendChild(deleteLink);
    row.appendChild(nameCol);
    row.appendChild(urlCol);
    row.appendChild(deleteCol);
    this.followTableBody.appendChild(row);

  },

  addNoResultsIndicator(tableId) {
    let row = document.createElement("tr");
    this.appendNACells(row, 2);
    if (tableId == "va-table-body") {
      this.vaTableBody.appendChild(row);
    } else if (tableId == "roles-table-body"){
      this.rolesTableBody.appendChild(row);
    }
  },

  appendNACells(row, numCol) {
    for (let i = 0; i < numCol; i++) {
      let col = document.createElement("td");
      col.innerHTML = "N/A";
      row.appendChild(col);
    }
  },

  addVATableEntry(metadata) {

    let row = document.createElement("tr");
    let nameCol = document.createElement("td");
    let name = document.createElement("a");
    let imageCol = document.createElement("td");
    let image = document.createElement("img");
    let linkCol = document.createElement("td");
    let link = document.createElement("a");
    let numRolesCol = document.createElement("td");
    let numRoles = document.createElement("span");
    let followCol = document.createElement("td");
    let followState = document.createElement("a");

    name.innerHTML = metadata.name;
    name.href = "javascript:void(0)";
    name.onclick = function() {VADetailsOnClick(metadata.id)};
    nameCol.appendChild(name);
    row.appendChild(nameCol);

    image.src = metadata.image;
    image.alt = metadata.name;
    image.style.display = "none";
    imageCol.appendChild(image);

    link.innerHTML = "Show All";
    link.href = "javascript:void(0)";
    link.classList.add("internal_link");
    link.onclick = function() {VAOnClick(metadata.id)};
    linkCol.appendChild(link);
    row.appendChild(linkCol);

    numRolesInt = window.seasonalRolesCounter[metadata.id];
    if (numRolesInt) {
      numRoles.innerHTML = numRolesInt;
      numRolesCol.appendChild(numRoles);
      row.appendChild(numRolesCol);
    }

    if (isFollowed(metadata.id)) { followState.innerHTML = "★"; }
    else { followState.innerHTML = "☆"; }
    followState.href = "javascript:void(0)";
    followState.classList.add("symbol");  // makes character larger
    followCol.classList.add("symbol");  // centers character
    followState.onclick = function() {
      followState.innerHTML = toggleFollow(metadata);
    }

    name.classList.add(metadata.id);
    if (window.clicked == metadata.id) {
      name.classList.add("clicked");
    }
    followCol.appendChild(followState);
    row.appendChild(followCol);

    row.classList.add(metadata.language);
    this.vaTableBody.appendChild(row);

  },

  setVATableSize(numElements) {

    let vaTableHeaderRoles = document.getElementById("va-table-head-roles");
    let vaTableHeaderFollow = document.getElementById("va-table-head-follow");
    let vaTableState = this.vaTable.getAttribute("data-state");

    if (numElements == 0){
      vaTableHeaderRoles.style.display = "none";
      vaTableHeaderFollow.style.display = "none";
      addNoResultsIndicator("va-table-body");
    }

    else if (vaTableState == "search") {
      vaTableHeaderRoles.style.display = "none";
      vaTableHeaderFollow.style.display = "";
    }

    else {
      vaTableHeaderRoles.style.display = "";
      vaTableHeaderFollow.style.display = "";
    }
  },

  setVATableHeader(header) {
    let vaTableCaption = document.getElementById("va-table-caption");
    vaTableCaption.setAttribute("data-content", header);
  },

  addRolesTableEntry(metadata) {

    let row = document.createElement("tr");
    let showNameCol = document.createElement("td");
    let showName = document.createElement("a");
    let charaNameCol = document.createElement("td");
    let charaName = document.createElement("a");

    showName.innerHTML = metadata.showName;
    showName.href = metadata.showUrl;
    showName.target = "_blank";  // open in new tab
    charaName.innerHTML = metadata.characterName;
    charaName.href = metadata.characterUrl;
    charaName.target = "_blank";  // open in new tab

    showNameCol.appendChild(showName);
    charaNameCol.appendChild(charaName);
    row.appendChild(showNameCol);
    row.appendChild(charaNameCol);
    this.rolesTableBody.appendChild(row);

  },

  setRolesTableHeader(header) {
    let rolesTableCaption = document.getElementById("roles-table-caption");
    rolesTableCaption.setAttribute("data-content", header);
  },

  addCharacterEntry(containerId, role) {

    let character = role.character;
    let show = role.show;

    let container = this.getCharacterContainer(containerId);
    let div = document.createElement("div");
    let thumbnail = document.createElement("div");
    let text = document.createElement("p");
    let characterLink = document.createElement("a");
    let showLink = document.createElement("a");

    thumbnail.style.backgroundImage = `url(${character.image})`;
    thumbnail.classList.add("thumbnail");
    thumbnail.onclick = function() { characterThumbnailOnClick(this); };
    div.appendChild(thumbnail);

    characterLink.href = character.url;
    characterLink.target = "_blank";
    characterLink.innerHTML = character.name;
    characterLink.style.fontWeight = 'bold';
    text.appendChild(characterLink);

    text.innerHTML += "<br>";

    showLink.href = show.siteUrl;
    showLink.target = "_blank";
    showLink.innerHTML = show.title.romaji;
    text.appendChild(showLink);

    text.classList.add("thumbnail-caption");
    div.appendChild(text);

    div.classList.add("thumbnail-wrapper");
    container.appendChild(div);

  },

  getCharacterContainer(id) {
    switch (id) {
      case "va-popular-characters":
        return this.vaPopularTableBody;
      case "va-uw-characters":
        return this.vaUWTableBody;
      case "va-main-characters":
        return this.vaMainTableBody;
      case "va-support-characters":
        return this.vaSupportTableBody;
    }
  },

  styleCharacterEntries(elementId) {

    // --- Make captions same width as thumbnails --- //

    let thumbnail = document.getElementById(elementId).getElementsByClassName("thumbnail")[0];
    let style = window.getComputedStyle(thumbnail);

    let captions = document.getElementById(elementId).getElementsByClassName("thumbnail-caption");
    for (let caption of captions) {
      caption.style.width = style.width;
    }

  },

  clearSideContainers() {
    this.vaPopularTableBody.innerHTML = "";
    this.vaUWTableBody.innerHTML = "";
  },

  clearButtomContainer() {
    this.vaMainTableBody.innerHTML = "";
    this.vaSupportTableBody.innerHTML = "";
  }

}
