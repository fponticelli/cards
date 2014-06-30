package types;

import ui.Expression;
using StringTools;

class StringTransform {
	public static function toArray(value : String) : Array<Dynamic> {
		return [toString(value)];
	}

	public static function toBool(value : String) : Bool {
		return toString(value).trim() != '';
	}

	public static function toDate(value : String) : Date {
		return Date.now();
	}

	public static function toFloat(value : String) : Float {
		return Std.parseFloat(toString(value));
	}

	public static function toObject(value : String) : {} {
		return ArrayTransform.toObject([toString(value)]);
	}

	public static function toString(value : String) : String {
		return null != value ? value : '';
	}

	public static function toCode(value : String) : String {
		return '"' + toString(value).replace('"', '\\"') + '"';
	}
}