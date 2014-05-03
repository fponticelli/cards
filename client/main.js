import { Dom, Query } from 'ui/dom';
import { Model } from 'ui/model';
import { Schema } from 'ui/schema';
import { CardUI } from 'ui/cardui';

Dom.ready(() => {
	let $container = Query.first('.container'),
		schema     = new Schema(),
		model      = new Model(),
		cardui     = new CardUI(model, schema);

	cardui.attachTo($container);
});