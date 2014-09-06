package thx.ref;

using thx.core.Objects;
using thx.core.Arrays;

class UnknownRef extends BaseRef implements IRef implements IParentRef {
  public var ref(default, null) : Null<IRef>;
  var hasRef : Bool = false;

  public function get()
    return hasRef ? ref.get() : null;

  public function set(value : Dynamic) {
    if(hasRef)
      ref.set(value);
    else {
      hasRef = true;
      ref = Ref.fromValue(value, this);
    }
  }

  public function remove() : Void {
    if(hasRef)
      ref.remove();
    parent.removeChild(this);
  }

  public function removeChild(child : IRef) : Void {
    if(hasRef) {
      ref = null;
      hasRef = false;
    }
  }

  public function hasValue() : Bool
    return hasRef && ref.hasValue();

  public function resolve(path : String, terminal : Bool = true) : IRef {
    if(hasRef)
      return ref.resolve(path, terminal);
    if(path == "")
      return this;
    hasRef = true;
    ref = Ref.fromPath(path, this, terminal);
    return ref.resolve(path, terminal);
  }
}