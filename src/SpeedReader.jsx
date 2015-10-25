var React = require('react')
var TimerMixin = require('react-timer-mixin')

var SpeedReader = React.createClass({
  mixins: [ TimerMixin ]
, propTypes: {
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
    var currentText = words.slice(0, this.props.chunk).join(' ')

    return Object.assign(this.getWordParts(currentText), {
      current: 0
    , words: words
    , currentText: currentText
    })
  }
, componentWillReceiveProps: function(nextProps) {
    if (!this.props.isPlaying && nextProps.isPlaying)
      this.loop()

    if (this.props.setProgress &&
        this.props.setProgress.timestamp !==
         nextProps.setProgress.timestamp)
      this.handleSetProgress(nextProps.setProgress)

    if(this.props.reset !== nextProps.reset) {
      this.setState(this.getInitialState)

      if (this.props.progressCallback)
        this.props.progressCallback({
          at: 0
        , of: this.state.words.length || 1
        })

      this.loop()
    }
  }
, handleSetProgress: function(setProgress) {
    var l = this.state.words.length -1
    if (setProgress.skipFor) {
      var current = this.state.current +setProgress.skipFor
      if (current < 0) current = 0
      if (current > l) current = l
      this.setState({current: current})
    }
    else if (setProgress.percent) {
      var percent = setProgress.percent
      if (percent < 0) percent = 0
      if (percent > 100) percent = 100
      this.setState({current: Math.floor(percent/100*l)})
    }
    else return

    this.offset = 0
    this.blank = 0
    this.loop({
      skip: true
    , skipFor: setProgress.skipFor !== undefined
    , skipPercent: percent == 0 || current == 0
    })
  }
, getWords: function(sentence) {
    return sentence.split(/\s+/).filter(Boolean)
  }
, componentDidMount: function() {
    this.loop()
  }
, offset: 0
, blank: 0
, lastLoopId: undefined
, getWordParts: function(currentText) {
    var word = currentText.split('')
    var pivot = this.pivot(currentText)
    return {
      pre: word.slice(0, pivot)
    , mid: word[pivot]
    , post: word.slice(pivot +1)
    }
  }
, loop: function(opts={}) {
    var self = this
    var ms = opts.skip ? 0 : 60000/this.props.speed
    clearTimeout(this.lastLoopId)
    this.lastLoopId = this.setTimeout(function() {
      if( !opts.skip &&!opts.skipFor && !self.props.isPlaying ) return

      if (self.blank) {
        self.setState({currentText: '', pre: '', mid: '', post: ''})
        self.offset = self.blank -ms
        self.blank = 0
        return self.loop()
      }

      var chunk = self.props.chunk
      var current = self.state.current +chunk
      var words = self.state.words
      var l = words.length -1

      var currentStart = current -(chunk < l ? chunk : l)
      var currentTextWords = words.slice(currentStart, current)

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

      self.setState(Object.assign(self.getWordParts(currentText), {
        currentText: currentText
      , current: opts.skip ? self.state.current : current
      }))

      currentStart += opts.skipPercent ? 0 : chunk

      var wordsCount = l +1
      if (self.props.progressCallback)
        self.props.progressCallback({
          at: currentStart > wordsCount ? wordsCount : currentStart
        , of: wordsCount || 1
        })

      if(currentStart < l) {
        if ( !opts.skip || opts.skipFor) self.loop()
      }
      else {
        if (self.props.hasEndedCallback)
          self.props.hasEndedCallback()
      }
    }, ms +this.offset)
  }
, pivot: function(x) {
    return (x.length != 1) ? Math.floor(x.length/7 +1) : 0
  }
, render: function() {
    var currentText = this.state.currentText
    if (this.props.wordPartsCallback)
      this.props.wordPartsCallback(
        this.props.chunk == 1 ?
          currentText : this.getWordParts(currentText)
      )
    if (currentText === '')
      return <span>&nbsp;</span>

    var text = <span>{currentText}</span>
    if (this.props.chunk == 1) {
      var fixedLeft = {
        position: 'absolute'
      , display: 'inline-block'
      , transform: 'translate(-100%)'
      , textAlign: 'right'
      }
      text = (
        <span>
          <span style={fixedLeft}>{this.state.pre}</span>
          <span style={{color: this.props.pivotColor}}>{this.state.mid}</span>
          <span style={{position: 'absolute'}}>{this.state.post}</span>
        </span>
      )
    }
    return text
  }

})

module.exports = SpeedReader
