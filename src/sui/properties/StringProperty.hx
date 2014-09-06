package sui.properties;

import types.DynamicTransform;

class StringProperty extends ValueProperty<String> {
  override public function transform(value : Dynamic) : String {
    return DynamicTransform.toString(value);
  }
}