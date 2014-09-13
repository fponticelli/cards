package cards.ui.input;

import cards.model.SchemaType;
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

  public function toString()
    return this._0.toString() + ':' + Std.string(this._1);
}