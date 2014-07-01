package ui;

import haxe.ds.Option;

typedef Runtime = {
	runtime : Expression,
	code : String
}

class Runtimes {
	static function createFunction(args : Array<String>, code : String) : Void -> Dynamic
		return (untyped __js__('new Function'))(args.join(','), code);

	static function formatCode(code : String)
		return 'return $code';

	public static function toRuntime(code : String) : Runtime {
		return {
			runtime : try {
					var formatted = formatCode(code);
					Fun(createFunction([], formatted));
				} catch(e : Dynamic) {
					SyntaxError(Std.string(e));
				},
			code : code
		};
	}

	public static function toErrorOption(runtime : Runtime) : Option<String>
		return switch runtime.runtime {
			case SyntaxError(e), RuntimeError(e): Some(e);
			case _: None;
		};
}
