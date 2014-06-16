import dom.Dom;
import ui.Schema;
import ui.Model;
import steamer.Value;

class Main {
	public static function main() {
		Dom.ready().then(function(_) {
			var container = Query.first('.container'),
				schema    = new Schema(),
				data      = new ui.Data({
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
			trace(data.get('contacts[3].value'));
			trace(data.get('contacts'));
			trace(data.toJSON());
		});
	}
}