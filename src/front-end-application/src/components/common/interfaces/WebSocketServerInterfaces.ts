export interface ServerMsg {
    Type: number,
    Data: any,
}

export interface BehaviourData {
	Type: number,
	Start: boolean, 
}

export interface InformationData {
	Type: number,
	Info: string,
}

export interface FieldUpdateData {
	Type: number,
	NewValue: string,
}