package ui.fragments;

abstract FragmentName(String) {
  @:from public inline static function fromFragment(fragment : Fragment)
    return new FragmentName(fragment.name);

  @:from public inline static function fromString(name : String)
    return new FragmentName(name);

  public inline function new(name : String)
    this = name;

  @:to public inline function toString()
    return this;
}