import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import '../css/figure.css'

class Figure extends Component {
  constructor(props){
    super(props)
    this.state = {
      ready: 0,
      error: 0
    }
    if(!window.__count_figures__){
      window.__count_figures__ = 1
    }else {
      window.__count_figures__ ++
    }
    this.number = window.__count_figures__
  }
  viewFigure(){
    const App = window.__App
    App.refs.figure_view.view(this.refs.image, this.props.caption, this.props.alt)
  }
  viewFigureOnWindow(){
    const w = {}
    w.wid = this.number
    w.query = 'figure_'+this.query
    let captionText = this.props.caption.props.children
    if(captionText instanceof Array){
      captionText = captionText[0]
    }
    if(captionText.length>50){
      captionText = captionText.slice(0,50)+'...'
    }
    w.name = 'Figure '+this.number+'. '+captionText
    w.backgroundColor = 'rgba(32,35,42,0.9)'
    w.backgroundColor2 = ''
    w.color = ''
    w.color2 = ''
    w.maximisable = 0
    w.minimisable = 0
    w.resizable = 1
    w.animated = 1
    let imWidth = this.refs.image.naturalWidth || 600
    let imHeight = this.refs.image.naturalHeight || 800
    w.width = Math.min((document.documentElement.clientWidth?document.documentElement.clientWidth:document.body.clientWidth)*0.9, imWidth + 5)
    w.height = Math.min((document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight)*0.9, imHeight + 35)
    w.center = 1

    const Image = <img className='window-figure' src={this.props.source} alt=""/>

    const callback = (win)=>{
      ReactDOM.render(Image, win.refs.content)
      win.load()
    }

    window.windows.add(w, callback)
  }
  render() {
    return (
      <div className='figure-frame'
         style={{width:this.props.width}}>
        <div className='figure-container' style={{minHeight:120}}>
          <img src={this.props.source} className='figure' alt={this.props.alt||this.props.caption.props.children}
            style={{visibility: this.state.ready&&!this.state.error?'visible':'hidden'}} ref='image'
            onLoad={()=>this.setState({ready:1})} onError={()=>this.setState({error:1})}
            onDoubleClick={()=>this.viewFigure()} title='double click to open'
            />
          {
            this.state.ready&&!this.state.error?
            ''
            :
            <img src='img/loading.gif' className="figure-loading" alt="loading" />
          }
        </div>
        <div className='figure-caption'>
          <span className='figure-n'>Figure {this.number}: </span>
          {this.props.caption}
        </div>
        <a className='figure-open' title='clip' onClick={()=>this.viewFigureOnWindow()}><img className='figure-open-clip' src='img/clip.png' alt=''/></a>
      </div>
    )
  }
}
class FigureView extends Component {
  constructor(props){
    super(props)
    this.state = {
      display: 0

    }
    this.vertical = 1
  }
  view(image, caption, alt){
    this.caption = caption
    const _image = image.cloneNode(true)
    let h = _image.height
    let w = _image.width
    if(w>=h){
      this.vertical = 1
      _image.className = 'vf-img-img'
    }else{
      this.vertical = 0
      _image.className = 'vf-img-img'
    }
    this.refs.image.innerHTML = ''
    this.refs.image.appendChild(_image)
    this.setState({
      display: 1
    })
  }
  close(){
    this.setState({
      display: 0
    })
  }
  render(){
    return (
      <div className='view-figure' style={{display: this.state.display?'block':'none'}}>
        <div className='vf-close' onClick={()=>this.close()}>Close</div>
        <div className={'vf-img'+(this.vertical?' vf-img-v':' vf-img-h')} ref='image'></div>
        <div className={'vf-cap'+(this.vertical?' vf-cap-v':' vf-cap-h')}>{this.caption}</div>
        <div className='vf-cap-after'></div>
      </div>
    )
  }
}

export default Figure
export {Figure, FigureView}
