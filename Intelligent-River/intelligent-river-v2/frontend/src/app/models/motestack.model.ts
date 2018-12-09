import { Project} from './projects.model';
import { Radio } from './radios.model';
import { Template } from './template.model';

export interface Motestack {
    id?: string;
    active?: boolean;
    label?: string;
    max1Wire?: number;
    min1Wire?: number;
    maxSdi12?: number;
    minSdi12?: number;
    numAds?:  number;
    nvsramLog?: boolean;
    projectId?:string;
    sPeriod?:number;
    sTrans?: number;
    sdi12Read?:number;
    sdi12St?: number;
    sdi12V3?:boolean;
    uri?: string;
    sLogSize?: number;
    comm?: CommonMotestack;
}

export interface MotestackPost extends Motestack {
    comm?: MotestackRadioFull;
    sensing?: MotestackSensingFull[];
}

export interface MotestackRadioFull {
    radio: Radio;
    config: IHash[];
}

export interface MotestackSensingFull {
    id?: string;
    label?: string;
    sensingDevice?: SensingDeviceBrief;
    parameters?: MotestackSensingParameterFull;
}

export interface IHash {
    [details: string] : string;
} 

export interface MotestackForm {
    projects?: Project[];
    radios?: Radio[];
    templates?:  Template[];
}

export interface SensingDeviceBrief {
    id?: string;
    label?: string;
    type?: string;
    params?: string[];
}

export interface MotestackSensingParameterFull {
    parameter?: PostSensingDeviceParameter;
    convertFn?: string;
    convertUnit?: string;
}

export interface PostSensingDeviceParameter {
    id?: string;
    sensor?: string;
    subject?: string;
    label?: string;
    property?: string;
    unit?: string;
    min?: number;
    max?: number;
    resolution?: number;
    accuracy?: number;
    convertFn?: string;
    convertUnit?: string;
}

export interface CommonMotestack {
    radio: Radio;
}