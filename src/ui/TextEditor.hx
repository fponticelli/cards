package ui;

import steamer.Producer;
import sui.components.Component;
import sui.components.ComponentOptions;
import steamer.Value;
import sui.properties.Text;
import ui.SchemaType;
using steamer.dom.Dom;

class TextEditor implements Editor {
	public var component(default, null) : Component;
	public var text(default, null) : Value<String>;
	public var focus(default, null) : Value<Bool>;
	public var value(default, null) : Value<Dynamic>;
	public var type(default, null) : SchemaType;
	var cancel : Void -> Void;
	public function new(options : TextEditorOptions) {
		type = StringType;
		if(null == options.defaultText)
			options.defaultText = '';
		if(null == options.el && null == options.template)
			options.template = '<span></span>';
		component = new Component(options);
		component.el.setAttribute('contenteditable', cast true);

		var text      = new Text(component, options.defaultText),
			inputPair = component.el.produceEvent('input'),
			focusPair = component.el.produceEvent('focus'),
			blurPair  = component.el.produceEvent('blur');

		this.text = text.stream;
		this.value = new Value(options.defaultText);
		this.text.feed(this.value);
		inputPair.producer
			.map(function(_) return text.component.el.textContent)
			.feed(this.text);

		focus = new Value(false);
		focusPair.producer
			.map(function(_) return true)
			.merge(
				blurPair.producer
					.map(function(_) return false)
			).feed(focus);
		cancel = function() {
			text.dispose();
			inputPair.cancel();
			focusPair.cancel();
			blurPair.cancel();
		};
	}

	public function destroy() {
		text.terminate();
		component.destroy();
		cancel();
	}
}

typedef TextEditorOptions = {> ComponentOptions,
	defaultText : String
}