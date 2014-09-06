package cards.model.ref;

using thx.core.Iterators;
using thx.core.Arrays;
using thx.core.Ints;

class ArrayRef extends BaseRef implements IRef implements IParentRef {
  var items : Map<Int, IRef>;
  var inverse : Map<IRef, Int>;

  public function new(?parent : IParentRef) {
    super(parent);
    items   = new Map();
    inverse = new Map();
  }

  public function get() {
    var res = [];
    items
      .keys()
      .toArray()
      .order(Ints.compare)
      .map(function(i) return items.get(i))
      .map(function(ref) {
        if(ref.hasValue())
          res.push(ref.get());
      });
    return res;
  }

  public function set(value : Dynamic) {
    if(!Std.is(value, Array)) throw 'value "$value" is not an array';

    (value : Array<Dynamic>).mapi(function(v, i) {
      var ref = items.get(i);
      if(null == ref) {
        items.set(i, ref = Ref.fromValue(v, this));
        inverse.set(ref, i);
      } else {
        ref.set(v);
      }
    });
  }

  public function remove() {
    for(ref in items) {
      ref.remove();
    }
    parent.removeChild(this);
  }

  public function removeChild(child : IRef) : Void {
    var i = inverse.get(child);
    if(null == i) throw '"$child" is not child of "$this"';
    items.remove(i);
    inverse.remove(child);
  }

  public function hasValue() {
    for(ref in items)
      if(ref.hasValue())
        return true;
    return false;
  }

  public function resolve(path : String, terminal : Bool = true) : IRef {
    if(path == "") return this;
    if(!Ref.reIndex.match(path))
      throw 'unable to resolve "$path" for ArrayRef';
    var index = Std.parseInt(Ref.reIndex.matched(1)),
      rest  = Ref.reIndex.matchedRight(),
      ref   = items.get(index);
    if(null == ref) {
      items.set(index, ref = Ref.fromPath(rest, this, terminal));
      inverse.set(ref, index);
    }
    return ref.resolve(rest, terminal);
  }
}