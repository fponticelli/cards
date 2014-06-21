package ui;

import js.html.Element;
import sui.components.Component;
import ui.Doc;
import dom.Dom;
import ui.ModelUI;

class Card {
	public static function create(model : Model, schema : Schema, container : Element) {
		var card    = new Component({
						template : '<div class="card"><div class="doc"></div><aside><div class="context"></div><div class="model"></div></aside></div>'
					}),
			//doc     = Doc.create({ el : Query.first('.doc', card.el) }),
			context = Query.first('.context', card.el);

		ModelUI.create(model, schema, Query.first('.model', card.el));

		card.appendTo(container);
	}
}