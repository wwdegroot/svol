import { Circle, Fill, Stroke, Style } from 'ol/style.js';
import type { StyleLike } from 'ol/style/Style.js';
import type { FlatStyleLike } from 'ol/style/flat.js';

let wfsStyle = new Style({
    image: new Circle({
        radius: 6,
        fill: new Fill({
            color: [255, 120, 0, 1]
        }),
        stroke: new Stroke({
            color: [0, 0, 0, 1],
            width: 1.5
        })
    }),
    zIndex: Infinity
});

let wfsSourceConfig: {
    url: string;
    title: string;
    crs: string;
    featuretypes: string[];
    strategy: 'bbox' | 'tile';
    style: StyleLike;
} = {
    url: 'https://service.pdok.nl/rvo/restwarmte/wfs/v1_0',
    title: 'Restwarmte',
    crs: 'EPSG:28992',
    featuretypes: ['restwarmte:liggingindustrieco2'],
    strategy: 'bbox',
    style: wfsStyle
};

let wfsSourceConfigCBS: {
    url: string;
    title: string;
    crs: string;
    featuretypes: string[];
    strategy: 'bbox' | 'tile';
    style: StyleLike | FlatStyleLike;
    filter: string | undefined;
} = {
    url: 'https://service.pdok.nl/cbs/bevolkingskernen/2021/wfs/v1_0',
    title: 'CBS Bevolkingskernen 2021',
    crs: 'EPSG:28992',
    featuretypes: ['bevolkingskernen:bevolkingskernen'],
    strategy: 'bbox',
    style: [
        {
            filter: ['>', ['get', 'aantalInwoners'], 100_000],
            style: {
                'stroke-color': 'red',
                'stroke-width': 6,
                'text-value': ['concat', ['get', 'naam2021'], ', ', ['get', 'provincie']],
                'text-font': '32px sans-serif',
                'text-fill-color': 'black',
                'text-stroke-color': 'gray',
                'text-stroke-width': 2
            }
        }
    ],
    filter: '<PropertyIsGreaterThan><PropertyName>aantalInwoners</PropertyName><Literal>100000</Literal></PropertyIsGreaterThan>'
};

export { wfsSourceConfig, wfsSourceConfigCBS };
