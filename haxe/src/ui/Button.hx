package ui;

import js.html.Event;
import steamer.Producer;
import sui.components.Component;
using steamer.dom.Dom;

class Button {
	public var component(default, null) : Component;
	public var clicks(default, null) : Producer<Event>;
	var cancel : Void -> Void;
	public function new(text = '', ?icon : String) {
		component = new Component({
			template : null == icon
				? '<button>$text</button>'
				: '<button class="fa fa-$icon">$text</button>'
		});
		var pair = component.el.produceEvent('click');
		clicks = pair.producer;
		cancel = pair.cancel;
	}

	public function destroy() {
		cancel();
		component.destroy();
	}
}