package ui.editors;

using steamer.Producer;
import js.html.KeyboardEvent;
import sui.components.Component;
import sui.components.ComponentOptions;
import steamer.Value;
import sui.properties.Text;
import ui.SchemaType;
using steamer.dom.Dom;

class BoolEditor implements Editor<Bool> {
	public var component(default, null) : Component;
	public var focus(default, null) : Value<Bool>;
	public var value(default, null) : Value<Bool>;
	public var type(default, null) : SchemaType;
	var cancel : Void -> Void;
	public function new(options : BoolEditorOptions) {
		type = BoolType;
		if(null == options.defaultValue)
			options.defaultValue = false;
		if(null == options.el && null == options.template)
			options.template = '<div></div>';
		component = new Component(options);
		var cls = component.el.classList;
		cls.add('fa');
		cls.add('editor');
		cls.add('bool');
		cls.add('fa-' + Config.icons.unchecked);
		component.el.setAttribute('tabindex', '0');

		value = new Value(options.defaultValue);
		var clickPair    = component.el.produceEvent('click'),
			focusPair    = component.el.produceEvent('focus'),
			blurPair     = component.el.produceEvent('blur'),
			keyboardPair = component.el.produceKeyboardEvent('up');

		value
			.feed(component.el.consumeToggleClass('fa-' + Config.icons.checked));
		value
			.negate()
			.feed(component.el.consumeToggleClass('fa-' + Config.icons.unchecked));

		clickPair.producer
			.toNil()
			.merge(
				keyboardPair.producer
					.filter(function(e : KeyboardEvent) {
						return switch e.keyCode {
							case 32, 13: // spacebar, return
								true;
							case _:
								false;
						};
					})
					.toNil()
			)
			.map(function(_) return !value.value)
			.feed(value);

		focus = new Value(false);
		focus.filterValue(true).feed(component.el.consumeFocus());
		focusPair.producer
			.map(function(_) return true)
			.merge(
				blurPair.producer
					.map(function(_) return false)
			).feed(focus);
		cancel = function() {
			clickPair.cancel();
			focusPair.cancel();
			blurPair.cancel();
			keyboardPair.cancel();
		};
	}

	public function destroy() {
		cancel();
		component.destroy();
		value.end();
	}
}

typedef BoolEditorOptions = {> ComponentOptions,
	defaultValue : Bool
}