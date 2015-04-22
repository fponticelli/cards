package cards.components;

import js.html.DOMElement as Element;

typedef ComponentOptions = {
  ?el : Element,
  ?container : Element,
  ?template : String,
  ?classes : String,
  ?parent  : Component
}