package ui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import ui.components.Component;

class Icon extends Property<Icon> {
	public var iconName(default, null) : String;
	public function new(iconName : String) {
		super('icon');
		this.iconName = iconName;
	}

	override public function inject(component : Component) {
		return new IconImplementation(component, this);
	}
}

class IconImplementation extends Implementation<Icon> {
	public static function asIcon(component : Component) : IconImplementation {
		return cast component.properties.implementations.get('icon');
	}

	public var icon(default, null) : Value<String>;

	static function getCurrentIcon(el : Element) {
		for(i in 0...el.classList.length) {
			var className = el.classList.item(i);
			if(className.substr(0, 3) == "fa-")
				return className.substr(3);
		}
		return null;
	}

	override function init() : Void -> Void {
		var el       = component.el,
			current  = getCurrentIcon(el),
			original = current,
			needsFa  = current == null;
		icon = new Value(property.iconName);
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