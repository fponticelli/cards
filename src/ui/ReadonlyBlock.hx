package ui;

import steamer.Value;
import sui.components.Component;
import sui.components.ComponentOptions;
import sui.properties.ToggleClass;
import ui.TextEditor;
using steamer.dom.Dom;
using steamer.Consumer;

class ReadonlyBlock implements Fragment {
	public var name(default, null) : String = 'readonly';
	public var component(default, null) : Component;
	public var focus(default, null) : Value<Bool>;

	var focusEvent : EventProducer;
	var blurEvent : EventProducer;
	public function new(options : ComponentOptions) {
		if(null == options.el && null == options.template)
			options.template = '<section class="readonly block" tabindex="0">readonly</div>';

		component = new Component(options);
		focus = new Value(false);
		focusEvent = component.el.produceEvent('focus');
		blurEvent  = component.el.produceEvent('blur');

		focusEvent.producer
			.map(function(_) return true)
			.merge(blurEvent
				.producer
				.map(function(_) return false))
			.feed(focus);

		focus.feed(function(focused) {
			if(focused)
				component.el.classList.add('active');
			else
				component.el.classList.remove('active');
		}.toConsumer());
	}

	public function destroy() {
		focusEvent.cancel();
		blurEvent.cancel();
		component.destroy();
	}

	public function toString()
		return name;
}