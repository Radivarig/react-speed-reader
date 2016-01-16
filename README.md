# react-speed-reader

Try it - [Live Example](https://radivarig.github.io/#/react-speed-reader)

![](http://i.imgur.com/M8Aw9Gh.gif)

### Install

`npm install react-speed-reader` (peer dependencies: `react react-dom`)

for React **v0.13.3** `npm install react-speed-reader@1.0.3`

### Demo

Check out [Live Example](https://radivarig.github.io/#/react-speed-reader) and the [example code](https://github.com/Radivarig/react-speed-reader/blob/master/src/SpeedReaderViewer.jsx), or run it locally
```bash
git clone git@github.com:Radivarig/react-speed-reader.git
npm install
npm run dev 
```
open `localhost:8080`

### Updates

(**1.1**): (**breaking**) function **renderReader** _(props, state)=>ReactElement_ is required in props of the reader

### Features

- **flash** one or _more_ words
- on **one** word flash, show highlighted **pivot** letter (the **red** focus)
- set words per minute (**WPM**)
- **pause** after character match
- **trim** sentence after character match
- show **blank** after character match
- TODO: multiple rows
- TODO: trim by row length

### Basic Usage

Check the [Example GUI](https://github.com/Radivarig/react-speed-reader/blob/master/src/SpeedReaderViewer.jsx) for full demonstration.
```javascript
// ...
  renderReader(props, state) {
    if ( !state.currentText )
      return <span>&nbsp;</span>  //keep lineHeight

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
// ...
    <SpeedReader
        inputText={'Something to read'}
        renderReader={this.renderReader/*above*/}
        speed={250}
        isPlaying={True}
    
        //bellow is optional

        trim={{regex: /\.|,|\?|!/} /*trim sentence*/}
        offset={{regex: /\.|,|\?|!/, duration: 0.5} /*pause for 0.5 times the WPM speed*/}
        blank={{regex: /\.|\?|!/, duration: 0.5} /*show blank*/}

        chunk={1/*number of words per flash*/}
        reset={{/*resets when changed, use timestamp new Date().getTime()*/}}
        setProgress={{/*{ skipFor: Int OR percent: 0 to 1, timestamp: new Date().getTime() }*/}}

        hasEndedCallback={{/*call your pause fn to sync with GUI*/}}
        progressCallback={{/*calls with {at: Int, of: Int}*/}}
        />
```

### License

MIT
