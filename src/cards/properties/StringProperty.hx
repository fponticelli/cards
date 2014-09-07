package cards.properties;

import cards.types.DynamicTransform;

class StringProperty extends ValueProperty<String> {
  override public function transform(value : Dynamic) : String
    return DynamicTransform.toString(value);
}