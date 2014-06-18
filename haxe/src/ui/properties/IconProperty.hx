package ui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import ui.components.Component;

class IconProperty extends Property<IconProperty> {
	public var iconName(default, null) : String;
	public function new(iconName : String) {
		super('icon');
		this.iconName = iconName;
	}

	override public function inject(component : Component) {
		return new IconPropertyImplementation(component, this);
	}
}

class IconPropertyImplementation extends PropertyImplementation<IconProperty> {
	public static function asIcon(component : Component) : IconPropertyImplementation {
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
		var current = getCurrentIcon(component.el),
			needsFa = current == null;
		icon = new Value(property.iconName);
		if(needsFa)
			component.el.classList.add('fa');
		icon.feed({
			onPulse : function(pulse) {
				switch pulse {
					case Emit(value):
						if(null != current)
							component.el.classList.remove(current);
						component.el.classList.add(current = 'fa-$value');
					case End:
						if(needsFa)
							component.el.classList.remove('fa');
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