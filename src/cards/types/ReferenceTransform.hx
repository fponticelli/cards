package cards.types;

import haxe.Json;
using StringTools;

class ReferenceTransform {
  public static function toArray(value : String) : Array<Dynamic> {
    return ArrayTransform.toArray(null);
  }

  public static function toBool(value : String) : Bool {
    return BoolTransform.toBool(null);
  }

  public static function toDate(value : String) : Date {
    return DateTransform.toDate(null);
  }

  public static function toFloat(value : String) : Float {
    return FloatTransform.toFloat(null);
  }

  public static function toObject(value : String) : {} {
    return ObjectTransform.toObject(null);
  }

  public static function toString(value : String) : String {
    return StringTransform.toString(null);
  }

  public static function toCode(value : String) : String {
    value = toReference(value);
    return '' == value ? '' : '$.$value';
  }

  public static function toReference(value : String) : String {
    return null == value ? '' : value;
  }
}