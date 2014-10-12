package cards.ui;

import udom.Dom;
import haxe.ds.Option;
import js.html.Element;
import thx.stream.Value;
import cards.components.Component;
import cards.components.ComponentOptions;
import cards.properties.ValueProperties;
import cards.properties.ValueProperty;
import cards.ui.fragments.FragmentMapper;
import cards.model.Model;
import cards.model.SchemaType;
import cards.ui.widgets.Button;
import cards.ui.fragments.Fragment;
import cards.ui.widgets.Menu;
import cards.ui.widgets.Toolbar;
using thx.core.Options;
using thx.stream.Emitter;

class ContextView2 {
  public var component(default, null) : Component;
  public var toolbar(default, null) : Toolbar;
  public var document(default, null) : Document;
  public var field(default, null) : Value<Option<ContextField>>;
  public var model(default, null) : Model;
  public var modelView(default, null) : ModelView;
  var el : Element;
  var button : {
    add : Button,
    remove : Button,
    toValue : Button,
    toCode : Button,
    toReference : Button
  };
  var menu : {
    add : Menu
  };
  var mapper : FragmentMapper;

  public function new(document : Document, model : Model, modelView : ModelView, mapper : FragmentMapper, options : ComponentOptions) {
    this.document = document;
    this.model = model;
    this.modelView = modelView;
    this.mapper = mapper;
    component = new Component(options);
    toolbar   = new Toolbar({ parent : component, container : component.el });
    el = Html.parse('<div class="fields"><div></div></div>');
    component.el.appendChild(el);
    el = Query.first('div', el);

    button = {
      add : toolbar.left.addButton('', Config.icons.dropdown),
      toValue : toolbar.center.addButton('', Config.icons.value),
      toCode : toolbar.center.addButton('', Config.icons.code),
      toReference : toolbar.center.addButton('', Config.icons.reference),
      remove : toolbar.right.addButton('', Config.icons.remove)
    };
    menu = {
      add : new Menu({ parent : component })
    };

    menu.add.anchorTo(button.add.component.el);
    button.add.clicks.toTrue().feed(menu.add.visible.stream);

    button.add.enabled.set(false);

    button.remove.clicks.subscribe(function(_) {
      var field = field.get().toValue(),
          fragment = document.article.fragment.get().toValue();
      fragment.component.properties.get(field.name).dispose();
      field.destroy();
      setAddMenuItems(fragment);
    });

    button.toValue.clicks.subscribe(function(_) {
      var field = field.get().toValue(),
          type  = field.fieldValue.type;
      field.fieldValue.setEditor(field.type);
    });
    button.toCode.clicks.subscribe(function(_) {
      var field = field.get().toValue(),
          type  = field.fieldValue.type;
      field.fieldValue.setEditor(CodeType);
    });
    button.toReference.clicks.subscribe(function(_) {
      var field = field.get().toValue(),
          type  = field.fieldValue.type;
      field.fieldValue.setEditor(ReferenceType);
    });

    field = new Value(None);
    var delayed = field
      .debounce(10);

    delayed
      .toBool()
      .feed(button.remove.enabled);
    field
      .filterOption()
      .map(function(v) : Emitter<SchemaType> return v.currentType)
      .flatMap()
      .subscribe(function(type) {
        switch type {
          case CodeType:
            button.toCode.enabled.set(false);
            button.toReference.enabled.set(true);
            button.toValue.enabled.set(true);
          case ReferenceType:
            button.toCode.enabled.set(true);
            button.toReference.enabled.set(false);
            button.toValue.enabled.set(true);
          case _:
            button.toCode.enabled.set(true);
            button.toReference.enabled.set(true);
            button.toValue.enabled.set(false);
        }
      });

    var filtered = field.filterOption();
    filtered.previous().subscribe(function(field : ContextField)
      field.active.set(false));
    filtered.subscribe(function(field : ContextField)
      field.active.set(true));

    document.article.fragment.either(setFragmentStatus, resetFragmentStatus);
  }

  function resetFragmentStatus() {
    resetFields();
    resetAddMenuItems();
  }

  function setFragmentStatus(fragment : Fragment) {
    setFields(fragment);
    setAddMenuItems(fragment);
  }

  function resetFields() {
    el.innerHTML = '';
  }

  function setFields(fragment : Fragment) {
    resetFields();
    mapper
      .getAttachedPropertiesForFragment(fragment)
      .map(function(info) {
        var value = cast(fragment.component.properties.get(info.name), ValueProperty<Dynamic>);
        addField(info, value);
      });
  }

  function addField(info : ValuePropertyInfo<Dynamic>, value : ValueProperty<Dynamic>) {
    var f = new ContextField({
        container : el,
        parent    : component,
        display   : info.display,
        name      : info.name,
        type      : info.type,
        value     : value,
        model     : model,
        modelView : modelView
      });

    f.focus
      .withValue(true)
      .map(function(_) return Some(f))
      .feed(field);
  }

  function resetAddMenuItems() {
    button.remove.enabled.set(false);
    button.toValue.enabled.set(false);
    button.toCode.enabled.set(false);
    button.toReference.enabled.set(false);
    button.add.enabled.set(false);
    menu.add.clear();
  }

  function setAddMenuItems(fragment : Fragment) {
    resetAddMenuItems();
    var attachables = mapper.getAttachablePropertiesForFragment(fragment);
    button.add.enabled.set(attachables.length > 0);
    attachables.map(function(info) {
      var button = new Button('add ${info.display}');
      menu.add.addItem(button.component);
      button.clicks.subscribe(function(_) {
        mapper.values.ensure(info.name, fragment.component);
        setFragmentStatus(fragment);
      });
    });
  }
}