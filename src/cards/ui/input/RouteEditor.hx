package cards.ui.input;

import cards.ui.input.Path;
import thx.stream.Bus;
import cards.model.SchemaType;
import cards.components.ComponentOptions;

class RouteEditor extends Editor implements IRouteEditor {
  public var diff(default, null) : Bus<DiffAt>;

  public function new(type : SchemaType, options : ComponentOptions) {
    super(type, options);
    diff = new Bus();
  }

  override public function dispose() {
    super.dispose();
    diff.clear();
  }

  public function typeAt(path : Path) : SchemaType {
    return throw 'abstract method';
  }
}