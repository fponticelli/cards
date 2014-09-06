package cards.model.ref;

using thx.core.Types;

class Ref {
  public static function fromValue(value : Dynamic, ?parent : IParentRef) : IRef {
    if(null == parent)
      parent = BaseRef.EmptyParent.instance;
    var ref : IRef = if(Std.is(value, Array)) {
        new ArrayRef(parent);
      } else if(Types.isAnonymousObject(value)) {
        new ObjectRef(parent);
      } else {
        new ValueRef(parent);
      }
    ref.set(value);
    return ref;
  }

  public static var reField = ~/^\.?([^.\[]+)/;
  public static var reIndex = ~/^\[(\d+)\]/;
  public static function fromPath(path : String, ?parent : IParentRef, terminal : Bool = true) : IRef {
    if(null == parent)
      parent = BaseRef.EmptyParent.instance;
    if(path == "") {
      return terminal ? new ValueRef(parent) : new UnknownRef(parent);
    } else if(reField.match(path)) {
      return new ObjectRef(parent);
    } else if(reIndex.match(path)) {
      return new ArrayRef(parent);
    } else {
      return throw 'invalid path "$path"';
    }
  }

  public static function resolvePath(path : String, ?parent : IParentRef, terminal : Bool = true) : IRef {
    var ref = fromPath(path, parent, terminal);
    return ref.resolve(path);
  }
}