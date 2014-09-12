import cards.components.Component;
import js.Browser;
import thx.promise.Promise;
import js.html.Element;
using udom.Dom.Query;
import thx.stream.dom.Dom;

class Main {
  public static function main() {
    Dom.ready().success(function(_) {
      var main = new Main(Query.first(".container"));
      main.addDemo("text editor")
        .success(toDo());
      main.addDemo("float editor")
        .success(toDo());
      main.addDemo("date editor")
        .success(toDo());
      main.addDemo("date time editor")
        .success(toDo());
      main.addDemo("bool editor")
        .success(toDo());
      main.addDemo("array editor")
        .success(toDo());
      main.addDemo("object editor")
        .success(toDo());
    });
  }

  static function toDo() {
    return function(el) el.textContent = "TODO";
  }

  var container : Element;
  public function new(container : Element) {
    trace(container);
    this.container = container;
  }

  public function addDemo(title : String) : Promise<Element> {
    var heading = Browser.document.createElement('h2'),
        el = Browser.document.createElement('div');
    el.className = "sample";
    heading.textContent = title;
    container.appendChild(heading);
    container.appendChild(el);
    return Promise.value(el);
  }
}