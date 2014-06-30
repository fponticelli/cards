package types;

import ui.Expression;

class BoolTransform {
	public static function toArray(value : Bool) : Array<Dynamic> {
		return [toBool(value) ? false : value];
	}

	public static function toBool(value : Bool) : Bool {
		return null != value && value;
	}

	public static function toDate(value : Bool) : Date {
		return Date.now();
	}

	public static function toFloat(value : Bool) : Float {
		return toBool(value) ? 1 : 0;
	}

	public static function toObject(value : Bool) : {} {
		return ArrayTransform.toObject([toBool(value)]);
	}

	public static function toString(value : Bool) : String {
		return toBool(value) ? 'Yes' : 'No';
	}

	public static function toCode<T>(value : Bool) : String {
		return toBool(value) ? 'true' : 'false';
	}
}