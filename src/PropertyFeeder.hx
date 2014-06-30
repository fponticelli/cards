import sui.components.Component;
import sui.properties.Text;
import sui.properties.ToggleClass;
import sui.properties.ValueProperties;
import ui.fragments.FragmentProperties;
import ui.SchemaType;

class PropertyFeeder {
	static var classes = [
		{ display : 'bold', name : 'strong'},
		{ display : 'italis', name : 'emphasis'}
	];

	public static function feedProperties(properties : ValueProperties) {
		classes.map(function(p) properties.add(p.name, createToggleClass(p.display, p.name)));
		properties.add('text', createText());
	}

	public static function feedFragments(fragments : FragmentProperties) {
		fragments.associateMany('block', ['strong', 'emphasis']);
		fragments.associateMany('readonly', ['strong', 'emphasis', 'text']);
	}

	static function createToggleClass(display : String, name : String) : ValuePropertyInfo<Bool> {
		return {
			display : display,
			type    : BoolType,
			create  : function(component : Component) return new ToggleClass(component, name, name)
		};
	}

	static function createText() : ValuePropertyInfo<String> {
		return {
			display : 'content',
			type    : StringType,
			create  : function(component : Component) return new Text(component, '')
		};
	}
}