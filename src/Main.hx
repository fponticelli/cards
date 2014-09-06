import thx.stream.dom.Dom;
import udom.Dom;

import cards.model.Data;
import cards.model.Model;
import cards.model.Schema;

class Main {
  public static function main() {
    Dom.ready().success(function(_) {
      var container = Query.first('.container');
      trace("START HERE");
    });
  }
}