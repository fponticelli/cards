import thx.stream.dom.Dom;
import udom.Dom;

class Main {
  public static function main() {
    Dom.ready().success(function(_) {
      var container = Query.first('.container');
      trace("START HERE");
    });
  }
}