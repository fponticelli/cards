package cards.model;

import haxe.Json;
import cards.model.ref.ObjectRef;
import cards.model.ref.IRef;
import thx.stream.Value;

class Data {
  var root : ObjectRef;
  var cache : Map<String, IRef>;
  public var value(default, null) : Value<{}>;

  public function new(data : {}) {
    value = new Value(data);
    reset(data);
  }

  function resolve(path : String) {
    var ref = cache.get(path);
    if(null == ref) {
      ref = root.resolve(path);
      if(ref.hasValue())
        cache.set(path, ref);
    }
    return ref;
  }

  public function get(path : String) : Dynamic
    return resolve(path).get();

  public function hasValue(path : String) : Bool
    return resolve(path).hasValue();

  public function set(path : String, value : Dynamic) : Data {
    var ref = resolve(path);
    cache.set(path, ref);
    if(ref.get() != value) {
      ref.set(value);
      this.value.set(toObject());
    }
    return this;
  }

  public function reset(value : Dynamic) : Data {
    root = new ObjectRef(null);
    cache = new Map();
    if(null != value) {
      set("", value);
    }
    this.value.set(toObject());
    return this;
  }

  public function remove(path : String) {
    var ref = cache.get(path);
    if(null == ref) {
      ref = root.resolve(path);
    }

    if(ref.hasValue()) {
      ref.remove();
      this.value.set(toObject());
    }
    cache.remove(path);
  }

  public function rename(oldpath : String, newpath : String) {
    if(!hasValue(oldpath) || hasValue(newpath))
      return false;
    var v = get(oldpath);
    remove(oldpath);
    set(newpath, v);
    this.value.set(toObject());
    return true;
  }

  public function toObject() : {}
    return root.get();

  public function toJSON()
    return Json.stringify(toObject());
}