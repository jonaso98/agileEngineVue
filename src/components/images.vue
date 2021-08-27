<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img :src="logo" class="my-3" contain height="200" />
      </v-col>
      <v-col cols="12">
        <v-container fluid>
          <v-row dense>
            <v-col
              v-for="(card, index) in cards"
              :key="index"
              :cols="card.flex"
            >
              <v-expand-x-transition>
                <v-card @click="openDialog(index)">
                  <v-img
                    :src="card.cropped_picture"
                    class="white--text align-self-stretch"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                  >
                    <v-card-title v-text="card.id"></v-card-title>
                  </v-img>
                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn icon>
                      <v-icon>mdi-heart</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-expand-x-transition>
            </v-col>
          </v-row>
          <v-dialog v-model="dialog" width="100%">
            <v-card class="mx-auto" max-width="344">
              <v-card-title>
                {{ AuthorHere }}
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-btn icon @click="leftHere">
                  <v-icon>{{ "mdi-chevron-left" }}</v-icon>
                </v-btn>
                <v-btn icon @click="rightHere">
                  <v-icon>{{ "mdi-chevron-right" }}</v-icon>
                </v-btn>
              </v-card-title>
              <v-img :src="pictureHere" height="200px"></v-img>
              <v-card-subtitle>{{ cameraHere }}</v-card-subtitle>

              <v-card-actions>
                <v-btn icon>
                  <v-icon>mdi-bookmark</v-icon>
                </v-btn>

                <v-btn icon>
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn icon @click="show = !show">
                  <v-icon>{{
                    show ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>

                  <v-card-text>
                    {{ tagsHere }}
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-dialog>
        </v-container>
      </v-col>
      <v-col class="mb-4">
        <div class="text-center">
          <v-pagination
            v-model="pageHere"
            :length="pagination.totalPage"
          ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import logo from "../assets/logo.png";
import { mapActions, mapState } from "vuex";
import Mytabla from "../components/table";

// eslint-disable-next-line no-unused-vars
const deserts = [
  "Frozen Yogurt",
  "Ice cream sandwich",
  "Eclair",
  "Cupcake",
  "Gingerbread",
  "Jelly bean",
  "Lollipop",
  "Honeycomb",
  "Donut",
  "KitKat",
];

export default {
  data() {
    return {
      logo,
      cards: [],
      filter: "",
      slide: 1,
      fullHeight: false,
      fullscreen: false,
      pagination: {
        page: 1,
        rowsPerPage: this.getItemsPerPage(),
        picturesArray: 0,
        totalPage: 0,
      },
      datos: [],
      dialog: false,
      show: false,
      Author: "",
      Camera: "",
      Picture: "",
      Tags: "",
      indexPic: 0,
    };
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Mytabla,
  },
  computed: {
    ...mapState("imagesStorage", ["userDetails", "images"]),
    pageCount() {
      return this.images.pageCount;
    },
    pageHere: {
      get() {
        return this.pagination.page;
      },
      set(val) {
        this.getImagesPages(val);
        this.pagination.page = val;
      },
    },
    AuthorHere: {
      get() {
        return this.Author;
      },
      set(val) {
        this.Author = val;
      },
    },
    cameraHere: {
      get() {
        return this.Camera;
      },
      set(val) {
        this.Camera = val;
      },
    },
    pictureHere: {
      get() {
        return this.Picture;
      },
      set(val) {
        this.Picture = val;
      },
    },
    tagsHere: {
      get() {
        return this.Tags;
      },
      set(val) {
        this.Tags = val;
      },
    },
  },
  mounted() {
    this.getImagesPages(this.pagination.page);
  },

  methods: {
    ...mapActions("imagesStorage", ["getImages", "getImagesID"]),

    getItemsPerPage() {
      return this.pageCount;
    },
    openDialog(idImages) {
      this.dialog = true;
      this.indexPic = idImages;
      const selectedShow = this.cards.filter((v, index) => index == idImages);
      this.getImageID(selectedShow[0].id);
    },
    getImageID(value) {
      return new Promise((resolve, reject) => {
        this.getImagesID(value)
          .then((Response) => {
            console.log(Response);
            this.AuthorHere = Response.author;
            this.cameraHere = Response.camera;
            this.pictureHere = Response.full_picture;
            this.tagsHere = Response.tags;
            resolve(Response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getImagesPages(page) {
      return new Promise((resolve, reject) => {
        this.getImages(page)
          .then((Response) => {
            this.pagination.rowsNumber = Response.pageCount;
            this.pagination.rowsPerPage = Response.pictures.length;
            this.pagination.totalPage = Math.ceil(
              Response.pageCount / Response.pictures.length
            );
            this.cards = Response.pictures;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    leftHere() {
      let before = this.indexPic - 1;
      if (before == "-1") {
        before = 9;
        this.indexPic = 9;
        const goLeft = this.cards.filter((v, index) => index == before);
        this.getImageID(goLeft[0].id);
      } else {
        this.indexPic = before;
        const goLeft = this.cards.filter((v, index) => index == before);
        this.getImageID(goLeft[0].id);
      }
    },
    rightHere() {
      let after = this.indexPic + 1;
      if (after == 10) {
        after = 0;
        this.indexPic = 0;
        const goLeft = this.cards.filter((v, index) => index == after);
        this.getImageID(goLeft[0].id);
      } else {
        this.indexPic = after;
        const goLeft = this.cards.filter((v, index) => index == after);
        this.getImageID(goLeft[0].id);
      }
    },
  },
};
</script>
