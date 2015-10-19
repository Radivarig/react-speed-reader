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
    , pivotColor: 'red'
    }
  }
, getInitialState: function() {
    var words = this.getWords(this.props.inputText)
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
, getWords: function(sentence) {
    return sentence.split(/\s+/).filter(Boolean)
  }
, componentDidMount: function() {
    this.loop()
  }
, offset: 0
, blank: 0
, loop: function() {
    var self = this
    //mixins: [ reactTimer for safe setTimeout ]
    var ms = 60000/this.props.speed
    setTimeout(function() {
      if( !self.props.isPlaying ) return

      if (self.blank) {
        self.setState({currentText: ''})
        self.offset = self.blank -ms
        self.blank = 0
        return self.loop()
      }

      var current = self.state.current
      var chunk = self.props.chunk
      var newCurrent = current +chunk
      var words = self.state.words

      newCurrent = newCurrent < words.length ? newCurrent : words.length
      current = newCurrent < words.length ? newCurrent : current

      var currentTextWords = words.slice(current, current +chunk)

      if(self.props.trim) {
        for(var i = 0; i < currentTextWords.length; ++i) {
          var w = currentTextWords[i]
          if(w.search(self.props.trim.regex) != -1) {
            var cnt = i +1
            currentTextWords = currentTextWords.slice(0, cnt)
            current = self.state.current +cnt
            break
          }
        }
      }
      var currentText = currentTextWords.join(' ')

      if (self.props.offset && self.props.offset.regex.test(currentText))
        self.offset = (self.props.offset.duration || 1)*ms
      else self.offset = 0

      if (self.props.blank && self.props.blank.regex.test(currentText))
        self.blank = (self.props.blank.duration || 1)*ms

      self.setState({
        currentText: currentText
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
    }, ms +this.offset)
  }
, pivot: function(x) {
    return Math.floor(x.length/4 +1)
  }
, render: function() {
    if (this.props.chunk == 1) {

      var fixedLeft = {
        position: 'fixed'
      , display: 'inline-block'
      , transform: 'translate(-100%)'
      , textAlign: 'right'
      }

      var pivot = this.pivot(this.state.currentText)
      var text = this.state.currentText.split('')

      var pre = text.slice(0, pivot)
      var mid = text[pivot]
      var post = text.slice(pivot +1)

      return (
        <div style={{width: '100%'}}>
          <span style={fixedLeft}>{pre}</span>
          <span style={{color: this.props.pivotColor}}>{mid}</span>
          <span style={{position: 'fixed'}}>{post}</span>
        </div>
      )
    }

    return (
      <div>{this.state.currentText}</div>
    )
  }

})

module.exports = SpeedReader

