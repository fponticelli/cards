package cards.ui.fragments;

import thx.stream.Value;
import cards.components.Component;
import cards.properties.ToggleClass;
import cards.ui.editors.TextEditor;
using thx.stream.dom.Dom;

class Block implements Fragment {
  public var name(default, null) : String = 'block';
  public var component(default, null) : Component;
  public var focus(default, null) : Value<Bool>;
  public var active(default, null) : Value<Bool>;
  public var uid(default, null) : String;
  public var parent(default, null) : Fragment;
  public function new(options : BlockOptions) {
    if(null == options.el && null == options.template)
      options.template = '<div class="block" tabindex="1"></div>';
    parent = options.fragmentParent;
    uid = null != options.uid ? options.uid : thx.Uuid.create();
    component = new Component(options);
    active = new Value(false);
    active.feed(new ToggleClass(component, 'active').stream);

    focus = new Value(false);
    component.el.streamFocus().feed(focus);
  }

  public function destroy() {
    focus.clear();
    component.destroy();
  }

  public function toString()
    return name;
}

typedef BlockOptions = {> FragmentOptions,

}