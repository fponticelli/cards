package types;

import ui.Expression;

class FloatTransform {
	public static function toArray(value : Float) : Array<Dynamic> {
		return [value];
	}

	public static function toBool(value : Float) : Bool {
		return value != 0;
	}

	public static function toDate(value : Float) : Date {
		return Date.now();
	}

	public static function toFloat(value : Float) : Float {
		return value;
	}

	public static function toObject(value : Float) : {} {
		return ArrayTransform.toObject([value]);
	}

	public static function toString(value : Float) : String {
		return '' + value;
	}

	public static function toCode(value : Float) : String {
		return '' + value;
	}
}