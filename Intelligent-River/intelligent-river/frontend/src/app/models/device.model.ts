import { PostSensingDeviceParameter } from './motestack.model';

export interface Device {
    id?: string;
    label?: string;
    type?: string;
    params?: PostSensingDeviceParameter[];
}

export interface DeviceForm {
    sensors?: DeviceFormSensor[];
    units?: DeviceFormUnit[];
    properties?: DeviceFormPropertie[];
    subjects?: DeviceFormSubject[];
}

export interface DeviceFormSensor {
    id?: string;
    label?: string;
}

export interface DeviceFormSubject {
    uriSuffix?: string;
    id?: string;
    label?: string;
}

export interface DeviceFormUnit {
    id?: string;
    label?: string;
    uri?: string;
}

export interface DeviceFormPropertie {
    uriSuffix?: string;
    id?: string;
    label?: string;
}

export enum DeviceTypes {
    
}