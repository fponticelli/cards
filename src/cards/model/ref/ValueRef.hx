package cards.model.ref;

using thx.core.Objects;
using thx.core.Arrays;

class ValueRef extends BaseRef implements IRef {
  var _hasValue : Bool = false;
  var value : Dynamic;

  public function get()
    return value;

  public function set(value : Dynamic) {
    this.value = value;
    _hasValue = true;
  }

  public function remove() : Void {
    value = null;
    _hasValue = false;
    parent.removeChild(this);
  }

  public function hasValue() : Bool
    return _hasValue;

  public function resolve(path : String, terminal : Bool = true) : IRef {
    if(path != "") throw 'unable to resolve path "$path" on ValueRef';
    return this;
  }
}