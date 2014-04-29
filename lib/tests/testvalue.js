import { Model } from 'ui/model';
import { StringValue, NumberValue, BoolValue, DateValue } from 'streamy/value';

let assert = require("assert"),
    should = require("should");


describe('Value', function(){
  it('StringValue type should be "String"', function(){
    assert.equal('String', new StringValue().type);
  });
  it('NumberValue type should be "Number"', function(){
    assert.equal('Number', new NumberValue().type);
  });
  it('BoolValue type should be "Bool"', function(){
    assert.equal('Bool', new BoolValue().type);
  });
  it('DateValue type should be "Date"', function(){
    assert.equal('Date', new DateValue().type);
  });
});