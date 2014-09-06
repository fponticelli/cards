package types;

import types.ArrayTransform;
import types.BoolTransform;
import types.DateTransform;
import types.FloatTransform;
import types.ObjectTransform;
import types.StringTransform;
import ui.SchemaType;

class TypeTransform {
  public static function transform(srcType : SchemaType, dstType : SchemaType) : Dynamic -> Dynamic {
    return switch srcType {
      case ArrayType(_):
        switch dstType {
          case ArrayType(_):
            ArrayTransform.toArray;
          case BoolType:
            ArrayTransform.toBool;
          case DateType:
            ArrayTransform.toDate;
          case FloatType:
            ArrayTransform.toFloat;
          case ObjectType(_):
            ArrayTransform.toObject;
          case StringType:
            ArrayTransform.toString;
          case CodeType:
            ArrayTransform.toCode;
          case ReferenceType:
            ArrayTransform.toReference;
        }
      case BoolType:
        switch dstType {
          case ArrayType(_):
            BoolTransform.toArray;
          case BoolType:
            BoolTransform.toBool;
          case DateType:
            BoolTransform.toDate;
          case FloatType:
            BoolTransform.toFloat;
          case ObjectType(_):
            BoolTransform.toObject;
          case StringType:
            BoolTransform.toString;
          case CodeType:
            BoolTransform.toCode;
          case ReferenceType:
            BoolTransform.toReference;
        }
      case DateType:
        switch dstType {
          case ArrayType(_):
            DateTransform.toArray;
          case BoolType:
            DateTransform.toBool;
          case DateType:
            DateTransform.toDate;
          case FloatType:
            DateTransform.toFloat;
          case ObjectType(_):
            DateTransform.toObject;
          case StringType:
            DateTransform.toString;
          case CodeType:
            DateTransform.toCode;
          case ReferenceType:
            DateTransform.toReference;
        }
      case FloatType:
        switch dstType {
          case ArrayType(_):
            FloatTransform.toArray;
          case BoolType:
            FloatTransform.toBool;
          case DateType:
            FloatTransform.toDate;
          case FloatType:
            FloatTransform.toFloat;
          case ObjectType(_):
            FloatTransform.toObject;
          case StringType:
            FloatTransform.toString;
          case CodeType:
            FloatTransform.toCode;
          case ReferenceType:
            FloatTransform.toReference;
        }
      case ObjectType(_):
        switch dstType {
          case ArrayType(_):
            ObjectTransform.toArray;
          case BoolType:
            ObjectTransform.toBool;
          case DateType:
            ObjectTransform.toDate;
          case FloatType:
            ObjectTransform.toFloat;
          case ObjectType(_):
            ObjectTransform.toObject;
          case StringType:
            ObjectTransform.toString;
          case CodeType:
            ObjectTransform.toCode;
          case ReferenceType:
            ObjectTransform.toReference;
        }
      case StringType:
        switch dstType {
          case ArrayType(_):
            StringTransform.toArray;
          case BoolType:
            StringTransform.toBool;
          case DateType:
            StringTransform.toDate;
          case FloatType:
            StringTransform.toFloat;
          case ObjectType(_):
            StringTransform.toObject;
          case StringType:
            StringTransform.toString;
          case CodeType:
            StringTransform.toCode;
          case ReferenceType:
            StringTransform.toReference;
        }
      case CodeType:
        switch dstType {
          case ArrayType(_):
            CodeTransform.toArray;
          case BoolType:
            CodeTransform.toBool;
          case DateType:
            CodeTransform.toDate;
          case FloatType:
            CodeTransform.toFloat;
          case ObjectType(_):
            CodeTransform.toObject;
          case StringType:
            CodeTransform.toString;
          case CodeType:
            CodeTransform.toCode;
          case ReferenceType:
            CodeTransform.toReference;
        }
      case ReferenceType:
        switch dstType {
          case ArrayType(_):
            ReferenceTransform.toArray;
          case BoolType:
            ReferenceTransform.toBool;
          case DateType:
            ReferenceTransform.toDate;
          case FloatType:
            ReferenceTransform.toFloat;
          case ObjectType(_):
            ReferenceTransform.toObject;
          case StringType:
            ReferenceTransform.toString;
          case CodeType:
            ReferenceTransform.toCode;
          case ReferenceType:
            ReferenceTransform.toReference;
        }
    }
  }
}