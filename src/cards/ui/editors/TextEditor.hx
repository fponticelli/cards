package cards.ui.editors;

using thx.stream.Emitter;
import js.html.Element;
import js.html.Event;
import cards.components.Component;
import cards.components.ComponentOptions;
import thx.stream.Value;
import cards.properties.Text;
import cards.model.SchemaType;
using thx.stream.dom.Dom;
import js.Browser;

class TextEditor implements Editor<String> {
  public var component(default, null) : Component;
  public var focus(default, null) : Value<Bool>;
  public var value(default, null) : Value<String>;
  public var type(default, null) : SchemaType;
  var cancel : Void -> Void;
  public function new(options : TextEditorOptions) {
    type = StringType;
    if(null == options.defaultText)
      options.defaultText = '';
    if(null == options.placeHolder)
      options.placeHolder = '';
    if(null == options.el && null == options.template)
      options.template = '<div></div>';
    if(null == options.inputEvent)
      options.inputEvent = function(component : Component) return component.el.streamEvent('input');

    component = new Component(options);
    component.el.classList.add('editor');
    component.el.classList.add('text');
    component.el.setAttribute('tabindex', '1');
    component.el.setAttribute('contenteditable', 'true');
    component.el.setAttribute('placeholder', options.placeHolder);

    // PREVENT SELECTION DRAG AND DROP
    component.el.addEventListener('dragstart', function(e) e.preventDefault(), false);
    component.el.addEventListener('drop', function(e) e.preventDefault(), false);

    // TODO: find out how to set the content of :before programmatically
    component.el.style.content = options.placeHolder;

    var text = new Text(component, options.defaultText);

    value = text.stream;
    options.inputEvent(component)
      .mapValue(function(_) return text.component.el.textContent)
      .feed(value);

    focus = new Value(false);
    // TODO: adding contenteditable dynamically doesn't work very well in FF
    //focus.subscribe(component.el.subscribeToggleAttribute('contenteditable', 'true'));
    focus.withValue(true).subscribe(component.el.subscribeFocus());
    var focusStream = focus
      .withValue(true)
      .subscribe(function(_) {
        Browser.document.getSelection().selectAllChildren(component.el);
      });

    component.el.streamFocus().feed(focus);
    cancel = function() {
      text.dispose();
      focusStream.cancel();
    };

    var empty = new Value(options.defaultText == '');
    component.el.streamEvent('input')
      .mapValue(function(_) return text.component.el.textContent == '')
      .merge(value.mapValue(function(t) return t == ''))
      .feed(empty);
    empty.subscribe(component.el.subscribeToggleClass('empty'));

    // PASTE EVENT
    component.el.streamEvent("paste")
      .mapValue(function(ev) {
        var e : Dynamic = ev;
        e.preventDefault();
        var data      = null == e.clipboardData ? "" : e.clipboardData.getData("text/plain"),
            current   = value.get(),
            selection = Browser.window.getSelection(),
            start     = selection.anchorOffset,
            end       = selection.extentOffset;
        return current.substr(0, start) + data + current.substr(end);
      })
      .filterValue(function(v) return v.length > 0)
      .feed(value);
  }

  public function destroy() {
    value.clear();
    component.destroy();
    cancel();
  }
}

typedef TextEditorOptions = {> ComponentOptions,
  defaultText : String,
  ?placeHolder : String,
  ?inputEvent : Component -> Emitter<Event>
}