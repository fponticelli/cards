package ui;

import ui.Runtime;
import haxe.ds.Option;

enum Expression {
  Fun(f : Void -> RuntimeResult);
  SyntaxError(msg : String);
}

class Expressions {
  public static function toErrorOption(exp : Expression) {
    return switch exp {
      case SyntaxError(e): Some(e);
      case _: None;
    };
  }
}