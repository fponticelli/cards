package sui.components;

import js.html.Element;

typedef ComponentOptions = {
	?el : Element,
	?container : Element,
	?template : String,
	?classes : String,
	?parent  : Component
}