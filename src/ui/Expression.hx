package ui;

import ui.Runtime;

enum Expression {
	Fun(f : Void -> RuntimeResult);
	SyntaxError(msg : String);
}