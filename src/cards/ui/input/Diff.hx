package cards.ui.input;

import cards.model.SchemaType;

// TODO: remove Add?
enum Diff {
  Remove;
  Add;
  Set(value : TypedValue);
}