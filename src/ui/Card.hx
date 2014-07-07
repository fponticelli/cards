package ui;

import js.html.Element;
import sui.components.Component;
import dom.Dom;
import ui.fragments.FragmentMapper;
using steamer.Producer;

class Card {
	public static function create(model : Model, container : Element, mapper : FragmentMapper) {
		var card    = new Component({
						template : '<div class="card"><div class="doc"></div><aside><div class="context"></div><div class="model"></div></aside></div>'
					}),
			context = Query.first('.context', card.el),
			modelView = new ModelView(),
			document = new Document({ el : Query.first('.doc', card.el) }),
			scope = { model : {} },
			context = new ContextView(document, scope, mapper, { el : Query.first('.context', card.el) });

		modelView.component.appendTo(Query.first('.model', card.el));

		model.data.value.feed(function(o) {
			scope.model = o;
		});
		modelView.schema.feed(model.schemaEventConsumer);
		modelView.data.feed(model.dataEventConsumer);

		card.appendTo(container);

		// TODO remove me
		document.article.addReadonly();
		var block = document.article.addBlock();
		mapper.values.ensure('strong', block.component);
		block = document.article.addBlock();
		mapper.values.ensure('emphasis', block.component);
		block = document.article.addBlock();
		mapper.values.ensure('strong', block.component);
		mapper.values.ensure('emphasis', block.component);
		document.article.addBlock();
	}
}