var React = require('react')

var SpeedReader = require('./SpeedReader.jsx')

var SpeedReaderViewer = React.createClass({
  getInitialState: function() {
    return {
      inputText: 'Science, what is it all about? Techmology, what is that all about?'
    , isPlaying: true
    , resetTs: undefined
    , speed: 200
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
, render: function() {
    var self = this
    return (
      <div>
        <SpeedReader
          inputText={this.state.inputText}
          speed={this.state.speed}
          isPlaying={this.state.isPlaying}
          hasEndedCallback={this.pause}
          progressCallback={function(x){console.log(x)}}
          reset={this.state.resetTs}
          />

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
