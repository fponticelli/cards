package cards.ui;

import cards.model.Model;
import cards.model.Runtime;
import thx.stream.Bus;
using thx.stream.Emitter;
import thx.stream.Value;
import cards.components.Component;
import cards.components.ComponentOptions;
import udom.Dom;
import cards.properties.ToggleClass;
import cards.properties.ValueProperty;
using thx.core.Arrays;
import cards.types.CodeTransform;
import cards.types.ReferenceTransform;
import cards.types.TypeTransform;
import cards.ui.editors.CodeEditor;
import cards.ui.editors.Editor;
import cards.ui.editors.EditorPicker;
using thx.stream.dom.Dom;
import haxe.ds.Option;
import cards.model.SchemaType;
import cards.ui.widgets.Tooltip;
import cards.ui.FieldValue;
using thx.core.Options;
using cards.model.Expression;
using StringTools;

class ContextField {
  public static var tooltip(default, null) : Tooltip = new Tooltip({ classes : 'tooltip error' });
  public var component(default, null) : Component;
  //public var editor(default, null) : Editor<Dynamic>;
  public var focus(default, null) : Value<Bool>;
  public var active(default, null) : Value<Bool>;
  public var name(default, null) : String;
  public var withError(default, null) : Value<Option<String>>;
  public var fieldValue(default, null) : FieldValue;
  public var type(default, null) : SchemaType;
  public var currentType(default, null) : Value<SchemaType>;

  public function new(options : ContextFieldOptions) {
    if(null == options.template && null == options.el)
      options.template = '<div class="field"><div class="key-container"><div class="key"></div></div><div class="value-container"></div></div>';

    component = new Component(options);
    // setup field key
    var key = Query.first('.key', component.el);
    key.textContent = options.display;

    name = options.name;
    type = options.type;
    currentType = new Value(options.type);

    focus = new Value(false);
    active = new Value(false);
    withError = new Value(None);

    function wireRuntime(editor : Editor<Dynamic>, convert : String -> Runtime) {
      var runtime = editor.value.mapValue(convert);
      runtime
        .distinct(function(a, b) {
          return b != null && a.dependencies.same(b.dependencies);
        })
        .subscribe(function(res : Runtime) {
          options.model.changes.subscribe(function(path) {
            if(res.dependencies.contains(path, function(a, b) return b.startsWith(a))) {
              options.value.runtime.set(Some(convert(editor.value.get())));
            }
          });
        });
      runtime
        .toOption()
        .feed(options.value.runtime);
      runtime
        .mapValue(function(res) return res.expression.toErrorOption())
        .merge(options.value.runtimeError)
        .feed(withError);
    }

    var bus = new Bus();
    fieldValue = new FieldValue(
      component,
      Query.first('.value-container', component.el),
      function(type : SchemaType, editor : Editor<Dynamic>) {
        editor.focus.feed(focus);
        currentType.set(type);
        switch type {
          case CodeType:
            wireRuntime(editor, function(value : String) return Runtime.toRuntime(value, options.model));
          case ReferenceType:
            wireRuntime(editor, function(value : String) return Runtime.toRuntime(ReferenceTransform.toCode(value), options.model));
            // TODO break loop!
            bus.subscribe(function(value : Dynamic) {
              var path = editor.value.get();
              options.modelView.setField(path, value, options.type);
            });
            options.value.stream.plug(bus);
          case _:
            options.value.runtime.set(None);
            editor.value.feed(options.value.stream);
            // TODO does this leak?
            options.value.stream.feed(editor.value);
        }
      },
      function(type : SchemaType, editor : Editor<Dynamic>) {
        switch type {
          case CodeType:
          case ReferenceType:
            trace("cancelling");
            bus.cancel();
          case _:
        }
      }
    );

    var runtime = options.value.runtime.get().toValue();
    if(null == runtime)
      fieldValue.setEditor(options.type, options.value.stream.get());
    else {
      var reference = CodeTransform.toReference(runtime.code);
      if(null != reference && "" != reference)
        fieldValue.setEditor(ReferenceType, CodeTransform.toReference(runtime.code));
      else
        fieldValue.setEditor(CodeType, runtime.code);
    }

    active.subscribe(component.el.subscribeToggleClass('active'));

    var clickKeyStream = key.streamClick()
      .subscribe(function(_) {
        if(null != fieldValue.editor)
          fieldValue.editor.focus.set(true);
      });

    // TODO is this properly cancelled?
    withError.toBool().subscribe(component.el.subscribeToggleClass('error'));
    withError.either(
      function(err) {
        tooltip.setContent(err);
        tooltip.anchorTo(component.el, Top, Bottom);
        tooltip.visible.stream.set(true);
      },
      function() {
        if(tooltip.anchorElement == component.el)
          tooltip.visible.stream.set(false);
      }
    );
  }

  public function destroy() {
    component.destroy();
    focus = null;
  }
}

typedef ContextFieldOptions = {>ComponentOptions,
  type : SchemaType,
  display : String,
  name : String,
  value : ValueProperty<Dynamic>,
  model : Model,
  modelView : ModelView
}