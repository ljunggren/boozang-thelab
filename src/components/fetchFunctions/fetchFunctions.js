//connector?
export const getData = async (url, filters) => {
  try {
    let filterParams = "";
    //fetch() returns promise
    if (filters) {
      filterParams = "?" + JSON.stringify(filters);
    }
    const result = await fetch(url + filterParams);
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
    const result = await fetch(url, {
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
    const result = await fetch(url, {
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
    const result = await fetch(url + id, {
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
