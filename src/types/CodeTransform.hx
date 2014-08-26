package types;

import haxe.Json;
import ui.Expression;
using StringTools;

class CodeTransform {
	public static function toArray(value : String) : Array<Dynamic> {
		return try {
			var t = Json.parse(toCode(value));
			if(Std.is(t, Array))
				t;
			else
				DynamicTransform.toArray(t);
		} catch(_ : Dynamic) {
			[];
		}
	}

	public static function toBool(value : String) : Bool {
		return switch toCode(value) {
			case 'true', '1': true;
			case _: false;
		}
	}

	static var datePattern = ~/Date\(-?\d+(:?\.\d+)?(:?e-?\d+)?\)/;
	public static function toDate(value : String) : Date {
		if(datePattern.match(value))
			return Date.fromTime(Std.parseFloat(datePattern.matched(1)));
		else
			return Date.now();
	}

	public static function toFloat(value : String) : Float {
		return Std.parseFloat(toCode(value));
	}

	public static function toObject(value : String) : {} {
		return try {
			var t = Json.parse(toCode(value));
			if(Reflect.isObject(t) && !Std.is(t, String))
				t;
			else
				DynamicTransform.toObject(t);
		} catch(_ : Dynamic) {
			{};
		}
	}

	public static function toString(value : String) : String {
		return try {
			var t = Json.parse(toCode(value));
			if(Std.is(t, String))
				t;
			else
				DynamicTransform.toString(t);
		} catch(_ : Dynamic) {
			'';
		}
	}

	public static function toCode(value : String) : String {
		return null != value ? value.trim() : 'null';
	}

	static var PATTERN = ~/^\s*\$\.([a-z](:?(\.|\[\d+\])?[a-z0-9]*)*)\s*$/;
	public static function toReference(value : String) : String {
		var code = toCode(value);
		return PATTERN.match(code) ? PATTERN.matched(1) : '';
	}
}