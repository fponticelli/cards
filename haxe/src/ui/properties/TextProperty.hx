package ui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import ui.components.Component;

class TextProperty extends Property<TextProperty> {
	public var defaultText(default, null) : String;
	public function new(defaultText : String) {
		super('text');
		this.defaultText = defaultText;
	}

	override public function inject(component : Component) {
		return new TextPropertyImplementation(component, this);
	}
}

class TextPropertyImplementation extends PropertyImplementation<TextProperty> {
	public static function asText(component : Component) : TextPropertyImplementation {
		return cast component.properties.implementations.get('text');
	}

	public var text(default, null) : Value<String>;

	override function init() : Void -> Void {
		var el       = component.el,
			current  = getCurrentIcon(el),
			original = current;
		text = new Value(property.iconName);
		el.classList.add('fa');
		text.feed({
			onPulse : function(pulse) {
				switch pulse {
					case Emit(value):
						if(null != current)
							el.classList.remove(current);
						el.classList.add(current = 'fa-$value');
					case End:
						el.classList.remove(current);
						if(null != original)
							el.classList.add(original);
						else
							el.classList.remove('fa');
					case _:
				}
			}
		});
		return function() {
			text.terminate();
			text = null;
		};
	}
}