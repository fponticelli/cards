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
using udom.Dom;
using thx.core.Options;
import cards.ui.input.Diff;
import cards.components.Component;

// TODO
//  * drag and drop item
//  * set value at once
//  * change SchemaType dynamically
class ArrayEditor extends RouteEditor {
  var list : OListElement;
  var editors : Array<IEditor>;
  var innerType : SchemaType;
  var currentIndex : Value<Option<Int>>;
  var values : Array<Null<Dynamic>>;
  public function new(container : Element, parent : Component, innerType : SchemaType) {
    values = [];
    editors = [];
    currentIndex = Value.createOption();
    var options = {
      template  : '<div class="editor array"></div>',
      container : container,
      parent : parent
    };
    super(ArrayType(innerType), options);
    this.innerType = innerType;

    var toolbar = new Toolbar({
      parent : component,
      container : component.el
    });

    // create DOM containers
    list = Browser.document.createOListElement();
    var items = Browser.document.createDivElement();
    items.className = "items";
    component.el.appendChild(items);
    items.appendChild(list);

    var buttonAdd = toolbar.left.addButton('', Config.icons.add),
        buttonRemove = toolbar.right.addButton('', Config.icons.remove);

    currentIndex
      .toBool()
      .feed(buttonRemove.enabled);

    diff.subscribe(function(d) {
      switch [d.path.asArray(), d.diff] {
        case [[Index(i)], Remove]:
          values.splice(i, 1);
          removeEditor(i);
        case [[Index(i)], Add]:
          values.insert(i, null);
          createEditor(i);
        case [[Index(i)], Set(tv)] if(Type.enumEq(tv.asType(), innerType)):
          values[i] = tv.asValue();
          setEditor(i, tv);
        case [path, diff] if(path.length > 0):
          var first = path.shift();
          switch first {
            case Index(index) if(Std.is(editors[index], IRouteEditor)):
              (cast editors[index] : IRouteEditor).diff.pulse(new DiffAt(path, diff));
            case _:
              throw 'unable to forward $d within ArrayEditor';
          }
        case [[], Set(tv)] if(Type.enumEq(type, tv.asType())):
          // TODO set value?
        case _:
          throw 'unable to assign $d within ArrayEditor';
      }
      pulse();
    });

    currentIndex
      .audit(function(_) {
        var prev = Query.first('li.active', list).childOf(list);
        if(null == prev) return;
        prev.classList.remove('active');
      })
      .filterOption()
      .subscribe(function(index) {
        var el = Query.first('li:nth-child(${index+1})', list).childOf(list);
        if(null == el) return;
        el.classList.add('active');
      });

    buttonAdd.clicks
      .subscribe(function(_) {
        var index = currentIndex.get().toBool() ? currentIndex.get().toValue() + 1 : values.length;
        diff.pulse(new DiffAt(index, Add));
        editors[index].focus.set(true);
      });
    buttonRemove.clicks
      .subscribe(function(_) {
        if(!currentIndex.get().toBool())
          return;
        var index = currentIndex.get().toValue();
        diff.pulse(new DiffAt(index, Remove));
      });
  }

  public function pushItem(?value : TypedValue)
    insertItem(values.length, value);

  public function insertItem(index : Int, ?value : TypedValue) {
    diff.pulse(new DiffAt(index, Add));
    if(null != value)
      diff.pulse(new DiffAt(index, Set(value)));
  }

  function createEditor(index : Int) {
    var item = Browser.document.createLIElement(),
        ref  = Query.first('li:nth-child(${index+1})', list).childOf(list);
    if(null == ref)
      list.appendChild(item);
    else
      list.insertBefore(item, ref);
    var editor = EditorFactory.create(innerType, item, component);
    editors.insert(index, editor);

    editor.focus
      .feed(focus);

    editor.focus
      .withValue(true)
      .mapValue(function(_) return editor.component.el.parentElement)
      .mapValue(function(el) return el.getElementIndex())
      .toOption()
      .feed(currentIndex);

    editor.stream
      .filterValue(function(v) return currentIndex.get().toBool())
      .mapValue(function(v) return new DiffAt(currentIndex.get().toValue(), Set(v)))
      .distinct(DiffAt.equal)
      // don't use plug or the stream will be killed when killing the editor
      .subscribe(function(v) diff.pulse(v));
  }

  function setEditor(index : Int, value : TypedValue) {
    editors[index].stream.pulse(value);
  }

  function removeEditor(index : Int) {
    var item = Query.first('li:nth-child(${index+1})', list).childOf(list),
        editor = editors[index];
    list.removeChild(item);
    editor.dispose();
    editors.splice(index, 1);
    currentIndex.set(None);

    // set focus after removal
    thx.core.Timer.delay(function() {
      if(editors.length == 0)
        return;
      if(index == editors.length)
        index--;
      editors[index].focus.set(true);
    }, 10);
  }

  // TODO pulse passes original object and bad things can happen if it is modified elsewhere
  function pulse()
    stream.pulse(new TypedValue(type, values));
}