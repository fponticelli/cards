package ui;

import steamer.Feeder;
import steamer.Producer;
import steamer.Value;
import sui.components.Component;
import sui.components.ComponentOptions;
import dom.Dom;
import sui.properties.ToggleClass;
import sui.properties.ValueProperty;
using thx.core.Arrays;
import types.CodeTransform;
import types.ReferenceTransform;
import types.TypeTransform;
import ui.editors.CodeEditor;
import ui.editors.Editor;
import ui.editors.EditorPicker;
using steamer.dom.Dom;
import haxe.ds.Option;
import ui.SchemaType;
import ui.widgets.Tooltip;
import ui.FieldValue;
using thx.core.Options;
using ui.Expression;
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
    key.innerText = options.display;

    name = options.name;
    type = options.type;
    currentType = new Value(options.type);

    focus = new Value(false);
    active = new Value(false);
    withError = new Value(None);

    function wireRuntime(editor : Editor<Dynamic>, convert : String -> Runtime) {
      var runtime = editor.value.map(convert);
      runtime
        .distinct(function(a, b) {
          return b != null && a.dependencies.same(b.dependencies);
        })
        .feed(function(res : Runtime) {
          options.model.changes.feed(function(path) {
            if(res.dependencies.contains(path, function(a, b) return b.startsWith(a))) {
              options.value.runtime.value = Some(convert(editor.value.value));
            }
          });
        });
      runtime
        .toOption()
        .feed(options.value.runtime);
      runtime
        .map(function(res) return res.expression.toErrorOption())
        .merge(options.value.runtimeError)
        .feed(withError);
    }

    var bus = new Feeder();
    fieldValue = new FieldValue(
      component,
      Query.first('.value-container', component.el),
      function(type : SchemaType, editor : Editor<Dynamic>) {
        editor.focus.feed(focus);
        currentType.value = type;
        switch type {
          case CodeType:
            wireRuntime(editor, function(value : String) return Runtime.toRuntime(value, options.model));
          case ReferenceType:
            wireRuntime(editor, function(value : String) return Runtime.toRuntime(ReferenceTransform.toCode(value), options.model));
            // TODO break loop!
            bus.feed(function(value : Dynamic) {
              var path = editor.value.value;
              options.modelView.setField(path, value, options.type);
            });
            options.value.stream.feed(bus);
          case _:
            options.value.runtime.value = None;
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

    var runtime = options.value.runtime.value.toValue();
    if(null == runtime)
      fieldValue.setEditor(options.type, options.value.value);
    else {
      var reference = CodeTransform.toReference(runtime.code);
      if(null != reference && "" != reference)
        fieldValue.setEditor(ReferenceType, CodeTransform.toReference(runtime.code));
      else
        fieldValue.setEditor(CodeType, runtime.code);
    }

    active.feed(component.el.consumeToggleClass('active'));

    var clickKey = key.produceEvent('click');
    clickKey.producer
      .feed(function(_) {
        if(null != fieldValue.editor)
          fieldValue.editor.focus.value = true;
      });

    var hasError = component.el.consumeToggleClass('error');
    withError.map(function(o) {
      return switch o {
        case None: false;
        case Some(_): true;
      }
    }).feed(hasError);
    withError.feed(function(o) {
      switch o {
        case Some(err):
          tooltip.setContent(err);
          tooltip.anchorTo(component.el, Top, Bottom);
          tooltip.visible.value = true;
        case _:
          if(tooltip.anchorElement == component.el)
            tooltip.visible.value = false;
      }
    });

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