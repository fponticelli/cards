import dom.Dom;
import sui.components.*;
import sui.properties.*;
import steamer.*;
import ui.*;
import ui.Card;

class Main {
	public static function main() {
		Dom.ready().then(function(_) {
			var container = Query.first('.container'),
				data      = new Data({}),
				model     = new Model(data);

				// Card
			Card.create(model, container);
		});
	}
}