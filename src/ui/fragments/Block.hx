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
	var classActive : ToggleClass;
	public function new(options : TextEditorOptions) {
		if(null == options.el && null == options.template)
			options.template = '<section class="block"></div>';
		editor = new TextEditor(options);

		classActive = new ToggleClass(editor.component, 'active');
		editor.focus.feed(classActive.stream);
		focus = editor.focus;
		component = editor.component;
	}

	public function destroy() {
		editor.destroy();
	}

	public function toString()
		return name;
}