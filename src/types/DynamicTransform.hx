package types;

import ui.Expression;

class DynamicTransform {
	public static function toArray(value : Dynamic) : Array<Dynamic> {
		if(null == value)
			return [];
		if(Std.is(value, Array))
			return ArrayTransform.toArray(value);
		if(Std.is(value, Bool))
			return BoolTransform.toArray(value);
		if(Std.is(value, Date))
			return DateTransform.toArray(value);
		if(Std.is(value, Float))
			return FloatTransform.toArray(value);
		if(Std.is(value, String))
			return StringTransform.toArray(value);
		if(Reflect.isObject(value))
			return ObjectTransform.toArray(value);
		if(Reflect.isFunction(value))
			return toArray(null);
		return throw 'Type of $value cannot be matched by DynamicTransform.toArray';
	}

	public static function toBool(value : Dynamic) : Bool {
		if(null == value)
			return false;
		if(Std.is(value, Array))
			return ArrayTransform.toBool(value);
		if(Std.is(value, Bool))
			return BoolTransform.toBool(value);
		if(Std.is(value, Date))
			return DateTransform.toBool(value);
		if(Std.is(value, Float))
			return FloatTransform.toBool(value);
		if(Std.is(value, String))
			return StringTransform.toBool(value);
		if(Reflect.isObject(value))
			return ObjectTransform.toBool(value);
		if(Reflect.isFunction(value))
			return toBool(null);
		return throw 'Type of $value cannot be matched by DynamicTransform.toBool';
	}

	public static function toDate(value : Dynamic) : Date {
		if(null == value)
			return Date.now();
		if(Std.is(value, Array))
			return ArrayTransform.toDate(value);
		if(Std.is(value, Bool))
			return BoolTransform.toDate(value);
		if(Std.is(value, Date))
			return DateTransform.toDate(value);
		if(Std.is(value, Float))
			return FloatTransform.toDate(value);
		if(Std.is(value, String))
			return StringTransform.toDate(value);
		if(Reflect.isObject(value))
			return ObjectTransform.toDate(value);
		if(Reflect.isFunction(value))
			return toDate(null);
		return throw 'Type of $value cannot be matched by DynamicTransform.toDate';
	}

	public static function toFloat(value : Dynamic) : Float {
		if(null == value)
			return 0;
		if(Std.is(value, Array))
			return ArrayTransform.toFloat(value);
		if(Std.is(value, Bool))
			return BoolTransform.toFloat(value);
		if(Std.is(value, Date))
			return DateTransform.toFloat(value);
		if(Std.is(value, Float))
			return FloatTransform.toFloat(value);
		if(Std.is(value, String))
			return StringTransform.toFloat(value);
		if(Reflect.isObject(value))
			return ObjectTransform.toFloat(value);
		if(Reflect.isFunction(value))
			return toFloat(null);
		return throw 'Type of $value cannot be matched by DynamicTransform.toFloat';
	}

	public static function toObject(value : Dynamic) : {} {
		if(null == value)
			return {};
		if(Std.is(value, Array))
			return ArrayTransform.toObject(value);
		if(Std.is(value, Bool))
			return BoolTransform.toObject(value);
		if(Std.is(value, Date))
			return DateTransform.toObject(value);
		if(Std.is(value, Float))
			return FloatTransform.toObject(value);
		if(Std.is(value, String))
			return StringTransform.toObject(value);
		if(Reflect.isObject(value))
			return ObjectTransform.toObject(value);
		if(Reflect.isFunction(value))
			return toObject(null);
		return throw 'Type of $value cannot be matched by DynamicTransform.toObject';
	}

	public static function toString(value : Dynamic) : String {
		if(null == value)
			return '';
		if(Std.is(value, Array))
			return ArrayTransform.toString(value);
		if(Std.is(value, Bool))
			return BoolTransform.toString(value);
		if(Std.is(value, Date))
			return DateTransform.toString(value);
		if(Std.is(value, Float))
			return FloatTransform.toString(value);
		if(Std.is(value, String))
			return StringTransform.toString(value);
		if(Reflect.isObject(value))
			return ObjectTransform.toString(value);
		if(Reflect.isFunction(value))
			return toString(null);
		return throw 'Type of $value cannot be matched by DynamicTransform.toString';
	}

	public static function toCode(value : Dynamic) : String {
		if(null == value)
			return 'null';
		if(Std.is(value, Array))
			return ArrayTransform.toCode(value);
		if(Std.is(value, Bool))
			return BoolTransform.toCode(value);
		if(Std.is(value, Date))
			return DateTransform.toCode(value);
		if(Std.is(value, Float))
			return FloatTransform.toCode(value);
		if(Std.is(value, String))
			return StringTransform.toCode(value);
		if(Reflect.isObject(value))
			return ObjectTransform.toCode(value);
		if(Reflect.isFunction(value))
			return toCode(null);
		return throw 'Type of $value cannot be matched by DynamicTransform.toCode';
	}

	public static function toReference(value : Dynamic) : String {
		if(null == value)
			return '';
		if(Std.is(value, Array))
			return ArrayTransform.toReference(value);
		if(Std.is(value, Bool))
			return BoolTransform.toReference(value);
		if(Std.is(value, Date))
			return DateTransform.toReference(value);
		if(Std.is(value, Float))
			return FloatTransform.toReference(value);
		if(Std.is(value, String))
			return StringTransform.toReference(value);
		if(Reflect.isObject(value))
			return ObjectTransform.toReference(value);
		if(Reflect.isFunction(value))
			return toReference(null);
		return throw 'Type of $value cannot be matched by DynamicTransform.toReference';
	}
}