var React = require('react')
var Router = require('react-router')
var routes = require('./routes.jsx')

Router.run(routes, function (Handler) {
	React.render(React.createElement(Handler), document.getElementById('app'))
})
