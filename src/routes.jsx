var React = require('react')
var Router = require('react-router')
  , { Route, DefaultRoute, RouteHandler, Navigation } = Router

var SpeedReaderViewer = require('./SpeedReaderViewer.jsx')

var App = React.createClass({
  render: function() {
    var self = this
    return (
      <div>
        <SpeedReaderViewer />
        <RouteHandler/>
      </div>
    )
  }
})

//    <DefaultRoute name="demo" handler={Demo}/>
var routes = (
  <Route name="app" path="/" handler={App}>
  </Route>
)

module.exports = routes
