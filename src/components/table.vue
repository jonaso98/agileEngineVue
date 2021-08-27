/* eslint-disable vue/no-deprecated-v-bind-sync */
<template>
  <div class="q-pa-md">
    <q-table
      grid
      title="Treats"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <myCard :datoshere="props" v-on:openCarrusel="OpenModal" />
        </div>
      </template>
    </q-table>
    <q-dialog v-model="fullHeight">
      <q-card class="my-card">
        <div ref="imagesFull">
          <q-img
            :src="imagesByIDCom.full_picture"
            style="width: 100%; height: 200px"
          />
        </div>

        <q-card-section>
          <q-btn
            fab
            style="top: 0; right: 12px; transform: translateY(-50%)"
            class="absolute"
            push
            round
            color="white"
            text-color="primary"
            @click="toggle"
          />
          <q-btn
            fab
            style="top: 0; right: 140px; transform: translateY(-50%)"
            class="absolute"
            push
            round
            color="orange"
            text-color="black"
            icon="arrow_left"
            @click="previous()"
          />
          <q-btn
            fab
            style="top: 0; right: 80px; transform: translateY(-50%)"
            class="absolute"
            push
            round
            color="orange"
            text-color="black"
            icon="arrow_right"
            @click="next()"
          />

          <q-fab
            fab
            style="top: 0; right: 200px; transform: translateY(-50%)"
            class="absolute"
            color="purple"
            icon="keyboard_arrow_up"
            direction="up"
          >
            <ShareNetwork
              network="facebook"
              :url="imagesByIDCom.full_picture"
              title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
              description="This week, I’d like to introduce you to 'Vite', which means 'Fast'. It’s a brand new development setup created by Evan You."
              quote="The hot reload is so fast it\'s near instant. - Evan You"
              hashtags="vuejs,vite"
            >
              <q-fab-action color="primary" icon="facebook" />
            </ShareNetwork>
          </q-fab>

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ this.imagesByIDCom.author }}
            </div>
            <div
              class="
                col-auto
                text-grey text-caption
                q-pt-md
                row
                no-wrap
                items-center
              "
            >
              <q-icon name="place" />
              {{ this.imagesByIDCom.camera }}
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            {{ this.imagesByIDCom.tags }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  //props:['original'],
  data() {
    return {
      filter: "",
      loading: false,
      slide: 1,
      fullHeight: false,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 3,
        rowsNumber: 10,
      },
      columns: [
        {
          name: "desc",
          required: true,
          label: "Dessert (100g serving)",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "calories",
          align: "center",
          label: "Calories",
          field: "calories",
          sortable: true,
        },
        { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
        { name: "carbs", label: "Carbs (g)", field: "carbs", sortable: true },
        {
          name: "protein",
          label: "Protein (g)",
          field: "protein",
          sortable: true,
        },
        {
          name: "sodium",
          label: "Sodium (mg)",
          field: "sodium",
          sortable: true,
        },
        {
          name: "calcium",
          label: "Calcium (%)",
          field: "calcium",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "iron",
          label: "Iron (%)",
          field: "iron",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      data: [],
      original: [],
      imagesByID: [],
    };
  },
  components: {
    myCard: () =>
      import(/* webpackChunkName: "group-cards" */ "../components/cards"),
  },
  computed: {
    cardContainerClass() {
      if (this.$q.screen.gt.xs) {
        return (
          "grid-masonry grid-masonry--" + (this.$q.screen.gt.sm ? "3" : "2")
        );
      }
      return void 0;
    },
    getTotalRow() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      //this.rowsPerPage = this.getImages.pictures.length;
      return 2;
    },
    imagesByIDCom: {
      get() {
        return this.imagesByID;
      },
      set(val) {
        this.imagesByID = val;
      },
    },
  },
  mounted() {
    // get initial data from server (1st page)
    this.onRequest({
      pagination: this.pagination,
      filter: undefined,
    });
  },
  methods: {
    ...mapActions("imagesStorage", ["getImages", "getImagesID"]),
    toggle() {
      const target = this.$refs.this.$q.fullscreen
        .toggle(target)
        .then(() => {
          // success!
        })
        .catch((err) => {
          alert(err);
          // uh, oh, error!!
          // console.error(err)
        });
    },
    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      this.loading = true;
      //console.log("rowsPerPage", rowsPerPage);
      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;

      // calculate starting row of data

      const startRow = (page - 1) * rowsPerPage;

      // fetch data from "server"
      this.fetchFromServer(
        startRow,
        fetchCount,
        filter,
        sortBy,
        descending,
        page
      );

      // clear out existing data and add new

      // don't forget to update local pagination object
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.pagination.sortBy = sortBy;
      this.pagination.descending = descending;
      // ...and turn of loading indicator
      this.loading = false;
    },
    OpenModal(e) {
      this.loadPig(e);
    },
    loadPig(e) {
      return new Promise((resolve, reject) => {
        this.getImagesID(e)
          .then((Response) => {
            console.log("response ID", Response);
            this.imagesByIDCom = Response;
            this.fullHeight = true;
            resolve(Response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // emulate ajax call
    // SELECT * FROM ... WHERE...LIMIT...
    // eslint-disable-next-line no-unused-vars
    fetchFromServer(startRow, count, filter, sortBy, descending, page) {
      return new Promise((resolve, reject) => {
        this.getImages(page)
          .then((Response) => {
            this.pagination.rowsNumber = Response.pageCount;
            this.pagination.rowsPerPage = Response.pictures.length;

            let data1 = filter
              ? Response.pictures.filter((row) => row.id.includes(filter))
              : Response.pictures.slice();

            // handle sortBy
            if (sortBy) {
              const sortFn =
                sortBy === "desc"
                  ? descending
                    ? (a, b) => (a.id > b.id ? -1 : a.id < b.id ? 1 : 0)
                    : (a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)
                  : descending
                  ? (a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy])
                  : (a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy]);
              data1.sort(sortFn);
            }

            const resultH = data1.slice(startRow, startRow + count);
            this.data = data1.splice(0, data1.length, ...resultH);
            this.loading = false;
            resolve();
            //resolve(data1.slice(startRow, startRow + count))
          })
          .catch((error) => {
            reject(error);
            //console.log("error ",error)
          });
      });
    },

    // emulate 'SELECT count(*) FROM ...WHERE...'
    getRowsNumberCount(filter) {
      if (!filter) {
        return this.getTotalRow;
      }
      let count = 0;
      this.original.forEach((treat) => {
        if (treat.name.includes(filter)) {
          ++count;
        }
      });
      return count;
    },
  },
};
</script>
