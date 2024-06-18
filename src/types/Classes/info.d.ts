import { InfoType } from '../Enums/InfoType';

export interface InfoSuccess {
    message?: string;
    link?: string;
}
export interface InfoWarning {
    message?: string;
    link?: string;
}
export interface InfoError {
    message?: string;
    address?: string;
    transaction?: string;
    link?: string;
}

export interface InfoData {
    infoType?: InfoType;
    data?: InfoSuccess | InfoWarning | InfoError;
}
