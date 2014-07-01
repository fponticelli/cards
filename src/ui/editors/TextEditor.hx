package ui.editors;

using steamer.Producer;
import sui.components.Component;
import sui.components.ComponentOptions;
import steamer.Value;
import sui.properties.Text;
import ui.SchemaType;
using steamer.dom.Dom;

class TextEditor implements Editor<String> {
	public var component(default, null) : Component;
	public var focus(default, null) : Value<Bool>;
	public var value(default, null) : Value<String>;
	public var type(default, null) : SchemaType;
	var cancel : Void -> Void;
	public function new(options : TextEditorOptions) {
		type = StringType;
		if(null == options.defaultText)
			options.defaultText = '';
		if(null == options.placeHolder)
			options.placeHolder = 'placeholder';
		if(null == options.el && null == options.template)
			options.template = '<span></span>';
		component = new Component(options);
		component.el.classList.add('editor');
		component.el.setAttribute('contenteditable', cast true);

		// TODO find out how to set the content of :before programmatically
		component.el.style.content = options.placeHolder;

		var text      = new Text(component, options.defaultText),
			inputPair = component.el.produceEvent('input'),
			focusPair = component.el.produceEvent('focus'),
			blurPair  = component.el.produceEvent('blur');

		value = text.stream;
		inputPair.producer
			.map(function(_) return text.component.el.textContent)
			.feed(value);

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

		value
			.toBool()
			.negate()
			.feed(component.el.consumeToggleClass('empty'));
	}

	public function destroy() {
		value.terminate();
		component.destroy();
		cancel();
	}
}

typedef TextEditorOptions = {> ComponentOptions,
	defaultText : String,
	?placeHolder : String
}