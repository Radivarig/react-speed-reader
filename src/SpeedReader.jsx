var React = require('react')

var SpeedReader = React.createClass({
  propTypes: {
    inputText: React.PropTypes.string.isRequired
  , isPlaying: React.PropTypes.bool.isRequired
  , speed: React.PropTypes.number.isRequired
  , chunk: React.PropTypes.number
  }
, getDefaultProps: function() {
    return {
      chunk: 1
    }
  }
, getInitialState: function() {
    var words = this.props.inputText.split(/\s+/).filter(Boolean)
    var current = 0
    return {
      current: current
    , words: words
    , currentText: words.slice(current, current +this.props.chunk).join(' ')
    }
  }
, componentWillReceiveProps: function(nextProps) {
    if (!this.props.isPlaying && nextProps.isPlaying)
      this.loop()

    if(this.props.reset !== nextProps.reset) {
      this.setState(this.getInitialState)
      this.loop()
    }
  }
, componentDidMount: function() {
    this.loop()
  }
, loop: function() {
    var self = this

    var ms = 60000/this.props.speed
    //mixins: [ reactTimer for safe setTimeout ]
    setTimeout(function() {
      if( !self.props.isPlaying ) return

      var current = self.state.current
      var newCurrent = current +self.props.chunk
      var words = self.state.words

      newCurrent = newCurrent < words.length ? newCurrent : words.length
      current = newCurrent < words.length ? newCurrent : current
      self.setState({
        currentText: words.slice(current, current +self.props.chunk).join(' ')
      , current: current
      })

      if (self.props.progressCallback)
        self.props.progressCallback({
          at: newCurrent
        , of: words.length
        })

      if(newCurrent < words.length) {
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

