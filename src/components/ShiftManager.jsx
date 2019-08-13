var React = require('react')
var createReactClass = require('create-react-class');
var ShiftList = require('./ShiftList.jsx');
var targetUrl = 'http://localhost:58744/WebForm1?agentId=';
var ShiftManager = createReactClass({

  getInitialState: function() {
    return {shifts: [], newAgentID:''};
  },
  onChange: function(e) {
    this.setState({newAgentID:e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();

    fetch(targetUrl+this.state.newAgentID)
      .then(response => response.json())
      .then(data => this.setState({ shifts: data.result.Shifts })).catch(function() {
        alert("No results");
    });;

  },

  render: function() {
    return (
      <div>
         <h3>{this.props.title}</h3>
         <form onSubmit={this.handleSubmit}>
            <input onChange={this.onChange} value={this.state.newAgentID}/>
            <button>View Schedule</button>
        </form>

        <ShiftList items={this.state.shifts}/>
      </div>
    );
  }
})

module.exports=ShiftManager;
