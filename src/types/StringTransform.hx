package types;

import ui.Expression;
using StringTools;

class StringTransform {
	public static function toArray(value : String) : Array<Dynamic> {
		return [value];
	}

	public static function toBool(value : String) : Bool {
		return value.trim() != '';
	}

	public static function toDate(value : String) : Date {
		return Date.now();
	}

	public static function toFloat(value : String) : Float {
		return 0;
	}

	public static function toObject(value : String) : {} {
		return ArrayTransform.toObject([value]);
	}

	public static function toString(value : String) : String {
		return value;
	}

	public static function toCode(value : String) : String {
		return '"' + value.replace('"', '\\"') + '"';
	}
}