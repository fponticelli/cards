package sui.properties;

import types.DynamicTransform;

class BoolProperty extends ValueProperty<Bool> {
  override public function transform(value : Dynamic) : Bool {
    return DynamicTransform.toBool(value);
  }
}