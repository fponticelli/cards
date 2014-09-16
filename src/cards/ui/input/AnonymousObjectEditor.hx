package cards.ui.input;

import cards.ui.widgets.Button;
import cards.ui.widgets.Menu;
import haxe.ds.Option;
import cards.ui.widgets.Toolbar;
import cards.model.SchemaType;
import js.Browser;
import js.html.Element;
import js.html.TableCellElement;
import js.html.TableElement;
using thx.core.Arrays;
using thx.core.Options;
using thx.stream.Emitter;
using udom.Dom;
import thx.stream.Value;
import cards.components.Component;

class AnonymousObjectEditor extends BaseObjectEditor {
  public function new(container : Element, parent : Component) {
    super(container, parent, []);
  }
}