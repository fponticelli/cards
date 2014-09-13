package cards.ui.input;

import cards.model.SchemaType;
import thx.core.Tuple;

abstract TypedValue(Tuple2<SchemaType, Dynamic>) {
  public inline function new(type : SchemaType, value : Dynamic)
    this = new Tuple2(type, value);

  @:to public inline function asType()
    return this._0;

  public inline function asValue() : Dynamic
    return this._1;

  @:from public static inline function fromString(s : String)
    return new TypedValue(StringType, s);

  @:to public function asString()
    return Std.string(this._1); // TODO use type transform here

  public function toString()
    return Std.string(this._1) + ' : ' + Std.string(this._0);
}