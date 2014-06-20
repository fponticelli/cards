import dom.Dom;
import ui.components.*;
import ui.*;
import steamer.*;
import ui.properties.*;

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

			var component = new Component({ template : '<button/>' });
			new Icon(component, 'cubes');
			new Click(component).clicks.feed({
				onPulse : function(e) {
					trace(e);
				}
			});
			component.appendTo(container);
		});
	}
}