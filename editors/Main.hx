import cards.components.Component;
import cards.ui.input.*;
import cards.ui.input.Path;
import js.Browser;
import js.html.Element;
import thx.promise.Promise;
using thx.stream.Bus;
using thx.stream.dom.Dom;
using udom.Dom.Query;
using StringTools;

class Main {
  public static function main() {


    Dom.ready().success(function(_) {
      var main = new Main(Query.first(".container"));
      main.addDemo(function(el) {
        return new ObjectEditor(el, [
          { name : "name", type : StringType, optional : false },
          { name : "age",  type : FloatType, optional : true },
          { name : "contacts", type : ArrayType(ObjectType([
              { name : "type",  type : StringType, optional : false },
              { name : "value", type : StringType, optional : false },
              { name : "primary", type : BoolType, optional : false }
            ])), optional : false },
          { name : "address", type : ObjectType([
              { name : "line 1", type : StringType, optional : false },
              { name : "line 2", type : StringType, optional : true },
              { name : "post code", type : FloatType, optional : false },
              { name : "city", type : StringType, optional : false },
              { name : "state", type : StringType, optional : false }
            ]), optional : false}
        ]);
      });
      main.addDemo(function(el) {
        var editor = new ArrayEditor(el, StringType);
        for(i in 0...3)
          editor.pushItem('f $i');
        for(i in 0...3)
          editor.insertItem(i*2, 's $i');
        return editor;
      });
      main.addDemo(function(el) {
        return new ArrayEditor(el, ArrayType(CodeType));
      });
      main.addDemo(function(el) {
        return new TextEditor(el);
      });
      main.addDemo(function(el) {
        return new CodeEditor(el);
      });
      main.addDemo(function(el) {
        return new ReferenceEditor(el);
      });
      main.addDemo(function(el) {
        return new NumberEditor(el);
      });
      main.addDemo(function(el) {
        return new DateEditor(el, false);
      });
      main.addDemo(function(el) {
        return new DateEditor(el);
      });
      main.addDemo(function(el) {
        return new BoolEditor(el);
      });
      main.addDemo(function(el) {
        return new ColorEditor(el);
      });
      main.addDemo(function(el) {
        return new RangeEditor(el);
      });
    });
  }

  var container : Element;
  var demos : Element;
  var output : Element;
  var focus : Element;
  public function new(container : Element) {
    this.container = container;
    demos = Browser.document.createElement('div');
    demos.className = "demos";
    output = Browser.document.createElement('div');
    output.className = "output";
    focus = Browser.document.createElement('div');
    focus.className = "focus";
    container.appendChild(demos);
    container.appendChild(focus);
    container.appendChild(output);
  }

  public function addDemo(handler : Element -> IEditor) {
    var footer  = Browser.document.createElement('h2'),
        el      = Browser.document.createElement('div'),
        sample  = Browser.document.createElement('div');
    sample.className = "sample";
    el.className = "card";
    sample.appendChild(el);
    sample.appendChild(footer);
    demos.appendChild(sample);
    var editor = handler(el);
    if(null == editor)
      return;
    editor.stream
      .mapValue(function(v) return "content: " + v.toString())
      .subscribe(output.subscribeText());
    editor.focus
      .withValue(true)
      .mapValue(function(_) return "focus: " + editor.toString() + ", " + editor.type)
      .subscribe(focus.subscribeText());
    footer.textContent = 'editor: ' + editor.toString() + '\ntype: ' + Std.string(editor.type).replace('\t', ' ');
  }
}