// Functions for sending queries to and receiving responses from AniList

function getQuery(type) {

  let voiceActorBasicFragment = `
    id
    name {
      first
      last
    }
    siteUrl
    language
    image {
      large
    }
  `;
  let voiceActorCompleteFragment = `
    id
    name {
      first
      last
      native
    }
    language
    siteUrl
    image {
      large
    }
    favourites
    characters (sort: FAVOURITES_DESC, page: $pageNum) {
      pageInfo {
        hasNextPage
        currentPage
        lastPage
      }
      edges {
        role
        id
        media {
          id
          title {
            romaji
            english
            native
            userPreferred
          }
          popularity
          meanScore
          siteUrl
        }
      }
      nodes {
        id
        name {
          first
          last
          native
        }
        favourites
        image {
          large
        }
        siteUrl
        media {
          edges {
            id
          }
        }
      }
    }

  `;

  let staffSearchQuery = `
  query ($page: Int, $perPage: Int, $search:String) {

    Page (page: $page, perPage: $perPage) {

      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }

      staff (search: $search) {
        id
        name {
          first
          last
        }
        siteUrl
        language
        image {
          large
        }
        characters (perPage: 1) {
          nodes {
            id
          }
        }
      }
    }

  }
  `;
  let characterSearchQuery = `
  query ($page: Int, $perPage: Int, $search:String) {

    Page (page: $page, perPage: $perPage) {

      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }

      characters (search: $search) {
        id
        name {
          first
          last
        }
        siteUrl
        image {
          large
        }
        media (sort: POPULARITY_DESC) {
          nodes {
            id
          }
        }
      }
    }

  }
  `;
  let animeSearchQuery = `
  query ($page: Int, $perPage: Int, $search:String) {

    Page (page: $page, perPage: $perPage) {

      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }

      media (search: $search, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        siteUrl
        isAdult
        coverImage {
          large
        }
      }
    }

  }
  `;

  let characterIdQuery = `
  query ($id: Int) {
    Character (id: $id) {
      id
      name {
        first
        last
        native
      }
      image {
        large
      }
      favourites
      siteUrl
      media (sort: POPULARITY_DESC, perPage: 1) {
        edges {
          characterRole
        }
        nodes {
          id
          title {
            romaji
            english
            native
            userPreferred
          }
          popularity
          meanScore
          siteUrl
        }
      }
    }
  }
  `;

  let mediaIdRolesQuery = `
  query ($id: Int) {
  Media (id: $id) {
    title {
      romaji
      english
      native
      userPreferred
    }
    siteUrl
    characters (sort: FAVOURITES_DESC) {
      edges {
        id
        voiceActors {
          id
          name {
            first
            last
            native
          }
          language
          image {
            large
          }
        }
        node {
          id
          siteUrl
          name {
            first
            last
            native
          }
          image {
            large
          }
        }
      }
    }
  }
}
  `;

  let fullSeasonDataQuery = `
  query ($season: MediaSeason!, $seasonYear: Int!, $page: Int, $perPage: Int, $format: MediaFormat!) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(season: $season, seasonYear: $seasonYear, format: $format, type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          romaji
        }
        coverImage {
          medium
        }
        siteUrl
        characters {
          edges {
            id
            role
            voiceActors { ` + voiceActorBasicFragment +
            `}
            node {
              id
              name {
                first
                last
                native
              }
              image {
                large
              }
              siteUrl
            }
          }
        }
      }
    }
  }
  `;
  let staffIdQuery = `
  query ($id: Int, $pageNum: Int) {
    Staff (id: $id) {` + voiceActorCompleteFragment +
    `}
  }
  `;

  switch (type) {
    case "VA SEARCH":
      return staffSearchQuery;
    case "ANIME SEARCH":
      return animeSearchQuery;
    case "CHARACTER SEARCH":
      return characterSearchQuery;
    case "VA ID":
      return staffIdQuery;
    case "CHARACTER ID":
      return characterIdQuery;
    case "MEDIA ID ROLES":
      return mediaIdRolesQuery;
    default:
      return fullSeasonDataQuery;
  }

}

function makeRequest(query, variables, callback) {

  let url = 'https://graphql.anilist.co',
      options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({
              query: query,
              variables: variables
          })
      };

  fetch(url, options).then(handleResponse)
                     .then(function(data){ callback(data) })
                     .catch(handleError);
}

function handleResponse(response) {
  return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
  });
}

function handleError(error) {
  alert("Error. See console for more details.");
  console.error(error);
}
