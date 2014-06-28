package ui;

enum Expression {
	Fun(f : Void -> Dynamic);
	SyntaxError(msg : String);
	RuntimeError(msg : String);
}

class Expressions {
	static function createFunction(args : Array<String>, code : String) : Void -> Dynamic {
		return (untyped __js__('new Function'))(args.join(','), code);
	}
	public static function toExpression(code : String) {
		return try {
			Fun(createFunction([], 'return $code'));
		} catch(e : Dynamic) {
			SyntaxError(Std.string(e));
		}
	}
}