package cards.model;

import haxe.ds.Option;
using thx.core.Set;
using thx.core.Iterables;
import cards.model.Expression;
import cards.model.Scope;

class Runtime {
  static function createFunction(args : Array<String>, code : String) : Dynamic -> Dynamic -> Dynamic
    return (untyped __js__('new Function'))(args.join(','), code);

  static function formatCode(code : String, scope : Dynamic) {
    var prelim = Reflect.fields(scope)
      .map(function(field) {
        return 'var $field = scope.$field;';
      })
      .join('\n');
    return '$prelim
delete scope;
return $code;';
  }

  static var pattern = ~/\$\.(.+?)\b/;
  // TODO: poorman implementation
  public static function extractDependencies(code : String) {
    var set = new Set();
    while(pattern.match(code)) {
      set.add(pattern.matched(1));
      code = pattern.matchedRight();
    }
    return set.order(thx.core.Strings.compare);
  }

  public static function toRuntime(code : String, model : Model) : Runtime {
    var expression = try {
        var scope = new Scope();
        var formatted = formatCode(code, scope);
        var f = createFunction(['$', 'scope'], formatted);

        Fun(function() try return Result(f(model.data.toObject(), scope)) catch(e : Dynamic) return Error(Std.string(e)));
      } catch(e : Dynamic) {
        SyntaxError(Std.string(e));
      };
    return new Runtime(expression, code);
  }

  public static function toErrorOption(runtime : Runtime) : Option<String>
    return switch runtime.expression {
      case SyntaxError(e): Some(e);
      case _: None;
    };

  public var expression(default, null) : Expression;
  public var code(default, null) : String;
  public var dependencies(default, null) : Array<String>;
  public function new(expression : Expression, code : String) {
    this.expression = expression;
    this.code = code;
    this.dependencies = extractDependencies(code);
  }
}

enum RuntimeResult {
  Result(value : Dynamic);
  Error(msg : String);
}