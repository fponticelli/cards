package ui;

enum Expression {
	Fun(f : Dynamic -> Dynamic);
	SyntaxError(msg : String);
}