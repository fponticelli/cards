package ui;

import sui.components.Component;
import sui.components.ComponentOptions;
import sui.properties.ToggleClass;
import ui.TextEditor;

class Block {
	public var editor(default, null) : TextEditor;
	var classActive : ToggleClass;
	public function new(options : TextEditorOptions) {
		if(null == options.el && null == options.template)
			options.template = '<section class="block"></div>';
		editor = new TextEditor(options);

		classActive = new ToggleClass(editor.component, 'active');
		editor.focus.feed(classActive.toggleClassName);
	}

	public function destroy() {
		editor.destroy();
	}
}