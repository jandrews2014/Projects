export interface Template {
    id?: string;
    label?: string;
    context?: string[];
    params?: TemplateParams[];

}

export interface SensingTemplate {
    sensingDevice?: SensingDevice;
    id?: string;
    label?: string;
    params?: TemplateParams[];

}

export interface SensingDevice {
    id?: string;
    label?: string;
    type?: string;
    param?: string[];
}

export interface TemplateParams {
    unit?: string;
    min?: number;
    max?: number;
    subject?: string;
    property?: string;
    accuracy?: number;
    sensor?: string;
    id?: string;
    label?: string;
    resolution?: number;
    context?: string;
}
