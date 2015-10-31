var React = require('react')
var { render } = require('react-dom')
var { Router } = require('react-router')
var routes = require('./routes.jsx')

var createHistory = require('history/lib/createHashHistory')
var history = createHistory({ queryKey: false })

render(<Router history={history}>{routes}</Router>, document.getElementById('app'))
