package cards.ui.input;

import cards.model.SchemaType;
using thx.core.Dynamics;
using thx.core.Tuple;

abstract DiffAt(Tuple2<Path, Diff>) {
  public inline function new(path : Path, diff : Diff)
    this = new Tuple2(path, diff);

  public var path(get, never) : Path;
  public var diff(get, never) : Diff;

  public inline function get_path() : Path
    return this._0;

  public inline function get_diff() : Diff
    return this._1;

  @:op(A==B) public static function equal(a : DiffAt, b : DiffAt) : Bool
    if(null == a && null == b)
      return true;
    else if(null == a || null == b)
      return false;
    else
      return Path.equal(a.path, b.path) && Dynamics.same(a.diff, b.diff);

  public function toString()
    return this._0.toString() + ':' + Std.string(this._1);
}