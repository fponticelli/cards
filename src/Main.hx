import cards.types.*;

import cards.model.Data;
import cards.model.Model;
import cards.model.Schema;
import cards.properties.ValueProperties;
import cards.ui.Card;
import cards.ui.fragments.FragmentMapper;
import cards.ui.fragments.FragmentProperties;
import thx.stream.dom.Dom;
import udom.Dom;

class Main {
  public static function main() {
    Dom.ready().success(function(_) {
      var values    = new ValueProperties(),
          fragments = new FragmentProperties(),
          mapper    = new FragmentMapper(fragments, values);

      PropertyFeeder.feedProperties(values);
      PropertyFeeder.feedFragments(fragments);

      var container = Query.first('.container'),
          data      = new Data({}),
          model     = new Model(data);

      // Card
      Card.create(model, container, mapper);
    });
  }
}