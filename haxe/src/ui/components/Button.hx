package ui.components;

import ui.properties.Click;
import ui.properties.Icon;

class Button extends Component {
	public static function withIcon(iconName : String, options : ComponentOptions) {
		var button = new Button(options);
		new Icon(button, iconName);
		return button;
	}

	static var template = '<button></button>';
	public function new(options : ComponentOptions) {
		if(null == options.template)
			options.template = template;
		super(options);
		new Click(this);
	}
}