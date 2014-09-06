import sui.components.Component;
import sui.properties.Text;
import sui.properties.ToggleClass;
import sui.properties.ValueProperties;
import ui.fragments.FragmentProperties;
import ui.SchemaType;

class PropertyFeeder {
  static var classes = [
    { display : 'bold', name : 'strong'},
    { display : 'italic', name : 'emphasis'}
  ];

  public static function feedProperties(properties : ValueProperties) {
    classes.map(function(p) properties.add(p.name, createToggleClass(p.display, p.name)));
    properties.add('text', createText());
  }

  public static function feedFragments(fragments : FragmentProperties) {
    fragments.associateMany('block', ['strong', 'emphasis', 'text']);
    fragments.associateMany('readonly', ['strong', 'emphasis', 'text']);
  }

  static function createToggleClass(display : String, name : String) : ValuePropertyInfo<Bool> {
    return {
      name    : name,
      display : display,
      type    : BoolType,
      create  : function(component : Component) {
        var cls = new ToggleClass(component, name, name);
        cls.stream.value = true;
        return cls;
      }
    };
  }

  static function createText() : ValuePropertyInfo<String> {
    return {
      name    : 'text',
      display : 'content',
      type    : StringType,
      create  : function(component : Component) return new Text(component, null) // null means that the text will be taken from the HTML
    };
  }
}