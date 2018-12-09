export interface Radio {
    id?: string;
    label?: string;
    options?: RadioOption[];
}

export interface RadioOption {
    name?: string;
    label?: string;
    type?: string;
    required?: boolean;
}