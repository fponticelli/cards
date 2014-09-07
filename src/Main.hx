import cards.types.*;

import cards.model.Data;
import cards.model.Model;
import cards.model.Schema;
import thx.stream.dom.Dom;
import udom.Dom;

class Main {
  public static function main() {
    Dom.ready().success(function(_) {
      var container = Query.first('.container'),
          data      = new Data({}),
          model     = new Model(data);


      var component = new cards.components.Component({
        template : '<div></div>'
      });
      component.appendTo(container);
      var html = new cards.properties.HTML(component);

      thx.stream.Timer.ofArray(["a","b","C","a","b","X","a","b","c"], 400).feed(html.stream);
    });
  }
}