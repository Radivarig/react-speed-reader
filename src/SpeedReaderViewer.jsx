var React = require('react')

var SpeedReader = require('./SpeedReader.jsx')

var SpeedReaderViewer = React.createClass({
  getInitialState: function() {
    return {
      inputText: 'Science, what is it all about? Techmology, what is that all about?'
    , isPlaying: true
    , speed: 200
    }
  }
, play: function() {
    this.setState({isPlaying: true})
  }
, pause: function() {
    this.setState({isPlaying: false})
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
          />

        <div>
          <button onClick={this.state.isPlaying ?this.pause : this.play}>
            {this.state.isPlaying ? '||' : '>'}
          </button>
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
