package types;

import ui.Expression;
import thx.core.Objects;

class ObjectTransform {
	public static function toArray(value : {}) : Array<Dynamic> {
		return [toObject(value)];
	}

	public static function toBool(value : {}) : Bool {
		return !Objects.isEmpty(toObject(value));
	}

	public static function toDate(value : {}) : Date {
		return Date.now();
	}

	public static function toFloat(value : {}) : Float {
		return Reflect.fields(toObject(value)).length;
	}

	public static function toObject(value : {}) : {} {
		return null != value ? value : {};
	}

	public static function toString(value : {}) : String {
		return Reflect.fields(toObject(value)).map(function(field) {
			return '$field: ' + DynamicTransform.toString(Reflect.field(value, field));
		}).join(', ');
	}

	public static function toCode(value : {}) : String {
		return "{" + Reflect.fields(toObject(value)).map(function(field) {
			return '"$field" : ' + DynamicTransform.toCode(Reflect.field(value, field));
		}).join(', ') + "}";
	}
}