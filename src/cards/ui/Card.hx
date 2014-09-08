package cards.ui;

import cards.model.Model;
import cards.components.Component;
import cards.ui.fragments.FragmentMapper;
import js.html.Element;
import udom.Dom;
using thx.stream.Emitter;

class Card {
  public static function create(model : Model, container : Element, mapper : FragmentMapper) {
    var card = new Component({
        template : '<div class="card"><div class="doc"></div><aside><div class="context"></div><div class="model"></div></aside></div>'
      }),
      context = Query.first('.context', card.el),
      modelView = new ModelView(),
      document = new Document({ el : Query.first('.doc', card.el) }),
      context = new ContextView(
        document,
        model,
        modelView,
        mapper,
        { el : Query.first('.context', card.el) }
      );

    modelView.component.appendTo(Query.first('.model', card.el));

    modelView.schema.subscribe(model.schemaEventSubscriber);
    modelView.data.subscribe(model.dataEventSubscriber);

    card.appendTo(container);

    document.article.addBlock();
  }
}