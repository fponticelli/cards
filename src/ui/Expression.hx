package ui;

enum Expression {
	Fun(f : Void -> Dynamic);
	SyntaxError(msg : String);
	RuntimeError(msg : String);
}