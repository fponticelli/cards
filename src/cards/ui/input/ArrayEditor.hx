package cards.ui.input;

import cards.ui.widgets.*;
import cards.model.SchemaType;
import js.Browser;
import js.html.Element;
import js.html.LIElement;
import cards.ui.input.EditorFactory;
import thx.stream.Value;
using thx.stream.Emitter;
import haxe.ds.Option;
import js.html.OListElement;
import udom.Dom;
using thx.core.Options;
// TODO
//  * drag and drop item
//  * set using path
class ArrayEditor extends RouteEditor {
  var list : OListElement;
  var innerType : SchemaType;
  var current : Value<Option<{
    editor : IEditor,
    item : LIElement,
    index : Int
  }>>;
  var value : Array<Null<Dynamic>>;
  public function new(container : Element, innerType : SchemaType) {
    value = [];
    var options = {
      template  : '<div class="editor array"></div>',
      container : container
    };
    super(ArrayType(innerType), options);
    var toolbar = new Toolbar({
      parent : component,
      container : component.el
    });

    var buttonAdd = toolbar.left.addButton('', Config.icons.add);
    buttonAdd.clicks.subscribe(function(_) addItem());

    var buttonRemove = toolbar.right.addButton('', Config.icons.remove);
    buttonRemove.clicks.subscribe(function(_) removeSelectedItem());

    var items = Browser.document.createDivElement();
    items.className = "items";
    component.el.appendChild(items);

    list = Browser.document.createOListElement();
    items.appendChild(list);

    this.innerType = innerType;
    current = new Value(None);
    current.toBool()
      .feed(buttonRemove.enabled);

    diff.subscribe(function(d) {
      switch [d.path.asArray(), d.diff] {
        case [[Index(i)], RemoveItem]:
          value.splice(i, 1);
        case [[Index(i)], AddItem]:
          value.insert(i, null);
        case [[Index(i)], SetValue(v)] if(Type.enumEq(v.asType(), innerType)):
          value[i] = v.asValue();
        case _:
          throw 'unable to assign $d to within ArrayEditor';
  // ("", AddItem(i)):

        //case [i], SetValue(v):
      }
      pulse();
    });
  }

  function pulse()
    stream.pulse(new TypedValue(type, value.copy()));

  var index = 0;
  public function addItem() {
    addItemWithIndex(index);
    index++;
  }

  function addItemWithIndex(i : Int) {
    var item = Browser.document.createLIElement();
    item.setAttribute('data-placeholder', '$index');
    list.appendChild(item);
    var editor = EditorFactory.create(innerType, item, component);
    editor.focus
      .feed(focus);
    editor.focus
      .withValue(true)
      .subscribe(function(_) {
        current.set(Some({
          editor : editor,
          item   : item,
          index  : index
        }));
      });
    editor.stream
      .mapValue(function(v) return new DiffAt('[$i]', SetValue(v)))
      .plug(diff);

    diff.pulse(new DiffAt('[$i]', AddItem));
  }

  public function removeSelectedItem() {
    var o = current.get().toValue();
    if(null == o)
      return;
    o.item.parentNode.removeChild(o.item);
    current.set(None);
    diff.pulse(new DiffAt('[${o.index}]', RemoveItem));
    // TODO destroy editor
  }
}