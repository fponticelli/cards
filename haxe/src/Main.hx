import dom.Dom;
import ui.Schema;

class Main {
	public static function main() {
		Dom.ready().then(function(_) {
			var container = Query.first('.container'),
				schema = new Schema();
			trace("Hello World");
		});
	}
}