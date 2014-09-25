package cards.ui;

import cards.types.TypeTransform;
import cards.ui.input.AnonymousObjectEditor;
import cards.ui.input.DiffAt;
import cards.ui.input.Path;
import cards.ui.input.TypedValue;
import js.html.Element;
using thx.stream.Emitter;
import cards.components.Component;
import cards.model.DataEvent;
import cards.model.SchemaEvent;
import cards.model.SchemaType;
import cards.ui.widgets.Toolbar;
import udom.Dom;
import thx.stream.Bus;

class ModelView {
  public var component(default, null) : Component;
  //public var schema(default, null) : Emitter<SchemaEvent>;
  public var data(default, null) : Emitter<DataEvent>;

  //var schemaBus : Bus<SchemaEvent>;
  var dataBus : Bus<DataEvent>;
  var editor : AnonymousObjectEditor;
  public function new() {
    component = new Component({
      template : '<div class="modelview"></div>'
    });

    //schema = this.schemaBus = new Bus();
    data = this.dataBus = new Bus();

    editor = new AnonymousObjectEditor(component.el, component);
    editor.diff.subscribe(function(d) switch [d.diff, d.path] {
      case [Add, path]:
        //schemaBus.pulse(SchemaEvent.AddField(path.toString(), editor.typeAt(path)));
      case [Remove, path]:
        //schemaBus.pulse(SchemaEvent.DeleteField(path.toString()));
      case [Set(v), path]:
        dataBus.pulse(DataEvent.SetValue(path, v.asValue(), v.asType()));
    });
  }

  public function setField(path : Path, value : Dynamic, type : SchemaType) {
    if(path == "" || path == null)
      return;
      editor.diff.pulse(new DiffAt(path, Set(new TypedValue(type, value))));
  }
}