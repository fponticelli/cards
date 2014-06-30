package ui.editors;

import steamer.Producer;
import sui.components.Component;
import sui.components.ComponentOptions;
import steamer.Value;
import sui.properties.Text;
import ui.SchemaType;
import ui.editors.TextEditor;
using steamer.dom.Dom;

class CodeEditor extends TextEditor {
	public function new(options : TextEditorOptions) {
		super(options);
		component.el.classList.add('code');
	}
}