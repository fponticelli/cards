package ui.fragments;

import steamer.Value;
import sui.components.Component;
import sui.components.ComponentOptions;
using steamer.dom.Dom;

class ReadonlyBlock implements Fragment {
	public var name(default, null) : String = 'readonly';
	public var component(default, null) : Component;
	public var focus(default, null) : Value<Bool>;
	public var active(default, null) : Value<Bool>;
	public var uid(default, null) : String;

	var focusEvent : EventProducer;
	var blurEvent : EventProducer;
	public function new(options : FragmentOptions) {
		if(null == options.el && null == options.template)
			options.template = '<section class="readonly block" tabindex="0">readonly</div>';

		component = new Component(options);
		focus = new Value(false);
		active = new Value(false);
		focusEvent = component.el.produceEvent('focus');
		blurEvent  = component.el.produceEvent('blur');
		uid = null != options.uid ? options.uid : thx.core.UUID.create();

		focusEvent.producer
			.map(function(_) return true)
			.merge(blurEvent
				.producer
				.map(function(_) return false))
			.feed(focus);

		active.feed(function(isActive) {
			if(isActive)
				component.el.classList.add('active');
			else
				component.el.classList.remove('active');
		});
	}

	public function destroy() {
		focusEvent.cancel();
		blurEvent.cancel();
		component.destroy();
	}

	public function toString()
		return name;
}