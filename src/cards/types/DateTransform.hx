package cards.types;

class DateTransform {
  public static function toArray(value : Date) : Array<Dynamic> {
    return [toDate(value)];
  }

  public static function toBool(value : Date) : Bool {
    return false;
  }

  public static function toDate(value : Date) : Date {
    return null != value ? value : Date.now();
  }

  public static function toFloat(value : Date) : Float {
    return toDate(value).getTime();
  }

  public static function toObject(value : Date) : {} {
    return ArrayTransform.toObject([toDate(value)]);
  }

  public static function toString(value : Date) : String {
    return toDate(value).toString();
  }

  public static function toCode(value : Date) : String {
    return 'new Date(${toDate(value).getTime()})';
  }

  public static function toReference(value : Date) : String {
    return '';
  }
}