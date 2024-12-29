import { rdnewprojection } from "$lib/projection.js";
import { getTopLeft } from "ol/extent.js";
import TileLayer from "ol/layer/Tile.js";
import WMTS from 'ol/source/WMTS.js';
import WMTSTileGrid from "ol/tilegrid/WMTS.js";
import LayerGroup from "ol/layer/Group.js";

// can be calculated based on resolution z0, written out for clarity
// see https://www.geonovum.nl/uploads/standards/downloads/nederlandse_richtlijn_tiling_-_versie_1.1.pdf
const resolutions = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210]
const matrixIds = new Array(15)
for (var i = 0; i < 15; ++i) {
    matrixIds[i] = i
}

const brtStandaard = new TileLayer({
    source: new WMTS({
        attributions: "PDOK",
        url: "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0",
        layer: "standaard",
        format: "image/png",
        matrixSet: "EPSG:28992",
        tileGrid: new WMTSTileGrid({
            origin: getTopLeft(rdnewprojection.getExtent()),
            resolutions: resolutions,
            matrixIds: matrixIds,
        }),
        style: 'default',
    })

});
brtStandaard.set('title', 'Standaard');
brtStandaard.set('id', 'brt-standaard');
brtStandaard.set('layertype', 'base')

const brtPastel = new TileLayer({
    visible: false,
    source: new WMTS({
        attributions: "PDOK",
        url: "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0",
        layer: "pastel",
        format: "image/png",
        matrixSet: "EPSG:28992",
        tileGrid: new WMTSTileGrid({
            origin: getTopLeft(rdnewprojection.getExtent()),
            resolutions: resolutions,
            matrixIds: matrixIds,
        }),
        style: 'default',

    })

});
brtPastel.set('title', 'Pastel');
brtPastel.set('id', 'brt-pastel');
brtPastel.set('layertype', 'base')

const brtWater = new TileLayer({
    visible: false,
    source: new WMTS({
        attributions: "PDOK",
        url: "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0",
        layer: "water",
        format: "image/png",
        matrixSet: "EPSG:28992",
        tileGrid: new WMTSTileGrid({
            origin: getTopLeft(rdnewprojection.getExtent()),
            resolutions: resolutions,
            matrixIds: matrixIds,
        }),
        style: 'default',
    })

});
brtWater.set('title', 'Water');
brtWater.set('id', 'brt-water');
brtWater.set('layertype', 'base')

const brtGrijs = new TileLayer({
    visible: false,
    source: new WMTS({
        attributions: "PDOK",
        url: "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0",
        layer: "grijs",
        format: "image/png",
        matrixSet: "EPSG:28992",
        tileGrid: new WMTSTileGrid({
            origin: getTopLeft(rdnewprojection.getExtent()),
            resolutions: resolutions,
            matrixIds: matrixIds,
        }),
        style: 'default',
    })

});
brtGrijs.set('title', 'Grijs');
brtGrijs.set('id', 'brt-grijs');
brtGrijs.set('layertype', 'base')

const baselayers = new LayerGroup({ layers: [brtStandaard, brtPastel, brtWater, brtGrijs] });

export { baselayers, brtStandaard, brtGrijs, brtPastel, brtWater };