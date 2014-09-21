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
import cards.ui.input.Diff;
import cards.ui.input.DiffAt;
import cards.model.SchemaType;

class Main {
  public static function main() {
    var complexObjectDefinitions = [
        { name : "name", type : StringType, optional : false },
        { name : "age",  type : FloatType, optional : true },
        { name : "contacts", type : ArrayType(ObjectType([
            { name : "type",  type : StringType, optional : true },
            { name : "value", type : StringType, optional : false },
            { name : "primary", type : BoolType, optional : true }
          ])), optional : false },
        { name : "address", type : ObjectType([
            { name : "line 1", type : StringType, optional : false },
            { name : "line 2", type : StringType, optional : true },
            { name : "post code", type : FloatType, optional : false },
            { name : "city", type : StringType, optional : false },
            { name : "state", type : StringType, optional : false }
          ]), optional : false}
      ];

    Dom.ready().success(function(_) {
      var main = new Main(Query.first(".container"));
      main.addDemo(function(el) {
        return new RuntimeObjectEditor(el, null, complexObjectDefinitions);
      });
      main.addDemo(function(el) {
        return new AnonymousObjectEditor(el, null);
      });
      main.addDemo(function(el) {
        var editor = new ObjectEditor(el, null, complexObjectDefinitions);
        editor.diff.pulse(new DiffAt('name', Set('Franco')));
        editor.diff.pulse(new DiffAt('contacts[0]', Add));
        editor.diff.pulse(new DiffAt('contacts[0].type', Set('email')));
        editor.diff.pulse(new DiffAt('contacts[0].value', Set('franco.ponticelli@gmail.com')));
        return editor;
      });
      main.addDemo(function(el) {
        var editor = new ArrayEditor(el, null, StringType);
        for(i in 0...3) {
          editor.diff.pulse(new DiffAt(i, Add));
          editor.diff.pulse(new DiffAt(i, Set('f $i')));
        }
        for(i in 0...3) {
          editor.diff.pulse(new DiffAt(i*2, Add));
          editor.diff.pulse(new DiffAt(i*2, Set('s $i')));
        }
        return editor;
      });
      main.addDemo(function(el) {
        return new ArrayEditor(el, null, ArrayType(CodeType));
      });
      main.addDemo(function(el) {
        return new TextEditor(el, null);
      });
      main.addDemo(function(el) {
        return new CodeEditor(el, null);
      });
      main.addDemo(function(el) {
        return new ReferenceEditor(el, null);
      });
      main.addDemo(function(el) {
        return new NumberEditor(el, null);
      });
      main.addDemo(function(el) {
        return new DateEditor(el, null, false);
      });
      main.addDemo(function(el) {
        return new DateEditor(el, null);
      });
      main.addDemo(function(el) {
        return new BoolEditor(el, null);
      });
      main.addDemo(function(el) {
        return new ColorEditor(el, null);
      });
      main.addDemo(function(el) {
        return new RangeEditor(el, null);
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