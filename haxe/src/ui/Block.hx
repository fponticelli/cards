package ui;

import sui.components.Component;
import sui.components.ComponentOptions;
import ui.TextEditor;

class Block {
	public var editor(default, null) : TextEditor;

	public function new(options : TextEditorOptions) {
		if(null == options.el && null == options.template)
			options.template = '<section class="block"></div>';
		editor = new TextEditor(options);
	}
}