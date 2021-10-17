<template>
  <div class="card-deck">
    <div class="card">
      <div class="card-header">Map</div>
      <div class="card-body">
        <l-map
          ref="map"
          @ready="onMapReady"
          class="app-map"
          :zoom="zoom"
          :center="center"
        >
          <l-tile-layer :url="url" :attribution="attribution" />
        </l-map>
      </div>
    </div>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer } from "vue2-leaflet";
import msgMixin from "../mixins/msg-mixin";
import "@geoman-io/leaflet-geoman-free";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import store from "@/store";

export default {
  name: "Map",
  components: {
    LMap,
    LTileLayer,
  },
  mixins: [msgMixin],
  data() {
    return {
      zoom: 14,
      center: latLng(54.272106, 74.710709),

      url: "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=M5SCsgLudhvgknO07Ill",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      store: store
    };
  },
  methods: {
    onMapReady() {
      this.map = this.$refs.map.mapObject;
      this.map.pm.addControls({
        position: "topleft",
        drawCircle: false,
      });
      this.map.on("pm:create", ({ shape, layer }) => {
         store.commit("setField", layer._latlngs)
        this.successMsg(`Created ${shape} with ${layer._latlngs}`);
      });
    },
  },
};
</script>

<style scoped>
.app-map {
  height: 600px;
}
</style>
