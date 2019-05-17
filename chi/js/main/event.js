window.onload = function() {

  lock();
  buildDisplayModes();

  let body = document.getElementsByTagName("body")[0];
  let defaultTheme = "light";

  let hasStorageAccess = setStorageState();  // handle browser disabling cookies
  if (hasStorageAccess) {
    let themeIsSet = setThemeFromStorage();
    if (!themeIsSet) {
      body.classList.add(defaultTheme);
    }
  }
  else {
    body.classList.add(defaultTheme);
  }

  setOnEvents();
  setDescription();
  buildSeasonPickers();
  buildLanguageFilter();
  clearSearchBar();
  clearTransferBox();

  clearVATable();  // For those with itchy trigger fingers
  setSeason("", "");  // Set to current season

  populateVATableWithSeason();
  if (hasStorageAccess) { lock(); populateFollowTable(); }

}

function setOnEvents() {
  setOnClicks();
  setOnKeyPresses();
  window.onresize = function() {
    window.currentDisplay.resetFixedDimensions();
  }
}

function setOnClicks() {

  let searchButton = document.getElementById("search-button");
  let refreshButton = document.getElementById("refresh-button");
  let displayModeSwitch = document.getElementById("display-mode-switch");
  let darkModeSwitch = document.getElementById("dark-mode-switch");
  let leftTableSwitch = document.getElementById("left-table-switch");
  let importButton = document.getElementById("import-button");
  let exportButton = document.getElementById("export-button");
  let returnButton = document.getElementById("return-button");
  let allCharactersSwitch = document.getElementById("all-characters-switch");

  searchButton.onclick = function() { searchButtonOnClick(); }
  refreshButton.onclick = function() { refreshButtonOnClick(); }
  displayModeSwitch.onclick = function() { displayModeSwitchOnClick(); }
  darkModeSwitch.onclick = function() { darkModeSwitchOnClick(); }
  leftTableSwitch.onclick = function() { leftTableSwitchOnClick(); }
  importButton.onclick = function() { importButtonOnClick(); }
  exportButton.onclick = function() { exportButtonOnClick(); }
  returnButton.onclick = function() { returnButtonOnClick(); }
  allCharactersSwitch.onclick = function() { allCharactersSwitchOnClick(); }
  setNavigationOnClicks();

}

function setOnKeyPresses() {

  let searchBar = document.getElementById("search-bar");
  let ENTER = 13;

  searchBar.addEventListener("keyup", function(event) {
    if (event.keyCode == ENTER) {
      searchButtonOnClick();
    }
  });

}

function leftTableSwitchOnClick() {

  let vaTable = window.currentDisplay.vaTable;
  let followTable = window.currentDisplay.followTable;
  let followTableBody = window.currentDisplay.followTableBody;

  let searchBar = document.getElementById("search-bar");
  let searchButton = document.getElementById("search-button");
  let refreshButton = document.getElementById("refresh-button");

  let navDiv = document.getElementById("navigation");
  let tranferDiv = document.getElementById("transfer");

  // switch to VAs
  if (vaTable.style.display == "none") {

    // make sure follow states are up-to-date
    // because refetching everything > writing a new function
    changed = followTableBody.getAttribute("data-changed");
    if (changed == "true") {
      clearVATable();
      populateVATableWithSeason();
      followTableBody.setAttribute("data-changed", "false");
    }

    // there's probably a better way to turn these all off
    vaTable.style.display = "";
    followTable.style.display = "none";
    searchBar.disabled = false;
    searchButton.disabled = false;
    refreshButton.classList.remove("disabled");
    navDiv.style.display = "";
    tranferDiv.style.display = "none";

  }
  // switch to follows
  else {
    vaTable.style.display = "none";
    followTable.style.display = "";
    searchBar.disabled = true;
    searchButton.disabled = true;
    refreshButton.classList.add("disabled");
    navDiv.style.display = "none";
    tranferDiv.style.display = "";
  }

}

function refreshButtonOnClick() {
  if (!isLocked()) {
    lock();
    document.getElementById("search-bar").value = "";
    clearVATable();
    clearRolesTable();
    unclick();
    populateVATableWithSeason();
  }
}
