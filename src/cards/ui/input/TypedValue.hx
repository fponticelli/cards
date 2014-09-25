package cards.ui.input;

import cards.model.SchemaType;
import thx.core.Tuple;
import thx.core.Dynamics;

abstract TypedValue(Tuple2<SchemaType, Dynamic>) {
  public inline function new(type : SchemaType, value : Dynamic)
    this = new Tuple2(type, value);

  @:to public inline function asType()
    return this._0;

  public inline function asValue() : Dynamic
    return this._1;

  @:from public static inline function fromString(s : String)
    return new TypedValue(StringType, s);

  @:from public static inline function fromFloat(f : Float)
    return new TypedValue(FloatType, f);

  @:from public static inline function fromDate(d : Date)
    return new TypedValue(DateType, d);

  @:from public static inline function fromBool(b : Bool)
    return new TypedValue(BoolType, b);

  @:to public function asString()
    return Std.string(this._1); // TODO: use type transform here

  @:op(A==B) public static function equal(a : TypedValue, b : TypedValue) {
    if(null == a && null == b)
      return true;
    else if(null == a || null == b)
      return false;
    else
      return Dynamics.equals(a.asValue(), b.asValue()) && Dynamics.equals(a.asType(), b.asType());
  }

  public function toString()
    return Std.string(this._1) + ' : ' + Std.string(this._0);
}