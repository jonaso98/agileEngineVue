<template>
  <router-view />
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "GooglePhotosLayout",
  data() {
    return {
      leftDrawerOpen: false,
      search: "",
      storage: 0.26,
      links1: [
        { icon: "photo", text: "Photos" },
        { icon: "photo_album", text: "Albums" },
        { icon: "assistant", text: "Assistant" },
        { icon: "people", text: "Sharing" },
        { icon: "book", text: "Photo books" },
      ],
      links2: [
        { icon: "archive", text: "Archive" },
        { icon: "delete", text: "Trash" },
      ],
      links3: [
        { icon: "settings", text: "Settings" },
        { icon: "help", text: "Help & Feedback" },
        { icon: "get_app", text: "App Downloads" },
      ],
      createMenu: [
        { icon: "photo_album", text: "Album" },
        { icon: "people", text: "Shared Album" },
        { icon: "movie", text: "Movie" },
        { icon: "library_books", text: "Animation" },
        { icon: "dashboard", text: "Collage" },
        { icon: "book", text: "Photo book" },
      ],
    };
  },
  created() {
    console.log("entro layaout");
    // eslint-disable-next-line no-async-promise-executor
    return new Promise((resolve, reject) => {
      let datas = {
        apiKey: "23567b218376f79d9415",
      };
      this.getTokenValid(datas)
        .then((response) => {
          console.log("crando layout token ", response.data.token);
          if (response.data.token) {
            //return the response
            resolve(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  methods: {
    ...mapActions("imagesStorage", ["getTokenValid"]),
  },
};
</script>

<style></style>
