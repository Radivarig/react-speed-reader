import React from 'react'
import SpeedReader from './SpeedReader.jsx'

class SpeedReaderViewer extends React.Component {
  getDefaultState = (props) => {
    return {
      inputText: 'Science, what is it all about?\nTechmology, what is that all about?\nIs it good?\nIs it wacked?\nIs it good, is it wacked?\nWhat is it all about?\n'
    , isPlaying: false
    , resetTs: undefined
    , speed: 250
    , chunk: 1
    , setProgress: {timestamp: undefined}
    }
  }

  state = this.getDefaultState()

  toggleIsPlaying = () => {
    document.activeElement.blur()
    var isPlaying = this.state.isPlaying
    this.setState({isPlaying: !isPlaying })
  }

  reset = (opts) => {
    if ( !(opts || {}).skipBlur )
      document.activeElement.blur()
    this.setState({
      isPlaying: false
    , resetTs: new Date().getTime()
    })
  }

  increaseChunk = () => {
    this.alterChunk(1)
  }

  decreaseChunk = () => {
    this.alterChunk(-1)
  }

  setInputText = (e) => {
    var self = this
    this.setState({inputText: e.target.value},
      function(){self.reset({skipBlur: true})})
  }

  setSpeed = (e) => {
    var v = e.target ? e.target.value : e
    if(isNaN(v) || v < 0) return
    this.setState({speed: parseInt(v || 0)}, ()=>this.reset ({skipBlur:true}))
  }

  alterChunk = (x) => {
    document.activeElement.blur()
    var chunk = this.clamp(this.state.chunk +x, 1, 3)
    this.setState({chunk: chunk}, this.reset)
  }

  clamp = (x, min, max) => {
    if(x < min) return min
    if(x > max) return max
    return x
  }

  progress = (x) => {
    this.setState({progress: x})
  }

  dragTarget: undefined

  setProgressPercent = (e) => {
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

  setProgressSkipFor = (x) => {
    var setProgress = {
      skipFor: x
    , timestamp: new Date().getTime()
    }
    this.setState({setProgress: setProgress})
  }

  progressBar = (progress) => {
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

  componentDidMount = () => {
    document.addEventListener('mousemove', this.setProgressPercent)
    document.addEventListener('click', this.removeDragTarget)
    document.addEventListener('keydown', this.handleShortcuts)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousemove', this.setProgressPercent)
    document.removeEventListener('click', this.removeDragTarget)
    document.removeEventListener('keydown', this.handleShortcuts)
  }

  handleShortcuts = (e) => {
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

  removeDragTarget = () => {
    this.dragTarget = undefined
  }

  setDragTarget = (e) => {
    this.dragTarget = e.target
    this.setProgressPercent(e)
  }

  renderReader = (props, state) => {
    if ( !state.currentText )
      return <span>&nbsp;</span>

    if (props.chunk > 1)
      return <span>{state.currentText}</span>

    var fixedLeft = {
      position: 'absolute'
    , display: 'inline-block'
    , transform: 'translate(-100%)'
    , textAlign: 'right'
    }
    return (
      <span>
        <span style={fixedLeft}>{state.pre}</span>
        <span style={{color: 'red'}}>{state.mid}</span>
        <span style={{position: 'absolute'}}>{state.post}</span>
      </span>
    )
  }

  render = () => {
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
    , backgroundColor: '#FFF'
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
                renderReader={this.renderReader/*(props, state)=>reactElement*/}
                inputText={this.state.inputText}
                speed={this.state.speed || this.getDefaultState().speed}
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
          </div>
        </div>

        <div>
          <span style={{cursor: 'col-resize', fontFamily: 'monospace'}} onMouseDown={this.setDragTarget}>{progressBar.bar}</span>
          <span style={{position: 'absolute', display: 'inline-block', width: '40', textAlign: 'right'}}>{progressBar.percent}</span>
        </div>

        <div>
          <button onClick={this.toggleIsPlaying}>{this.state.isPlaying ? 'Pause' : 'Play'}</button>
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
            placeholder={this.getDefaultState().speed}
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
          <div>[<strong>Space</strong>] : play / pause [<strong>Ctrl + Left</strong>] : reset</div>
          <div>[<strong>Left / Right</strong>] : skip backward / forward 3 words</div>
          <div>[<strong>Up / Down</strong>] : increase / decrease speed for 10 WPM</div>
        </div>

      </div>
    )
  }
}

export default SpeedReaderViewer
