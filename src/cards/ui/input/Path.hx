package cards.ui.input;

using StringTools;

abstract Path(Array<PathItem>) from Array<PathItem> to Array<PathItem> {
  inline public function new(arr : Array<PathItem>)
    this = arr;

  @:from public static function fromString(path : String)
    return path.replace('[', '.[').split('.').map(function(v) {
        if(v.substr(0,1) == '[')
          return Index(Std.parseInt(v.substr(1, v.length - 1)));
        else
          return Field(v);
      });

  @:to public function toString()
    return this.map(function(item) return switch item {
        case Field(name): name.replace('.', '\\.');
        case Index(pos): '[$pos]';
      }).join('.').replace('.[', '[');
}

enum PathItem {
  Field(name : String);
  Index(pos : Int);
}