package thx.ref;

class BaseRef {
  public var parent(default, null) : IParentRef;
  public function new(?parent : IParentRef) {
    this.parent = null != parent ? parent : EmptyParent.instance;
  }

  public function getRoot() : IRef {
    var ref : IRef = cast this;
    while(!Std.is(ref.parent, BaseRef.EmptyParent))
      ref = cast ref.parent;
    return ref;
  }
}

class EmptyParent implements IParentRef {
  public static var instance(default, null) : IParentRef = new EmptyParent();

  function new() {}

  public function removeChild(child : IRef) { }
}