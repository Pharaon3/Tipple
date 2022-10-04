// ssr compatible in memory local store
const store = {};

export const setItem = (key, value) => {
  if (typeof localStorage === 'undefined' || localStorage === null)  {
    store[key] = value;
  } else {
    localStorage.setItem(key, value);
  }
}

export const getItem = (key) => {
  if (typeof localStorage === 'undefined' || localStorage === null)  {
    return store[key];
  } 
  return localStorage.getItem(key);
}