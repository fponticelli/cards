package ui;

import js.html.Element;

class ModelUI {
	public static function create(model : Model, schema : Schema, container : Element) {
		var modelView = new ModelView();
		modelView.component.appendTo(container);


		modelView.addField("name", StringType);
	}
}

