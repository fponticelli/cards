package cards.ui.input;

using StringTools;

abstract Path(Array<PathItem>) from Array<PathItem> to Array<PathItem> {
  inline public function new(arr : Array<PathItem>)
    this = arr;

  @:from public static function stringAsPath(path : String) : Path
    return path.replace('[', '.[').split('.')
      .filter(function(s) return s.length > 0)
      .map(function(v) {
        if(v.substr(0,1) == '[')
          return Index(Std.parseInt(v.substr(1, v.length - 1)));
        else
          return Field(v);
      });

  @:from public static function intAsPath(index : Int)
    return new Path([Index(index)]);

  @:to public inline function asArray() : Array<PathItem>
    return this;

  @:to public function toString() {
    if(null == this)
      return '';
    return this.map(function(item) return switch item {
        case Field(name): name.replace('.', '\\.');
        case Index(pos): '[$pos]';
      }).join('.').replace('.[', '[');
  }

  @:op(A==B) public function equal(other : Path) {
    var other : Array<PathItem> = other;
    if(this == null || other == null)
      return false;
    if(this.length != other.length)
      return false;
    for(i in 0...this.length) {
      if(!Type.enumEq(this[i], other[i]))
        return false;
    }
    return true;
  }

}

enum PathItem {
  Field(name : String);
  Index(pos : Int);
}
