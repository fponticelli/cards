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
import js.html.UListElement;
import udom.Dom;
using thx.core.Options;
// TODO
//  * add item
//  * remove item
//  * drag and drop item
//  * set using path
class ArrayEditor extends Editor implements IEditor {
  var list : UListElement;
  var innerType : SchemaType;
  var current : Value<Option<{ editor : IEditor, item : LIElement }>>;
  public function new(container : Element, innerType : SchemaType) {
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

    list = Browser.document.createUListElement();
    items.appendChild(list);

    this.innerType = innerType;
    current = new Value(None);
    current.toBool()
      .feed(buttonRemove.enabled);
  }

  var index = 0;
  public function addItem() {
    addItemWithIndex(index++);
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
          item : item
        }));
      });
  }

  public function removeSelectedItem() {
    var o = current.get().toValue();
    if(null == o)
      return;
    o.item.parentNode.removeChild(o.item);
    current.set(None);
    trace('delete $o');
  }
}