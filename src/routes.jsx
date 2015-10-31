var React = require('react')
var Router = require('react-router')
  , { Route, DefaultRoute, History } = Router

var SpeedReaderViewer = require('./SpeedReaderViewer.jsx')

var App = React.createClass({
  render: function() {
    var self = this
    return (
      <div>
        <SpeedReaderViewer />
        {this.props.children}
      </div>
    )
  }
})

//    <DefaultRoute component={Demo}/>
var routes = (
  <Route path="/" component={App}>
  </Route>
)

module.exports = routes
