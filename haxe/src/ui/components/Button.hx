package ui.components;

import ui.properties.Click;
import ui.properties.Icon;

class Button extends Component {
	static var template = '<button></button>';
	public function new(options : ComponentOptions) {
		if(null == options.template)
			options.template = template;
		super(options);
		properties.add(new Click());
	}

	public static function withIcon(name : String, options : ComponentOptions) {
		var button = new Button(options);
		button.properties.add(new Icon(name));
		return button;
	}
}