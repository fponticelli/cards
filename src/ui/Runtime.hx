package ui;

import haxe.ds.Option;
import ui.Expression;

class Runtime {
	static function createFunction(args : Array<String>, code : String) : Dynamic -> Dynamic
		return (untyped __js__('new Function'))(args.join(','), code);

	static function formatCode(code : String)
		return 'return $code';

	public static function toRuntime(code : String) : Runtime {
		var expression = try {
				var formatted = formatCode(code);
				Fun(createFunction(['$'], formatted));
			} catch(e : Dynamic) {
				SyntaxError(Std.string(e));
			};
		return new Runtime(expression, code);
	}

	public static function toErrorOption(runtime : Runtime) : Option<String>
		return switch runtime.expression {
			case SyntaxError(e): Some(e);
			case _: None;
		};

	public var expression(default, null) : Expression;
	public var code(default, null) : String;
	public function new(expression : Expression, code : String) {
		this.expression = expression;
		this.code = code;
	}
}