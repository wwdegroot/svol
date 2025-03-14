export interface LayerField {
    name: string;
    alias: string;
}

export interface LayerFields {
    layerid: string;
    fields: LayerField[]
}

export type LayerFieldsMap = Map<string, LayerFields>;