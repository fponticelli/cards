package ui.components;

class Button extends Component {
	static var template = '<button><span class="content"></span></button>';
	public function new(options : ComponentOptions) {
		if(null == options.template)
			options.template = template;
		super(options);
		properties.add(new ClickProperty());
	}

	public static function withIcon(name : String, options : ComponentOptions) {
		var button = new Button(options);
		button.properties.add(new IconProperty(name));
		return button;
	}
}