package cards.ui.fragments;

import thx.stream.Value;
import cards.components.Component;
import cards.properties.ToggleClass;
import cards.ui.editors.TextEditor;

class Block implements Fragment {
  public var name(default, null) : String = 'block';
  public var editor(default, null) : TextEditor;
  public var component(default, null) : Component;
  public var focus(default, null) : Value<Bool>;
  public var active(default, null) : Value<Bool>;
  public var uid(default, null) : String;
  public function new(options : BlockOptions) {
    if(null == options.el && null == options.template)
      options.template = '<section class="block"></div>';
    uid = null != options.uid ? options.uid : thx.core.UUID.create();
    if(null == options.placeHolder)
      options.placeHolder = 'block content';
    editor = new TextEditor(options);
    active = new Value(false);
    active.feed(new ToggleClass(editor.component, 'active').stream);
    focus = editor.focus;
    component = editor.component;
  }

  public function destroy() {
    editor.destroy();
  }

  public function toString()
    return name;
}

typedef BlockOptions = {> TextEditorOptions,
  ?uid : String
}