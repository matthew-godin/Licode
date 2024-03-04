package main

// the only struct sent to clients
type Msg struct {
	Type int64 `json:"Type"`
	Data any   `json:"Data"`
}

type BehaviourData struct {
	Type  int  `json:"Type"`
	Start bool `json:"Start"`
}

func makeBehaviourMsg(bType int, start bool) Msg {
	return Msg{
		Type: Behaviour,
		Data: BehaviourData{
			Type:  bType,
			Start: start,
		},
	}
}

type InformationData struct {
	Type int    `json:"Type"`
	Info string `json:"Info"`
}

func makeInformationMsg(iType int, info string) Msg {
	return Msg{
		Type: Information,
		Data: InformationData{
			Type: iType,
			Info: info,
		},
	}
}

type FieldUpdateData struct {
	Type     int    `json:"Type"`
	NewValue string `json:"NewValue"`
}

func makeFieldUpdateMsg(fType int, newValue string) Msg {
	return Msg{
		Type: FieldUpdate,
		Data: FieldUpdateData{
			Type:     fType,
			NewValue: newValue,
		},
	}
}
