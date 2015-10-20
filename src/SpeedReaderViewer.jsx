var React = require('react')

var SpeedReader = require('./SpeedReader.jsx')

var SpeedReaderViewer = React.createClass({
  getInitialState: function() {
    return {
      inputText: 'Science, what is it all about?\nTechmology, what is that all about?'
    , isPlaying: false
    , resetTs: undefined
    , speed: 250
    , chunk: 1
    , setProgress: {timestamp: undefined}
    }
  }
, play: function() {
    this.setState({isPlaying: true})
  }
, pause: function() {
    this.setState({isPlaying: false})
  }
, reset: function() {
    this.setState({
      isPlaying: false
    , resetTs: new Date().getTime()
    })
  }
, increaseChunk: function() {
    this.alterChunk(1)
  }
, decreaseChunk: function() {
    this.alterChunk(-1)
  }
, setSpeed: function(e) {
    var v = e.target.value
    if(isNaN(v)) return
    this.setState({speed: parseInt(v || 0)}, this.reset)
  }
, alterChunk: function(x) {
    var chunk = this.clamp(this.state.chunk +x, 1, 3)
    this.setState({chunk: chunk}, this.reset)
  }
, clamp: function(x, min, max) {
    if(x < min) return min
    if(x > max) return max
    return x
  }
, progress: function(x) {
    this.setState({progress: x})
  }
, setProgressPercent: function(e) {
    var rect = e.target.getBoundingClientRect()
    var percent = e.clientX -rect.left
    var setProgress = {
      percent: percent
    , timestamp: new Date().getTime()
    }
    this.setState({setProgress: setProgress})
  }
, setProgressSkipFor: function(x) {
    var setProgress = {
      skipFor: x
    , timestamp: new Date().getTime()
    }
    this.setState({setProgress: setProgress})
  }
, progressBar: function(progress) {
    var chunks = 10
    var ratio = progress ? progress.at/progress.of : 0
    var integerPart = Math.floor(ratio *chunks)
    var progressBar = new Array(integerPart +1).join('#')
    progressBar += new Array(chunks -integerPart +1).join('_')
    return {
      bar: '[' +progressBar +']'
    , percent: (ratio*100).toFixed(0) +'%'
    }
  }
, render: function() {
    var self = this
    var outputTextAreaStyle = {
      textAlign: 'center'
    , height: 150
    }

    var progressBar = this.progressBar(this.state.progress)
    return (
      <div style={{textAlign: 'center'}}>
        <div style={outputTextAreaStyle}>
          <SpeedReader
            inputText={this.state.inputText}
            speed={this.state.speed || this.getInitialState().speed}
            isPlaying={this.state.isPlaying}
            setProgress={this.state.setProgress}
            hasEndedCallback={this.pause}
            progressCallback={this.progress}
            chunk={this.state.chunk}
            reset={this.state.resetTs}
            trim={{regex: /\.|,|\?|!/}}
            offset={{regex: /\.|,|\?|!/, duration: 0.5}}
            blank={{regex: /\.|\?|!/, duration: 0.5}}
            />
        </div>

        <div>
          <span onClick={this.setProgressPercent}>{progressBar.bar}</span>
          <span style={{position: 'absolute', display: 'inline-block', width: '40', textAlign: 'right'}}>{progressBar.percent}</span>
        </div>

        <div>
          <button onClick={this.state.isPlaying ?this.pause : this.play}>
            {this.state.isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={this.reset}>Reset</button>
        </div>

        <div>
          <button onClick={this.decreaseChunk}>-</button>
          words per flash: {this.state.chunk}
          <button onClick={this.increaseChunk}>+</button>
        </div>

        <div>
          <input
            style={{width: 50, textAlign: 'center'}}
            value={this.state.speed || ''}
            placeholder={this.getInitialState().speed}
            onChange={this.setSpeed}
            />
          WPM
        </div>

        <textarea rows={10} cols={40}
          type="text"
          value={this.state.inputText}
          onChange={function(e){self.setState({inputText: e.target.value})}}
          />


      </div>
    )
  }
})

module.exports = SpeedReaderViewer
