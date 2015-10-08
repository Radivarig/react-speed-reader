var React = require('react')
var Router = require('react-router')
  , { Route, DefaultRoute, RouteHandler, Navigation } = Router

var App = React.createClass({
  render: function() {
    var self = this
    return (
      <div>
        test
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
