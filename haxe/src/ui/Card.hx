package ui;

import js.html.Element;
import sui.components.Component;
import dom.Dom;

class Card {
	public static function create(model : Model, container : Element) {
		var card    = new Component({
						template : '<div class="card"><div class="doc"></div><aside><div class="context"></div><div class="model"></div></aside></div>'
					}),
			//doc     = Doc.create({ el : Query.first('.doc', card.el) }),
			context = Query.first('.context', card.el),
			modelView = new ModelView();

		modelView.component.appendTo(Query.first('.model', card.el));
		modelView.schema.map(function(e) return Std.string(e)).feed(new steamer.consumers.LoggerConsumer('schema'));
		modelView.data.map(function(e) return Std.string(e)).feed(new steamer.consumers.LoggerConsumer('data'));
		card.appendTo(container);
	}
}