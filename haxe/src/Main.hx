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
				schema    = new Schema(),
				data      = new Data({
					name : "Franco",
					contacts : [{
						type : "email",
						value : "franco.ponticelli@gmail.com"
					}, {
						type : "phone",
						value : "7206902488"
					}]
				}),
				model     = new Model(data);
			trace("Hello World");
			data.set('contacts[2]', { type : 'twitter', value : 'fponticelli' });
			data.set('contacts[3].type', 'skype');
			data.set('contacts[3].value', 'francoponticelli');
			trace(data.toJSON());

			// Card
			Card.create(model, schema, container);
		});
	}
}