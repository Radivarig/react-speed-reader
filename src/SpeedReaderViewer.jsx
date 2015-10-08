var React = require('react')

var SpeedReader = require('./SpeedReader.jsx')

var SpeedReaderViewer = React.createClass({
  getInitialState: function() {
    return {
      inputText: 'Science, what is it all about? Techmology, what is that all about?'
    , isPlaying: true
    , resetTs: undefined
    , speed: 200
    , chunk: 2
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
, progress: function(x) {
    this.setState({progress: x})
  }
, progressBar: function(progress) {
    var chunks = 10
    var ratio = progress ? progress.at/progress.of : 0
    var integerPart = Math.floor(ratio *chunks)
    var progressBar = new Array(integerPart +1).join('#')
    progressBar += new Array(chunks -integerPart +1).join('_')
    return '[' +progressBar +']' + (ratio*100).toFixed(0) +'%'
  }
, render: function() {
    var self = this

    return (
      <div>
        <SpeedReader
          inputText={this.state.inputText}
          speed={this.state.speed}
          isPlaying={this.state.isPlaying}
          hasEndedCallback={this.pause}
          progressCallback={this.progress}
          chunk={this.state.chunk}
          reset={this.state.resetTs}
          />

        <div>{this.progressBar(this.state.progress)}</div>

        <div>
          <button onClick={this.state.isPlaying ?this.pause : this.play}>
            {this.state.isPlaying ? '||' : '>'}
          </button>
          <button onClick={this.reset}>Reset</button>
        </div>

        <textarea
          type="text"
          value={this.state.inputText}
          onChange={function(e){self.setState({inputText: e.target.value})}}
          />
      </div>
    )
  }
})

module.exports = SpeedReaderViewer
