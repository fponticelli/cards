package ui;

import steamer.Producer;
import sui.components.Component;
import sui.components.ComponentOptions;
import steamer.Value;
import sui.properties.Text;
using steamer.dom.Dom;

class TextEditor implements Focusable {
	public var component(default, null) : Component;
	public var text(default, null) : Value<String>;
	public var focus(default, null) : Producer<Focusable>;
	public var blur(default, null) : Producer<Focusable>;
	var cancel : Void -> Void;
	public function new(options : TextEditorOptions) {
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

		this.text = text.text;
		inputPair.producer
			.map(function(_) return text.component.el.textContent)
			.feed(this.text);

		focus = focusPair.producer
			.map(function(_) : Focusable return this);

		blur = blurPair.producer
			.map(function(_) : Focusable return this);

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