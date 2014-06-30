package ui;

import js.html.Element;
import sui.components.Component;
import dom.Dom;

class Card {
	public static function create(model : Model, container : Element) {
		var card    = new Component({
						template : '<div class="card"><div class="doc"></div><aside><div class="context"></div><div class="model"></div></aside></div>'
					}),
			context = Query.first('.context', card.el),
			modelView = new ModelView(),
			document = new Document({ el : Query.first('.doc', card.el) }),
			context = new ContextView(document, { el : Query.first('.context', card.el) });

		document.article.current.feed(context.fragments);
		document.article.current.feed(document.fragments);

		modelView.component.appendTo(Query.first('.model', card.el));

		modelView.schema.feed(model.schemaEventConsumer);
		modelView.data.feed(model.dataEventConsumer);

		card.appendTo(container);

		model.data.stream.map(function(o) return haxe.Json.stringify(o)).feed(new steamer.consumers.LoggerConsumer());
	}
}