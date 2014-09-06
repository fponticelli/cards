import dom.Dom;
import sui.properties.ValueProperties;
import ui.fragments.FragmentMapper;
import ui.fragments.FragmentProperties;
import ui.*;

class Main {
  public static function main() {
    Dom.ready().then(function(_) {
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