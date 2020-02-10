/**
 * Takes an object and turns it into an URL string. Used to make GET requests.
 *
 * @param data Data to encode.
 * @returns URL encoded string.
 */
export const encodeUrlData = data => {
  return Object.keys(data)
    .map(key => {
      return [key, data[key]].map(encodeURIComponent).join("=");
    })
    .join("&");
};

export const GetBackendURL = () => {
  return "https://localhost:44340";
};

export const datediff = (first, second) => {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
};
