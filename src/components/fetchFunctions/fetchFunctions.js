//helper to construct URL without credentials
const getApiUrl = (path) => {
  const loc = window.location;
  return `${loc.protocol}//${loc.host}${path}`;
};

//connector?
export const getData = async (url, filters) => {
  try {
    let filterParams = "";
    //fetch() returns promise
    if (filters) {
      filterParams = "?" + JSON.stringify(filters);
    }
    const fullUrl = getApiUrl(url + filterParams);
    const result = await fetch(fullUrl);
    //result with non-ok status
    if (!result.ok) {
      throw Error("Fetch data from server error: " + result.statusText);
    }
    //result.json(); returns promise
    const data = await result.json();
    return data;
  } catch (err) {
    void err;
  }
};

export const addData = async (url, item) => {
  try {
    const fullUrl = getApiUrl(url);
    const result = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      //what I post as json-format
      body: JSON.stringify(item),
    });
    if (!result.ok) {
      throw Error("Fetch data error: " + result.statusText);
    }
    const data = await result.json();
    return data;
  } catch (err) {
    void err;
  }
};

export const updateData = async (url, updItem) => {
  try {
    const fullUrl = getApiUrl(url);
    const result = await fetch(fullUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      //what I post as json-format
      body: JSON.stringify(updItem),
    });
    if (!result.ok) {
      throw Error("Fetch data error: " + result.statusText);
    }
    const data = await result.json();
    return data;
  } catch (err) {
    void err;
  }
};

export const deleteData = async (url, id) => {
  url = url.endsWith("/") ? url : url + "/";
  try {
    const fullUrl = getApiUrl(url + id);
    const result = await fetch(fullUrl, {
      method: "DELETE",
    });
    if (!result.ok) {
      throw Error("Fetch data error: " + result.statusText);
    }
    const data = await result.json();
    return data;
  } catch (err) {
    void err;
  }
};
