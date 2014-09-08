package cards.ui.fragments;

import thx.stream.Value;
import cards.components.Component;

interface Fragment {
  public var name(default, null) : String;
  public var component(default, null) : Component;
  public var focus(default, null) : Value<Bool>;
  public var active(default, null) : Value<Bool>;
  public var uid(default, null) : String;
  public var parent(default, null) : Fragment;
  public function toString() : String;
}