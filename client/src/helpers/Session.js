const Session = {
  setCookie: (key, value) => {
    if (typeof key === "string" && typeof value === "string") {
      const d = new Date();
      d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
      const expires = "expires=" + d.toUTCString();
      document.cookie = `${key}=${value}; ${expires}; path=/; SameSite=Strict; secure;`;
    } else {
      console.error("Key and value must be of type string");
    }
  },

  removeCookie: (key) => {
    if (typeof key === "string") {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict; secure;`;
    } else {
      console.error("Key must be of type string");
    }
  },

  setLocalStorage: (key, value) => {
    if (typeof key === "string" && typeof value === "string") {
      localStorage.setItem(key, value);
    } else {
      console.error("Key and value must be of type string");
    }
  },

  removeLocalStorage: (key) => {
    if (typeof key === "string") {
      localStorage.removeItem(key);
    } else {
      console.error("Key must be of type string");
    }
  },

  getCookie: (key) => {
    if (typeof key !== "string" || key.trim() === "") {
      console.error("Invalid key provided. Key must be a non-empty string.");
      return null;
    }

    const name = key + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");

    if (!ca || ca.length === 0) {
      console.warn("No cookies found.");
      return null;
    }

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }

    console.warn(`Cookie with key '${key}' not found.`);
    return null;
  }
  ,

  getLocalStorage: (key) => {
    if (typeof key === "string") {
      return localStorage.getItem(key);
    } else {
      console.error("Key must be of type string");
      return null;
    }
  },

  addCache: async (key, value) => {
    if (typeof key === "string" && value instanceof Blob) {
      const cache = await caches.open("image-cache");
      const response = new Response(value);
      await cache.put(key, response);
    } else {
      console.error("Key must be of type string and value must be a Blob");
    }
  },

  getCache: async (key) => {
    if (typeof key === "string") {
      const cache = await caches.open("image-cache");
      const response = await cache.match(key);
      if (response) {
        return response.blob();
      }
    } else {
      console.error("Key must be of type string");
    }
  },


  updateCache: async (key, value) => {
    if (typeof key === "string" && typeof value === "string") {
      const cache = await caches.open("image-cache");
      const response = await cache.match(key);
      if (response) {
        await cache.delete(key);
        await cache.put(key, new Response(value));
      } else {
        console.error(`Key "${key}" not found in cache`);
      }
    } else {
      console.error("Key and value must be of type string");
    }
  },

  deleteCache: async (key) => {
    if (typeof key === "string") {
      const cache = await caches.open("image-cache");
      const response = await cache.match(key);
      if (response) {
        await cache.delete(key);
      } else {
        console.error(`Key "${key}" not found in cache`);
      }
    } else {
      console.error("Key must be of type string");
    }
  },

  logout: async () => {
    Session.removeCookie("token");
    Session.removeLocalStorage("user");
    Session.removeLocalStorage("wp");
    Session.removeLocalStorage("user_id");

    window.location.href = "/";
  }
};

export default Session;
