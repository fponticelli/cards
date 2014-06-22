package ui;

enum DataEvent {
	SetFloatValue(path : String, value : Float);
	SetDateValue(path : String, value : Date);
	SetStringValue(path : String, value : String);
	SetBoolValue(path : String, value : Bool);
}