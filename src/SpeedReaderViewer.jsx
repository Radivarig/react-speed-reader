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
, setInputText: function(e) {
    this.setState({inputText: e.target.value}, this.reset)
  }
, setSpeed: function(e) {
    var v = e.target ? e.target.value : e
    if(isNaN(v) || v < 0) return
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
, dragTarget: undefined
, setProgressPercent: function(e) {
    if (this.dragTarget) {
      window.getSelection().removeAllRanges()
      var rect = this.dragTarget.getBoundingClientRect()
      var percent = (e.clientX -rect.left)*100/rect.width
      var setProgress = {
        percent: percent
      , timestamp: new Date().getTime()
      }
      this.setState({setProgress: setProgress})
    }
  }
, setProgressSkipFor: function(x) {
    var setProgress = {
      skipFor: x
    , timestamp: new Date().getTime()
    }
    this.setState({setProgress: setProgress})
  }
, progressBar: function(progress) {
    var chunks = 25
    var ratio = progress ? progress.at/progress.of : 0
    var integerPart = Math.floor(ratio *chunks)
    var progressBar = new Array(integerPart +1).join('#')
    progressBar += new Array(chunks -integerPart +1).join('_')
    return {
      bar: '[' +progressBar +']'
    , percent: (ratio*100).toFixed(0) +'%'
    }
  }
, componentDidMount: function() {
    document.addEventListener('mousemove', this.setProgressPercent)
    document.addEventListener('click', this.setDragTarget(false))
    document.addEventListener('keydown', this.handleShortcuts)
  }
, handleShortcuts: function(e) {
    if (document.activeElement.tagName !== 'BODY') return

    var skipFor = 3
    var chgSpeed = 10

    if(e.keyCode == '32')   //space
      this.setState({isPlaying: !this.state.isPlaying})

    if(e.keyCode == '37') { //left
      if (e.ctrlKey) this.reset()
      else this.setProgressSkipFor(-skipFor)
    }
    if(e.keyCode == '39')   //right
      this.setProgressSkipFor(skipFor)

    if(e.keyCode == '38')   //up
      this.setSpeed(this.state.speed +chgSpeed)

    if(e.keyCode == '40')   //down
      this.setSpeed(this.state.speed -chgSpeed)
  }
, setDragTarget: function(start) {
    var self = this
    return function(e){
      self.dragTarget = start ? e.target : undefined
      self.setProgressPercent(e)
    }
  }
, render: function() {
    var self = this

    var outerStyle = {
      display: 'inline-block'
    , height: 150
    , width: 300
    }

    var frameStyle = {
      border: 'solid'
    , borderWidth: 1
    , borderLeftStyle: 'none'
    , borderRightStyle: 'none'
    , position: 'relative'
    , top: '50%'
    , transform: 'translateY(-51%)' // -1% for snap to pixel..
    }

    var speedReaderStyle = {
      transform: 'translate(' +(this.state.chunk == 1 ? -10 : 0) +'%)'
    , fontSize: '200%'
    }

    var progressBar = this.progressBar(this.state.progress)
    return (
      <div style={{textAlign: 'center'}}>
        <div style={outerStyle}>
          <div style={frameStyle}>
            <div style={speedReaderStyle}>
              <SpeedReader
                inputText={this.state.inputText}
                speed={this.state.speed || this.getInitialState().speed}
                isPlaying={this.state.isPlaying}
                setProgress={this.state.setProgress}
                hasEndedCallback={this.pause}
                progressCallback={this.progress}
                wordPartsCallback={undefined/*function(parts){console.log(parts)}*/}
                pivotColor={undefined/*defaults to red*/}
                chunk={this.state.chunk}
                reset={this.state.resetTs}
                trim={{regex: /\.|,|\?|!/}}
                offset={{regex: /\.|,|\?|!/, duration: 0.5}}
                blank={{regex: /\.|\?|!/, duration: 0.5}}
                />
            </div>
          </div>
        </div>

        <div>
          <span style={{cursor: 'col-resize'}} onMouseDown={this.setDragTarget(true)}>{progressBar.bar}</span>
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

        <textarea rows={10} cols={35}
          type="text"
          value={this.state.inputText}
          onChange={this.setInputText}
          />

        <div style={{margin: 5, color: 'grey'}}>
          <div>[<strong>Space</strong>] : play / pause</div>
          <div>[<strong>Left / Right</strong>] : skip backward / forward 3 words</div>
          <div>[<strong>Up / Down</strong>] : increase / decrease speed for 10 WPM</div>
        </div>

      </div>
    )
  }
})

module.exports = SpeedReaderViewer
 