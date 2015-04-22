package cards.types;

using thx.Arrays;

class ArrayTransform {
  public static function toArray(value : Array<Dynamic>) : Array<Dynamic> {
     return null != value ? value : [];
  }

  public static function toBool(value : Array<Dynamic>) : Bool {
    return toArray(value).length > 0;
  }

  public static function toDate(value : Array<Dynamic>) : Date {
    var defaults = [2000, 0, 1, 0, 0, 0],
      values   = toArray(value)
        .map(DynamicTransform.toFloat)
        .map(function(v) return Math.round(v))
        .slice(0, defaults.length);
    values = values.concat(defaults.slice(values.length));
    return new Date(values[0], values[1], values[2], values[3], values[4], values[5]);
  }

  public static function toFloat(value : Array<Dynamic>) : Float {
    return toArray(value).length;
  }

  public static function toObject(value : Array<Dynamic>) : {} {
    var obj = {};
    toArray(value).mapi(function(v, i) {
      Reflect.setField(obj, 'field_${i+1}', v);
    });
    return obj;
  }

  public static function toString(value : Array<Dynamic>) : String {
    return toArray(value).map(DynamicTransform.toString).join(', ');
  }

  public static function toCode(value : Array<Dynamic>) : String {
    return '[${toArray(value).map(DynamicTransform.toCode).join(",")}]';
  }

  public static function toReference(value : Array<Dynamic>) : String {
    return '';
  }
}