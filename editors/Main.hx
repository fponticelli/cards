import cards.components.Component;
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
      main.addDemo("array editor", toDo());
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
  public function new(container : Element) {
    this.container = container;
  }

  public function addDemo(title : String, handler : Element -> IEditor) {
    var heading = Browser.document.createElement('h2'),
        el      = Browser.document.createElement('div'),
        output  = Browser.document.createElement('div'),
        sample  = Browser.document.createElement('div');
    sample.className = "sample";
    el.className = "card";
    output.className = "output";
    heading.textContent = title;
    sample.appendChild(heading);
    sample.appendChild(el);
    sample.appendChild(output);
    container.appendChild(sample);
    var editor = handler(el);
    if(null == editor)
      return;
    editor.stream
      .mapValue(function(v) return v.toString())
      .subscribe(output.subscribeText());
  }
}