var React = require('react')

var SpeedReader = React.createClass({
  propTypes: {
    inputText: React.PropTypes.string.isRequired
  , isPlaying: React.PropTypes.bool.isRequired
  , speed: React.PropTypes.number.isRequired
  }
, getInitialState: function() {
    var words = this.props.inputText.split(/\s+/).filter(Boolean)
    var current = 0
    return {
      current: current
    , words: words
    , currentText: words[current]
    }
  }
, componentWillReceiveProps: function(nextProps) {
    if (!this.props.isPlaying && nextProps.isPlaying)
      this.loop()
  }
, componentDidMount: function() {
    this.loop()
  }
, loop: function() {
    var self = this
    
    var ms = 60000/this.props.speed
    //mixins: [ reactTimer for safe setTimeout ]
    setTimeout(function() {
      var current = self.state.current
      var words = self.state.words

      self.setState({
        currentText: words[current]
      , current: ++current
      })

      if (self.props.isPlaying && current < words.length) {
        self.loop()
      }
      else {
        if (self.props.hasEndedCallback)
          self.props.hasEndedCallback()
      }
    }, ms)
  }
, render: function() {
    return (
      <div>{this.state.currentText}</div>
    )
  }

})

module.exports = SpeedReader

