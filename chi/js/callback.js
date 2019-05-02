// Asynchronous functions

function collectSeasonalVAsCallback(data) {

  let vaTableBody = document.getElementById("va-table-body");
  let asyncCount = vaTableBody.getAttribute("data-async-count");

  // keep running collection of VAs
  window.voiceActors = extractVAs(window.voiceActors, data);

  if (asyncCount) {
    asyncCount = parseInt(asyncCount);
    asyncCount++;
    vaTableBody.setAttribute("data-async-count", asyncCount);
    if (asyncCount == window.mediaFormats.length) {
      sortedVoiceActors = sortVAsByNumRoles(voiceActors);
      fillVATableAndPage(sortedVoiceActors);
      vaTableBody.setAttribute("data-async-count", 0);
      unlock();
    }
  } else {
    vaTableBody.setAttribute("data-async-count", 1);
  }

}

function collectVASearchResultsCallback(data) {
  collectVASearchResults(data);
  document.getElementById("page-tracker").innerHTML = "1/1";
  unlock();
}

// Allows for empty response reporting and unlocking
// after all parallel requests are finished.
function collectSeasonalRolesCallback(voiceActorId, data) {

  collectSeasonalRoles(voiceActorId, data);

  let rolesTableBody = document.getElementById("roles-table-body");
  let asyncCount = rolesTableBody.getAttribute("data-async-count");

  if (asyncCount) {
    asyncCount = parseInt(asyncCount);
    rolesTableBody.setAttribute("data-async-count", asyncCount + 1);
    if ((asyncCount + 1) == window.mediaFormats.length) {
      rolesTableBody.setAttribute("data-async-count", 0);
      if (rolesTableBody.innerHTML == "") {
        addNoResultsIndicator("roles-table-body");
      }
      unlock();
    }
  } else {
    rolesTableBody.setAttribute("data-async-count", 1);
  }

}

function collectFollowingCallback(numFollowing, data) {

  let staff = data.data.Staff;
  let metadata = {
    id: staff.id,
    name: parsedName(staff.name),
    url: staff.siteUrl
  }

  addFollowTableEntry(metadata);

  let numEntries = document.getElementById("follow-table-body").children.length;
  if (numEntries == numFollowing) {
    unlock();
  }

}

/*** RACE CONDITION PREVENTION FUNCTIONS (old) ***/

// Request additional data for first N sorted voice actors, in order
// N  = numIterations in asyncMetadata
function requestVAsInOrder(asyncMetadata) {
  if (asyncMetadata.numIterations > 0) {
    let variables = { id: asyncMetadata.VAs[0][0] };
    let newAsyncMetadata = {
      numIterations: asyncMetadata.numIterations - 1,
      VAs: asyncMetadata.VAs.slice(1) // remove first element
    };
    makeRequest(getQuery("VA ID"), variables, newAsyncMetadata, addVATableEntryInOrder);
  }
}

function addVATableEntryInOrder(asyncMetadata, data) {
  let staffData = data.data.Staff;
  let metadata = {
    name: parsedName(staffData.name),
    image: staffData.image.medium,
    url: staffData.siteUrl
  };
  addVATableEntry(metadata);
  requestVAsInOrder(asyncMetadata);

}