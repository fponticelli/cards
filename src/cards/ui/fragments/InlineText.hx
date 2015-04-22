package cards.ui.fragments;

import thx.stream.Value;
import cards.components.Component;
import cards.properties.ToggleClass;
import cards.ui.editors.TextEditor;

class InlineText implements Fragment {
  public var name(default, null) : String = 'text';
  public var editor(default, null) : TextEditor;
  public var component(default, null) : Component;
  public var focus(default, null) : Value<Bool>;
  public var active(default, null) : Value<Bool>;
  public var uid(default, null) : String;
  public var parent(default, null) : Fragment;
  public function new(options : InlineTextOptions) {
    if(null == options.el && null == options.template)
      options.template = '<span class="text"></span>';
    uid = null != options.uid ? options.uid : thx.Uuid.create();
    if(null == options.placeHolder)
      options.placeHolder = 'type some content';
    parent = options.fragmentParent;
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

typedef InlineTextOptions = {> TextEditorOptions,
  ?uid : String,
  fragmentParent : cards.ui.fragments.Block
}
