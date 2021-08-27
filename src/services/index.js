import axios from "axios";

const apiAgileEngine = axios.create({
  baseURL: "http://interview.agileengine.com",
  withCredentials: false,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

//add a request interceptor
apiAgileEngine.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    //console.log("request", config);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function refreshAccessToken(data) {
  console.log(data);
}

// Add a response interceptor
apiAgileEngine.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      let datas = {
        apiKey: "23567b218376f79d9415",
      };
      const access_token = refreshAccessToken(datas);
      // add refresh access token
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + access_token.data.datas.token;
      return apiAgileEngine(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default {
  async postAuthToken(formData) {
    return await apiAgileEngine
      .post("/auth", formData)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  },

  async refreshAccessToken(formData) {
    return await apiAgileEngine
      .post("/auth", formData)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  },

  async getImages(token, page) {
    const config = {
      headers: {
        Accept: "application/json",
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    };

    return await apiAgileEngine
      .get("/images?page=" + page, config)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  },

  async getImagesID(token, id) {
    const config = {
      headers: {
        Accept: "application/json",
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    };

    return await apiAgileEngine
      .get("/images/" + id, config)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  },
};
