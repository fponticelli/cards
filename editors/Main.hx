import cards.components.Component;
import cards.ui.input.ArrayEditor;
import cards.ui.input.TextEditor;
import js.Browser;
import thx.promise.Promise;
import js.html.Element;
using udom.Dom.Query;
using thx.stream.Bus;
using thx.stream.dom.Dom;

import cards.ui.input.*;
import cards.ui.input.Path;

class Main {
  public static function main() {


    Dom.ready().success(function(_) {
      var main = new Main(Query.first(".container"));
      main.addDemo("array editor with StringType", function(el) {
        var editor = new ArrayEditor(el, StringType);
        for(i in 0...12)
          editor.addItem();
        return editor;
      });
      main.addDemo("array editor with ArrayType<CodeType>", function(el) {
        return new ArrayEditor(el, ArrayType(CodeType));
      });
      main.addDemo("text editor", function(el) {
        return new TextEditor(el);
      });
      main.addDemo("code editor", function(el) {
        return new CodeEditor(el);
      });
      main.addDemo("reference editor", toDo());
      main.addDemo("float editor", toDo());
      main.addDemo("date editor", toDo());
      main.addDemo("date time editor", toDo());
      main.addDemo("bool editor", toDo());
      main.addDemo("object editor", toDo());
    });
  }

  static function toDo() {
    return function(el) {
      el.textContent = "TODO";
      return null;
    };
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

  public function addDemo(title : String, handler : Element -> IEditor) {
    var heading = Browser.document.createElement('h2'),
        el      = Browser.document.createElement('div'),
        sample  = Browser.document.createElement('div');
    sample.className = "sample";
    el.className = "card";
    heading.textContent = title;
    sample.appendChild(heading);
    sample.appendChild(el);
    demos.appendChild(sample);
    var editor = handler(el);
    if(null == editor)
      return;
    editor.stream
      .mapValue(function(v) return "content: " + v.toString())
      .subscribe(output.subscribeText());
    editor.focus
      .withValue(true)
      .mapValue(function(_) return "focus: " + editor.toString())
      .subscribe(focus.subscribeText());
  }
}