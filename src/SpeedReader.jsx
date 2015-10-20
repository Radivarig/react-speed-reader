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
    return {
      current: 0
    , words: words
    , currentText: words.slice(0, this.props.chunk).join(' ')
    }
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
        , of: this.state.words.length
        })

      this.loop()
    }
  }
, handleSetProgress: function(setProgress) {
    var l = this.state.words.length
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
    this.loop({skip: true})
  }
, getWords: function(sentence) {
    return sentence.split(/\s+/).filter(Boolean)
  }
, componentDidMount: function() {
    this.loop()
  }
, offset: 0
, blank: 0
, loop: function(opts={}) {
    var self = this
    var ms = opts.skip ? 0 : 60000/this.props.speed
    //mixins: [ reactTimer for safe setTimeout ]
    setTimeout(function() {
      if( !opts.skip && !self.props.isPlaying ) return

      if (self.blank) {
        self.setState({currentText: ''})
        self.offset = self.blank -ms
        self.blank = 0
        return self.loop()
      }

      var oldCurrent = self.state.current
      var chunk = self.props.chunk
      var words = self.state.words
      var l = words.length

      var current = oldCurrent +chunk
      if (current > l) current = l

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

      self.setState({
        currentText: currentText
      , current: opts.skip ? self.state.current: current
      })

      currentStart += chunk

      if (self.props.progressCallback)
        self.props.progressCallback({
          at: currentStart > l ? l : currentStart
        , of: l
        })

      if(currentStart < l) {
        if ( !opts.skip ) self.loop()
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
    var text = this.state.currentText

    if (this.props.chunk == 1) {
      var fixedLeft = {
        position: 'absolute'
      , display: 'inline-block'
      , transform: 'translate(-100%)'
      , textAlign: 'right'
      }

      var pivot = this.pivot(this.state.currentText)
      var word = this.state.currentText.split('')

      var pre = word.slice(0, pivot)
      var mid = word[pivot]
      var post = word.slice(pivot +1)

      text =
        <div style={{width: '100%', height: '100%'}}>
          <span style={fixedLeft}>{pre}</span>
          <span style={{color: this.props.pivotColor}}>{mid}</span>
          <span style={{position: 'absolute'}}>{post}</span>
        </div>
    }

    var styleCenter = {
      position: 'relative'
    , top: '50%'
    , transform: 'translateY(-50%)'
    }

    return (
      <div style={styleCenter}>{text}</div>
    )
  }

})

module.exports = SpeedReader

