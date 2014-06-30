import dom.Dom;
import ui.*;

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