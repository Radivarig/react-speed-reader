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
    var chunk = this.props.chunk
    return {
      current: -(chunk < words.length ? chunk : words.length)
    , words: words
    , currentText: words.slice(0, this.props.chunk).join(' ')
    }
  }
, componentWillReceiveProps: function(nextProps) {
    if (!this.props.isPlaying && nextProps.isPlaying)
      this.loop()

    if(this.props.reset !== nextProps.reset) {
      this.setState(this.getInitialState)

      if (this.props.progressCallback)
        this.props.progressCallback({
          at: 0
        , of: this.state.words.length
        })

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
      var chunk = self.props.chunk
      var newCurrent = current +chunk
      var words = self.state.words

      newCurrent = newCurrent < words.length ? newCurrent : words.length
      current = newCurrent < words.length ? newCurrent : current

        self.setState({
        currentText: words.slice(current, current +chunk).join(' ')
      , current: current
      })

      newCurrent += chunk

      if (self.props.progressCallback)
        self.props.progressCallback({
          at: newCurrent > words.length ? words.length : newCurrent
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

