var React = require('react')
var createReactClass = require('create-react-class');
var Shift = require('./Shift.jsx');

var ShiftList = createReactClass({
  render: function() {

var createItem=function(item) {
    return <Shift key={item.Start} startTime={item.Start} endTime={item.End} />;
  };

    return (<ul>{this.props.items.map(createItem)}</ul>);
  }
});
module.exports=ShiftList;
