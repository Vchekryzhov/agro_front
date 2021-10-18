<template>
    <div class="card-deck">
        <div class="card">
            <div class="card-header">Map</div>
            <div class="card-body">
                <l-map ref="map" @ready="onMapReady" class="app-map" :zoom="zoom" :center="center">
                    <l-tile-layer :url="url" :attribution="attribution" />
                    <l-geo-json
                        ref="myGeojson"
                        :geojson="geojsonRoute"
                        :options="geojsonOptions"
                        :options-style="geojsonStyleFunction"
                    />
                </l-map>
            </div>
        </div>
    </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";
import msgMixin from "../mixins/msg-mixin";
import "@geoman-io/leaflet-geoman-free";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import store from "@/store";
import RouteService from "@/services/RouteService";

export default {
    name: "Map",
    components: {
        LMap,
        LTileLayer,
        LGeoJson
    },
    mixins: [msgMixin],
    data() {
        return {
            zoom: 14,
            center: latLng(54.272106, 74.710709),
            geojsonRoute: { features: [] },
            geojsonOptions: {},
            url: "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=M5SCsgLudhvgknO07Ill",
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            store: store
        };
    },
    computed: {
        geojsonStyleFunction() {
            return null;
        }
    },
    methods: {
        async calculateRoute(payload) {
            let pointRoutes;
            pointRoutes = await RouteService.calculate({
                algorithm: "SNAKE",
                figurePoints: [
                    {
                        latitude: 0,
                        longitute: 0
                    }
                ],
                sideDistance: 0,
                bufferInMeters: 0,
                guidanceLine: [
                    {
                        latitude: 0,
                        longitute: 0
                    }
                ],
                speed: 0
            });
            this.geojsonRoute.features = [
                {
                    type: "Feature",
                    properties: {
                        shape: "Line",
                        name: "Unnamed Layer",
                        category: "default"
                    },
                    geometry: {
                        type: "LineString",
                        coordinates: pointRoutes.points.map((a) => {
                            return [ a.longitute, a.latitude];
                        })
                    }
                }
            ];
        },
        onMapReady() {
            this.map = this.$refs.map.mapObject;
            this.map.pm.setLang("ru");
            this.map.pm.addControls({
                position: "topleft",
                drawCircle: false,
                drawCircleMarker: false,
                drawRectangle: false,
                drawPolygon: false,
                drawMarker: false,
                drawPolyline: false,
                cutPolygon: false
            });
            const actions = ["cancel"];
            this.map.pm.Toolbar.copyDrawControl("Polygon", {
                name: "Field",
                block: "custom",
                title: "Задать поле",
                disable: true,
                actions: actions
            });
            this.map.pm.Toolbar.copyDrawControl("Line", {
                name: "guidanceLine",
                block: "custom",
                title: "Задать направляющую движения",
                disable: true,
                actions: actions,
                hideMiddleMarkers: true
            });
            this.map.pm.setPathOptions(
                { color: "orange", hideMiddleMarkers: true },
                {
                    ignoreShapes: ["Field"]
                }
            );
            // this.map.pm.setGlobalOptions({ hideMiddleMarkers: true });
            this.map.on("pm:drawstart", (event) => {
                const { workingLayer } = event;
                workingLayer.on("pm:vertexadded", (e) => {
                    if (e.shape == "guidanceLine" && workingLayer.getLatLngs().length >= 2) {
                        this.map.pm.Draw.guidanceLine._finishShape();
                    }
                });
            });

            this.map.on("pm:create", async ({ shape, layer }) => {
                if (shape == "Field") {
                    store.commit("setField", layer._latlngs);
                    this.map.pm.Toolbar.setButtonDisabled("Field", true);
                }
                if (shape == "guidanceLine") {
                    store.commit("setGuidanceLine", layer._latlngs);
                    this.map.pm.Toolbar.setButtonDisabled("guidanceLine", true);
                }
                await this.calculateRoute();
                this.successMsg(`Created ${shape} with ${layer._latlngs}`);
            });

            this.map.on("pm:remove", ({ shape, layer }) => {
                store.commit("setField", layer._latlngs);
                if (shape == "Field") {
                    this.map.pm.Toolbar.setButtonDisabled("Field", false);
                }
                if (shape == "guidanceLine") {
                    this.map.pm.Toolbar.setButtonDisabled("guidanceLine", false);
                }
            });
        }
    }
};
</script>

<style scoped>
.app-map {
    height: 600px;
}
</style>
