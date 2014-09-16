package cards.ui.input;

import cards.model.SchemaType;

enum Diff {
  Remove;
  Add;
  Set(value : TypedValue);
}