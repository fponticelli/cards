package types;

import ui.Expression;

class FloatTransform {
	public static function toArray(value : Float) : Array<Dynamic> {
		return [toFloat(value)];
	}

	public static function toBool(value : Float) : Bool {
		return toFloat(value) != 0;
	}

	public static function toDate(value : Float) : Date {
		return Date.fromTime(toFloat(value));
	}

	public static function toFloat(value : Float) : Float {
		return null != value ? value : 0.0;
	}

	public static function toObject(value : Float) : {} {
		return ArrayTransform.toObject([toFloat(value)]);
	}

	public static function toString(value : Float) : String {
		return '' + toFloat(value);
	}

	public static function toCode(value : Float) : String {
		return '' + toFloat(value);
	}

	public static function toReference(value : Array<Dynamic>) : String {
		return '';
	}
}