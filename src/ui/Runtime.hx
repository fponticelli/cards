package ui;

import haxe.ds.Option;
import ui.Expression;

class Runtime {
	static function createFunction(args : Array<String>, code : String) : Dynamic -> Dynamic
		return (untyped __js__('new Function'))(args.join(','), code);

	static function formatCode(code : String, scope : Dynamic) {
		var prelim = Reflect.fields(scope)
			.map(function(field) {
				var variable = switch field {
					case 'model': '$';
					case field: field;
				};
				return 'var $variable = scope.$field;';
			})
			.join('\n');
		return '$prelim
delete scope;
return $code;';
	}

	public static function toRuntime(code : String, scope : Dynamic) : Runtime {
		var expression = try {
				var formatted = formatCode(code, scope);
				var f = createFunction(['scope'], formatted);

				Fun(function() try return Result(f(scope)) catch(e : Dynamic) return Error(Std.string(e)));
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

enum RuntimeResult {
	Result(value : Dynamic);
	Error(msg : String);
}