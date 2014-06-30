package types;

import ui.Expression;

class DateTransform {
	public static function toArray(value : Date) : Array<Dynamic> {
		return [value];
	}

	public static function toBool(value : Date) : Bool {
		return false;
	}

	public static function toDate(value : Date) : Date {
		return value;
	}

	public static function toFloat(value : Date) : Float {
		return value.getTime();
	}

	public static function toObject(value : Date) : {} {
		return ArrayTransform.toObject([value]);
	}

	public static function toString(value : Date) : String {
		return value.toString();
	}

	public static function toCode(value : Date) : String {
		return 'new Date(${value.getTime()})';
	}
}