import type { FeatureLike } from 'ol/Feature.js';

export interface SelectedFeature {
    layerId: string;
    layerTitle: string;
    feature: FeatureLike;
}

export interface SelectedFeatureProps {
    layerTitle: string;
    properties: Record<string, any>;
}
