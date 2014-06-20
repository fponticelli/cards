package ui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import ui.components.Component;

class Icon extends Property {
	public inline static function asIcon(component : Component) : Icon {
		return cast component.properties.get('icon');
	}

	static function getCurrentIcon(el : Element) {
		for(i in 0...el.classList.length) {
			var className = el.classList.item(i);
			if(className.substr(0, 3) == "fa-")
				return className.substr(3);
		}
		return null;
	}

	public function new(component : Component, defaultIcon : String) {
		this.defaultIcon = defaultIcon;
		super(component, 'icon');
	}

	public var defaultIcon(default, null) : String;
	public var icon(default, null) : Value<String>;

	override function init() : Void -> Void {
		var el       = component.el,
			current  = getCurrentIcon(el),
			original = current,
			needsFa  = current == null;
		icon = new Value(defaultIcon);
		if(needsFa)
			el.classList.add('fa');
		icon.feed({
			onPulse : function(pulse) {
				switch pulse {
					case Emit(value):
						if(null != current)
							el.classList.remove(current);
						el.classList.add(current = 'fa-$value');
					case End:
						if(needsFa)
							el.classList.remove('fa');
						el.classList.remove(current);
						if(null != original)
							el.classList.add(original);
					case _:
				}
			}
		});
		return function() {
			icon.terminate();
			icon = null;
		};
	}
}