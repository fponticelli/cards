package ui.editors;

using steamer.Producer;
import js.html.Element;
import js.html.Event;
import sui.components.Component;
import sui.components.ComponentOptions;
import steamer.Value;
import sui.properties.Text;
import ui.SchemaType;
using steamer.dom.Dom;
import js.Browser;

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
			options.placeHolder = '';
		if(null == options.el && null == options.template)
			options.template = '<div></div>';
		if(null == options.inputEvent)
			options.inputEvent = function(component : Component) return component.el.produceEvent('input');

		component = new Component(options);
		component.el.classList.add('editor');
		component.el.setAttribute('tabindex', '0');
		component.el.setAttribute('placeholder', options.placeHolder);

		// TODO find out how to set the content of :before programmatically
		component.el.style.content = options.placeHolder;

		var text       = new Text(component, options.defaultText),
			inputPair  = options.inputEvent(component),
			changePair = component.el.produceEvent('input'),
			focusPair  = component.el.produceEvent('focus'),
			blurPair   = component.el.produceEvent('blur');

		value = text.stream;
		inputPair.producer
			.map(function(_) return text.component.el.textContent)
			.feed(value);

		focus = new Value(false);
		focus.feed(component.el.consumeToggleAttribute('contenteditable', 'true'));
		focus.filterValue(true).feed(component.el.consumeFocus());
		focus
			.filterValue(true)
			.feed(function(_) {
				Browser.document.getSelection().selectAllChildren(component.el);
			});

		focusPair.producer
			.map(function(_) return true)
			.merge(
				blurPair.producer
					.map(function(_) return false)
			).feed(focus);
		cancel = function() {
			text.dispose();
			changePair.cancel();
			inputPair.cancel();
			focusPair.cancel();
			blurPair.cancel();
		};

		var empty = new Value(options.defaultText == '');
		changePair.producer
			.map(function(_) return text.component.el.textContent == '')
			.feed(empty);
		empty.feed(component.el.consumeToggleClass('empty'));
	}

	public function destroy() {
		value.end();
		component.destroy();
		cancel();
	}
}

typedef TextEditorOptions = {> ComponentOptions,
	defaultText : String,
	?placeHolder : String,
	?inputEvent : Component -> { producer : Producer<Event>, cancel : Void -> Void }
}