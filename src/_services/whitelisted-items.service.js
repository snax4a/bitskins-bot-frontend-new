import { fetchWrapper } from "_helpers";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const baseUrl = `${API_URL}/whitelisteditems`;
const WIKI_API_URL = "https://wiki.cs.money/graphql";

export const whitelistedItemsService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  getWikiData
};

function getAll() {
  return fetchWrapper.get(baseUrl);
}

function getById(id) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
  return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
  return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
  return fetchWrapper.delete(`${baseUrl}/${id}`);
}

function getWikiData(name) {
  const body = {
    "operationName": "search_ten",
    "variables": {
        "q": name,
        "lang": "en"
    },
    "query": "query search_ten($q: String!, $lang: String!) {search_ten(q: $q, lang: $lang) { skins {_id name image }}}"
  }

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "omit",
    body: JSON.stringify(body),
  };

  return fetch(WIKI_API_URL, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
