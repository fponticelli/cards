package types;

using thx.core.Arrays;
import ui.Expression;

class Dynamics {
	public static function toArray<T>(value : Dynamic) : Array<T> {
		if(Std.is(value, Array))
			return value;
		return [value];
	}

	public static function toBool(value : Dynamic) : Bool {
		return untyped __js__('!!')(value);
	}

	public static function toDate(value : Dynamic) : Date {
		if(Std.is(value, Date))
			return value;
		if(Std.is(value, Float))
			return Date.fromTime(value);
		if(Std.is(value, String)) {
			return try {
				Date.fromString(value);
			} catch(e : Dynamic) {
				Date.now();
			}
		}
		if(Std.is(value, Array)) {
			var defaults = [2000, 0, 1, 0, 0, 0],
				values   = (value : Array<Dynamic>)
					.map(Dynamics.toFloat)
					.map(function(v) return Math.round(v))
					.slice(0, defaults.length);
			values = values.concat(defaults.slice(values.length));
			return new Date(values[0], values[1], values[2], values[3], values[4], values[5]);
		}
		return Date.now();
	}

	public static function toFloat(value : Dynamic) : Float {
		if(Std.is(value, Date))
			return (value : Date).getTime();
		if(Std.is(value, Bool))
			return value ? 1 : 0;
		if(Std.is(value, String))
			return (value : String).length;
		if(Std.is(value, Array))
			return (value : Array<Dynamic>).length;
		return 0;
	}

	public static function toObject(value : Dynamic) : {} {
		if(Reflect.isObject(value))
			return value;
		var arr : Array<Dynamic> = Std.is(value, Array) ? value : [value],
			obj = {};
		arr.mapi(function(value, index) {
			Reflect.setField(obj, 'key_$index', value);
		});
		return obj;
	}

	public static function toString(value : Dynamic) : String {
		if(Std.is(value, Date))
			return (value : Date).toString();
		if(Std.is(value, Bool))
			return value ? 'Yes' : 'No';
		if(Std.is(value, String))
			return value;
		if(Std.is(value, Array))
			return (value : Array<Dynamic>).map(toString).join(', ');
		if(Reflect.isObject(value)) {
			return Reflect.fields(value).map(function(field) {
				return '$field: ' + toString(Reflect.field(value, field));
			}).join(', ');
		}
		return '' + value;
	}
}