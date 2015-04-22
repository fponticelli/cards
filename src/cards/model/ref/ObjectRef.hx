package cards.model.ref;

using thx.Iterators;
using thx.Iterables;
import thx.Types;

class ObjectRef extends BaseRef implements IRef implements IParentRef {
  var fields : Map<String, IRef>;
  var inverse : Map<IRef, String>;

  public function new(?parent : IParentRef) {
    super(parent);
    fields = new Map();
    inverse = new Map();
  }

  public function get() : Dynamic {
    var o = {};
    fields.keys().map(function(key) {
      var ref = fields.get(key);
      if(!ref.hasValue()) return;
      Reflect.setField(o, key, ref.get());
    });
    return o;
  }

  public function set(obj : Dynamic) {
    if(!Types.isAnonymousObject(obj)) throw 'object "$obj" is not an anonymous object';
    Reflect.fields(obj).map(function(field) {
      var ref   = fields.get(field),
        value = Reflect.field(obj, field);
      if(null == ref) {
        ref = Ref.fromValue(value, this);
        fields.set(field, ref);
        inverse.set(ref, field);
      } else {
        ref.set(value);
      }
    });
  }

  public function hasValue() {
    for(ref in fields)
      if(ref.hasValue())
        return true;
    return false;
  }

  public function remove() {
    fields.map(function(ref) ref.remove());
    parent.removeChild(this);
  }

  public function removeChild(child : IRef) {
    var key = inverse.get(child);
    if(null == key) throw '"$child" is not child of "$this"';
    inverse.remove(child);
    fields.remove(key);
  }

  public function resolve(path : String, terminal : Bool = false) : IRef {
    if(path == "") return this;
    if(!Ref.reField.match(path))
      throw 'unable to resolve "$path" for ObjectRef';
    var field = Ref.reField.matched(1),
        rest  = Ref.reField.matchedRight(),
        ref   = fields.get(field);
    if(null == ref) {
      fields.set(field, ref = Ref.fromPath(rest, this, terminal));
      inverse.set(ref, field);
    }
    return ref.resolve(rest, terminal);
  }

  public function toString()
    return 'ObjectRef: $fields';
}