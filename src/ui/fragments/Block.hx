package ui.fragments;

import steamer.Value;
import sui.components.Component;
import sui.properties.ToggleClass;
import ui.editors.TextEditor;

class Block implements Fragment {
	public var name(default, null) : String = 'block';
	public var editor(default, null) : TextEditor;
	public var component(default, null) : Component;
	public var focus(default, null) : Value<Bool>;
	public var active(default, null) : Value<Bool>;
	public function new(options : TextEditorOptions) {
		if(null == options.el && null == options.template)
			options.template = '<section class="block"></div>';
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