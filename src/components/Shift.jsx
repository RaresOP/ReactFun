var React=require('react');
var createReactClass = require('create-react-class');
var Shift = createReactClass({
  render: function() {
    return (
      <li>
          <h4>Start:{this.props.startTime}  End:{this.props.endTime}</h4>
      </li>
    );
  }
});

module.exports = Shift;
