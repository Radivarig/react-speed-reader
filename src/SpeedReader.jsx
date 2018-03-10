import React from "react"
import PropTypes from "prop-types"

class SpeedReader extends React.Component {
  static propTypes = {
    "inputText": PropTypes.string.isRequired,
    "renderReader": PropTypes.func.isRequired,
    "isPlaying": PropTypes.bool.isRequired,
    "speed": PropTypes.number.isRequired,
    "chunk": PropTypes.number,
  }

  static defaultProps = {
    "chunk": 1,
  }

  constructor (props) {
    super (props)

    this.state = this.getDefaultState ()
  }

  getDefaultState = () => {
    const words = this.getWords (this.props.inputText)
    const currentText = words.slice (0, this.props.chunk).join (" ")

    return Object.assign (this.getWordParts (currentText), {
      "current": 0,
      words,
      currentText,
    })
  }

  componentWillReceiveProps = (nextProps) => {
    if (!this.props.isPlaying && nextProps.isPlaying)
      this.loop ()

    if (this.props.setProgress &&
        this.props.setProgress.timestamp !==
         nextProps.setProgress.timestamp)
      this.handleSetProgress (nextProps.setProgress)

    if(this.props.reset !== nextProps.reset) {
      this.setState (this.getDefaultState (nextProps))

      if (this.props.progressCallback)
        this.props.progressCallback ({
          "at": 0,
          "of": this.state.words.length || 1,
        })

      this.loop ()
    }
  }

  handleSetProgress = (setProgress) => {
    const l = this.state.words.length - 1
    let current, percent
    if (setProgress.skipFor) {
      current = this.state.current + setProgress.skipFor
      if (current < 0) current = 0
      if (current > l) current = l
      this.setState ({ current })
    }
    else if (setProgress.percent) {
      percent = setProgress.percent
      if (percent < 0) percent = 0
      if (percent > 100) percent = 100
      this.setState ({ "current": Math.floor (percent / 100 * l) })
    }
    else return

    this.offset = 0
    this.blank = 0
    this.loop ({
      "skip": true,
      "skipFor": setProgress.skipFor !== undefined,
      "skipPercent": percent === 0 || current === 0,
    })
  }

  getWords = (sentence) => sentence.split (/\s+/).filter (Boolean)

  componentDidMount = () => {
    this.loop ()
  }

  offset: 0

  blank: 0

  lastLoopId: undefined

  getWordParts = (currentText) => {
    const word = currentText.split ("")
    const pivot = this.pivot (currentText)
    return {
      "pre": word.slice (0, pivot),
      "mid": word[pivot],
      "post": word.slice (pivot + 1),
    }
  }

  loop = (opts) => {
    opts = opts || {}
    const ms = opts.skip ? 0 : 60000 / this.props.speed
    clearTimeout (this.lastLoopId)
    this.lastLoopId = setTimeout (() => {
      if(!opts.skip && !opts.skipFor && !this.props.isPlaying) return

      if (this.blank) {
        this.setState ({ "currentText": "", "pre": "", "mid": "", "post": "" })
        this.offset = this.blank - ms
        this.blank = 0
        return this.loop ()
      }

      const chunk = this.props.chunk
      let current = this.state.current + chunk
      const words = this.state.words
      const l = words.length - 1

      let currentStart = current - (chunk < l ? chunk : l)
      let currentTextWords = words.slice (currentStart, current)

      if(this.props.trim) {
        for(let i = 0; i < currentTextWords.length; ++i) {
          const w = currentTextWords[i]
          if(w.search (this.props.trim.regex) !== -1) {
            const cnt = i + 1
            currentTextWords = currentTextWords.slice (0, cnt)
            current = this.state.current + cnt
            break
          }
        }
      }
      const currentText = currentTextWords.join (" ")

      if (this.props.offset && this.props.offset.regex.test (currentText))
        this.offset = (this.props.offset.duration || 1) * ms
      else this.offset = 0

      if (this.props.blank && this.props.blank.regex.test (currentText))
        this.blank = (this.props.blank.duration || 1) * ms

      this.setState (Object.assign (this.getWordParts (currentText), {
        currentText,
        "current": opts.skip ? this.state.current : current,
      }))

      currentStart += opts.skipPercent ? 0 : chunk

      const wordsCount = l + 1
      if (this.props.progressCallback)
        this.props.progressCallback ({
          "at": currentStart > wordsCount ? wordsCount : currentStart,
          "of": wordsCount || 1,
        })

      if(currentStart < wordsCount) {
        if (!opts.skip || opts.skipFor) this.loop ()
      }
      else if (this.props.hasEndedCallback)
        this.props.hasEndedCallback ()
    }, ms + this.offset)
  }

  //eslint-disable-next-line
  pivot = (x) => (x.length !== 1) ? Math.floor ((x.length / 7) + 1) : 0

  render = () => this.props.renderReader (this.props, this.state)

}

export default SpeedReader
