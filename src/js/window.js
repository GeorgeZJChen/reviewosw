import React, {Component} from 'react'

import '../css/window.css'

class Windows extends Component {

  constructor(props){
    super(props)
    this.state = {
      wins: new Map(),
      winsData: new Set(),
      maxIndex: 1000,
      selected: null,
      renderFlag: 1,
    }
    this.deselectFront = this.deselectFront.bind(this)

  }
  componentDidMount(){
    window.windows = this

    document.addEventListener('mousedown', this.deselectFront)
    document.addEventListener('touchstart', this.deselectFront)

  }
  componentWillUnmount(){
    document.removeEventListener('mousedown', this.deselectFront)
    document.removeEventListener('touchstart', this.deselectFront)
  }
  deselectFront(e){
    if(!this.__mousedown_on_window__){
      if(this.state.selected&&this.state.selected.refs.element) this.state.selected.deselect()
    }
    delete this.__mousedown_on_window__
  }
  selectFront(){
    if(!this.state.selected)
    {
      const fw = this.getFront()
      if(fw instanceof Win) fw.select()
    }
  }
  get(wid){
    return this.state.wins.get(wid)
  }
  add(win, cb){
    if(!this.state.wins.get(win.wid)){

      cb = cb?cb : (_win)=>{_win.load()}
      win.cb = cb
      this.state.winsData.add(win)

      this.setState((prevState)=>{
        return { renderFlag: ~prevState.renderFlag }
      })
      return 1
    }
    return 0
  }
  remove(win){
    this.state.wins.delete(win.wid)
    this.state.winsData.delete(win.props.data)
    if(this.state.selected==win) this.state.selected = null
    this.setState((prevState)=>{
      return { renderFlag: ~prevState.renderFlag }
    })
    this.selectFront()
  }
  getFront(){
    let frontWin
    this.state.wins.forEach((win)=>{
      if(win.zIndex > (frontWin?frontWin.zIndex:1000)){
        frontWin = win
      }
    })
    return frontWin
  }

  render(){
    return (
      <div className='windows-ct' ref='element'>
        <div className='shadow' ref='shadow'>
          <div className='shadow-inner'></div>
        </div>
        {
          (()=>{
            const arr = []
            this.state.winsData.forEach((data)=>{
              arr.push(<Win data={data} key={data.wid} parent={this} container={this.props.parent.refs.windowsSizeKeeper}/>)
            })
            return arr
          })()
        }
      </div>
    )
  }
}

class Win extends Component{
  constructor(props){
    super(props)
    this.state ={
    }
    this.container = props.container

    const d = props.data

    this.wid = d.wid
    this.query = d.query
    this.name = d.name
    this.color = d.color
    this.color2 = d.color2
    this.backgroundColor = d.backgroundColor
    this.backgroundColor2 = d.backgroundColor2
    this.resizable = d.resizable===0?0:1
    this.minimisable = d.minimisable===0?0:1
    this.maximisable = d.maximisable===0?0:1
    this.animated = d.animated===0?0:1
    this.width = d.width || 600
    this.height = d.height || 400
    this.getPosition(d.center)

    this.close = this.close.bind(this)

    const f = ()=>{}
    this.maximise = this.maximisable?this.maximise.bind(this):f
    this.resize = this.resizable?this.resize.bind(this):f

    this.onMouseDown = this.onMouseDown.bind(this)

    this.maximised = 0
    this.minimised = 0
    this.loaded = 0
    this.onMouseDownLabel = this.onMouseDownLabel.bind(this)

    this.hoverTag = {
      name: this.name,
      action: "Move to"
    }
    props.parent.state.wins.set(this.wid, this)
  }
  componentDidMount() {
    setTimeout(()=>{
      this.props.data.cb(this)

    },100)
  }
  componentWillUnmount(){
  }
  load(){
    this.loaded = 1
    this.setStyle({
      top: this.top +'px',
      left: this.left +'px',
      width: this.width +'px',
      height: this.height +'px',
    })
    this.select()
    this.open()
  }
  render(){
    return(
      <div className='window' ref='element' onMouseDown={this.onMouseDown} >
        <div className='window-label' ref='label'>
          <div className='label-name' data-title={this.name}
            style={{marginRight:(this.minimisable*46+this.maximisable*46+46)}}
            onMouseDown={this.onMouseDownLabel} onTouchStart={this.onMouseDownLabel}
            onDoubleClick={this.maximise}
            ></div>
        </div>
        <div className='btn-group' ref='btns'>
        {
          [
            this.minimisable?<div className='btn btn-minimise' onClick={this.minimise} key={'btn_1'}></div>:'',
            this.maximisable?<div className='btn btn-maximise' onClick={this.maximise} ref='maximise' key={'btn_2'}></div>:'',
            <div className='btn btn-close' onClick={this.close} key={'btn_3'}></div>
          ]
        }
        </div>
        <div className='window-content' ref='content'></div>
        {
          this.resizable?
            <div className='resize' ref='resize' onMouseDown={this.resize} onTouchStart={this.resize}>
              <div className='bar-left'></div><div className='bar-top'></div><div className='bar-right'></div><div className='bar-bottom'></div>
              <div className='dot-left-top'></div><div className='dot-right-top'></div><div className='dot-right-bottom'></div><div className='dot-left-bottom'></div>
            </div>
            :
            ''
        }
      </div>
    )
  }
  open(){
    if(this.animated){
      this._aniopen()
    }
    else {
      this._open()
    }
  }
  maximise(){
    if(this.animated){
      this._animax()
    }
    else {
      this._maximise()
    }
  }
  close(){
    if(this.animated){
      this._aniclose()
    }
    else {
      this._close()
    }
  }
  select(){
    if(this.selected||!this.refs.element) return
    if(this.props.parent.state.selected) this.props.parent.state.selected.deselect()
    this.props.parent.state.selected = this
    this.selected = 1
    this.setStyle({
      backgroundColor:  this.backgroundColor,
      borderColor:  this.backgroundColor,
      color:  this.color,
      zIndex: ++this.props.parent.state.maxIndex
    })
    this.refs.btns.style.color = this.color
    this.refs.label.style.color = this.color

    this.zIndex = this.props.parent.state.maxIndex
    const ele = this.refs.element
    ele.className = ele.className.replace(new RegExp(' deselected','g'),'')

  }
  deselect(){
    if(!this.selected||!this.refs.element) return
    this.props.parent.state.selected = null
    this.selected = 0
    this.setStyle({
      backgroundColor:  this.backgroundColor2,
      borderColor:  this.backgroundColor2,
      color:  this.color2
    })
    this.refs.label.style.color = this.color2
    this.refs.btns.style.color = this.color2
    this.refs.element.className += ' deselected'

  }
  onMouseDown(e){
    this.props.parent.__mousedown_on_window__ = 1
    if(!this.selected) this.select()
  }
  onMouseDownLabel(e){
    this.onDrag(e)
  }
  _onDrop(items){
    if(this.onDrop){
      this.onDrop(items)
      this.select()
    }
  }
  onDrag(e){
    const x = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
    const y = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
    const ele = this.refs.element
    let beginLeft = ele.offsetLeft
    let beginTop = ele.offsetTop
    let left
    let top
    let shadow
    let shadowShowing = 0
    let shadowZindex

    let moved = false
    const move = (e)=>{
      let mx = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
      let my = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
      if(!moved&&Math.abs(my-y)<4&&Math.abs(mx-x)<4) return
      if(!moved){
        moved = true
        if(this.resizable)this.refs.resize.style.visibility = 'hidden'
        shadow = this.props.parent.refs.shadow
        shadowZindex = this.props.parent.state.maxIndex
        shadow.style.zIndex = shadowZindex
      }
      if(this.maximised){
        this._maximise()
        let width = this.width
        let ctWidth = this.container.offsetWidth
        if (x < width / 2)
        left = 0
        else if (x > ctWidth - width / 2)
        left = ctWidth - width
        else
        left = x - width / 2
        beginLeft = left
        beginTop = 0
        this.setStyle({
          left: left +'px',
          top: 0,
          width: this.width+'px',
          height: this.height+'px'
        })

      }
      else if(this.clinging){
        left = mx-x +beginLeft
        if(my > 40){
          this.clinging = 0
          if(left+this.width<mx-7)
            left = mx - this.width / 2
          this.setStyle({
            left: left +'px',
            top: 0,
            width: this.width +'px',
            height: this.height +'px'
          })
        } else {
          this.setStyle({
            left: left +'px',
            top: 0
          })
        }
      }
      else {
        left = mx-x +beginLeft
        top = my-y +beginTop
        this.setStyle({
          left: left +'px',
          top: top+'px'
        })
        if(!this.resizable||!this.maximisable) return
        //shadow
        let removeShadow = 0
        let showShadow = 0
        if(top>0&&mx>15&&mx<this.container.offsetWidth-15)
          removeShadow = 1
        if(top<-7||mx<=1||mx>=this.container.offsetWidth-1)
          showShadow = 1

        if(showShadow&&!shadowShowing){
          shadowShowing = 1
          shadow.style.transition = 'none'
          shadow.style.opacity = 1
          shadow.style.top = Math.max(my,0) +'px'
          shadow.style.left = Math.min(Math.max(mx,0),this.container.offsetWidth) +'px'
          shadow.style.width = 0
          shadow.style.height = 0
          shadow.style.zIndex = shadowZindex
          setTimeout(()=>{
            shadow.style.transition = ''
            shadow.style.opacity = ''
            shadow.style.top = ''
            shadow.style.left = ''
            shadow.style.width = ''
            shadow.style.height = ''
          }, 50)
        }else if (removeShadow&&shadowShowing) {
          shadowShowing = 0
          shadow.style.opacity = 0
          shadow.style.top = shadow.offsetTop +'px'
          shadow.style.left = shadow.offsetLeft +'px'
          shadow.style.width = shadow.offsetWidth +'px'
          shadow.style.height = shadow.offsetHeight +'px'
          shadow.style.display = 'block'
          setTimeout(()=>{
            shadow.style.opacity = ''
          }, 250)
        }

        if(top<-7){
          if(shadow.className.indexOf('top')===-1)
          shadow.className += ' top'
        }else if(top>0){
          shadow.className = shadow.className.replace(new RegExp(' top','g'),'')
        }
        if(mx<=1){
          if(shadow.className.indexOf('left')===-1)
          shadow.className += ' left'
        }else if(mx>15){
          shadow.className = shadow.className.replace(new RegExp(' left','g'),'')
        }
        if(mx>=this.container.offsetWidth-1){
          if(shadow.className.indexOf('right')===-1)
          shadow.className += ' right'
        }else if(mx<this.container.offsetWidth-15){
          shadow.className = shadow.className.replace(new RegExp(' right','g'),'')
        }

      }
    }
    const tm = function(e){e.preventDefault()}
    const up = (e)=>{
      document.removeEventListener('touchmove', tm, {passive: false})
      document.removeEventListener('mousemove', move, false)
      document.removeEventListener('mouseup', up, false)
      document.removeEventListener("touchmove", move, false)
      document.removeEventListener("touchend", up, false)
      document.removeEventListener("touchcancel", up, false)
      if(moved){
        if(this.resizable)this.refs.resize.style.visibility = ''
        shadow.style.display = ''

        let cn = shadow.className
        const ct = this.container
        if(cn.indexOf('top')!==-1){
          if(cn.indexOf('left')!==-1){
            this.clinging = 1
            this.setStyle({
              top: 0,
              left: 0,
              width: ct.offsetWidth/2 +'px',
              height: ct.offsetHeight/2 +'px'
            })
          }else if(cn.indexOf('right')!==-1){
            this.clinging = 1
            this.setStyle({
              top: 0,
              left: ct.offsetWidth/2 +'px',
              width: ct.offsetWidth/2 +'px',
              height: ct.offsetHeight/2 +'px'
            })
          }else{
            this.maximise()
          }
        }else if(cn.indexOf('left')!==-1){
          this.clinging = 1
          this.setStyle({
            top: 0,
            left: 0,
            width: ct.offsetWidth/2 +'px',
            height: ct.offsetHeight +'px'
          })
        }else if (cn.indexOf('right')!==-1){
          this.clinging = 1
          this.setStyle({
            top: 0,
            left: ct.offsetWidth/2 +'px',
            width: ct.offsetWidth/2 +'px',
            height: ct.offsetHeight +'px'
          })
        }else if(top<0){
          top = 0
          this.setStyle({
            top: 0
          })
        }else if(top>this.container.offsetHeight-7){
          top = this.container.offsetHeight-25
          this.setStyle({
            top: top +'px'
          })
        }
        if(left>this.container.offsetWidth-40 && cn.indexOf('right')===-1){
          left = this.container.offsetWidth-40
          this.setStyle({
            left: left +'px'
          })
        }else if (left<40-this.refs.element.offsetWidth && cn.indexOf('left')===-1) {
          this.setStyle({
            left: 40-this.refs.element.offsetWidth +'px'
          })
        }
        if(!this.maximised&&!this.clinging){
          this.top = top
          this.left = left
        }
        shadow.removeAttribute('style')
        shadow.className = 'shadow'
      }
    }
    document.addEventListener('touchmove', tm, {passive: false})
    document.addEventListener('mousemove', move, false)
    document.addEventListener('mouseup', up, false)
    document.addEventListener("touchmove", move, false)
    document.addEventListener("touchend", up, false)
    document.addEventListener("touchcancel", up, false)
  }
  resize(e){
    const x = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
    const y = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
    const cls = e.target.className
    let top = this.refs.element.offsetTop
    let left = this.refs.element.offsetLeft
    let width = this.refs.element.offsetWidth
    let height = this.refs.element.offsetHeight
    let minHeight
    let minWidth
    const shadow = this.props.parent.refs.shadow
    let shadowShowing
    let moved = false
    const move = (e)=>{
      let mx = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
      let my = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
      if(!moved&&Math.abs(my-y)<4&&Math.abs(mx-x)<4) return
      if(!moved){
        moved = true
        let style = getComputedStyle(this.refs.element)
        minWidth = style.minWidth.replace('px','') *1
        minHeight = style.minHeight.replace('px','') *1
      }
      let vx = mx - x
      let vy = my - y
      if(this.clinging){
        if(cls.indexOf("top") !== -1){
          this.clinging = 0
        }
      }
      if (cls.indexOf("left") !== -1) {
        if(vx> width -minWidth) vx = width - minWidth
        this.setStyle({
          width: (width - vx) + "px",
          left: (left + vx) + "px"
        })
      } else if (cls.indexOf("right") !== -1) {
        this.setStyle({
          width: (width + vx) + "px",
        })
      }
      if (cls.indexOf("top") !== -1) {
        if(vy> height -minHeight) vy = height -minHeight
        if(top+vy<-7){
          if(cls.indexOf('dot')===-1){
            if(!shadowShowing){
              shadowShowing = 1
              shadow.style.display = 'block'
              shadow.style.opacity = 1
              shadow.style.top = Math.max(my,0) +'px'
              shadow.style.left = Math.min(Math.max(mx,0),this.container.offsetWidth) +'px'
              shadow.style.width = 0
              shadow.style.height = 0
              shadow.style.transition = 'none'
              shadow.style.zIndex = this.props.parent.state.maxIndex
              setTimeout(()=>{
                shadow.style.top = 0
                shadow.style.left = left-14 +'px'
                shadow.style.width = this.width+28 +'px'
                shadow.style.height = this.container.offsetHeight +'px'
                shadow.style.transition = ''
              },50)
            }
          }
        }else if(shadowShowing){
          shadow.style.opacity = 0
          shadowShowing = 0
        }
        this.setStyle({
          height: (height - vy) + "px",
          top: (top + vy) + "px"
        })
      } else if (cls.indexOf("bottom") !== -1) {
        this.setStyle({
          height: (height + vy) + "px",
        })
      }
    }
    const tm = function(e){e.preventDefault()}
    const up = (e)=>{
      document.removeEventListener('touchmove', tm, {passive: false})
      document.removeEventListener('mousemove', move, false)
      document.removeEventListener('mouseup', up, false)
      document.removeEventListener("touchmove", move, false)
      document.removeEventListener("touchend", up, false)
      document.removeEventListener("touchcancel", up, false)
      if(moved){
        if(this.refs.element.offsetTop<-7){
          this.setStyle({
            top: 0,
            height: this.container.offsetHeight +'px'
          })
          this.clinging = 1
        }else if (this.refs.element.offsetTop<0) {
          this.setStyle({
            top: 0
          })
          this.clinging = 1
        }
        else if(!this.clinging){
          this.width = this.refs.element.offsetWidth
          this.height = this.refs.element.offsetHeight
          this.left = this.refs.element.offsetLeft
          this.top = this.refs.element.offsetTop
        }
        shadow.style.opacity = 0
        setTimeout(()=>{
          shadow.removeAttribute('style')
        },200)
        if(this.afterResize) this.afterResize(this)
      }
    }
    document.addEventListener('touchmove', tm, {passive: false})
    document.addEventListener('mousemove', move, false)
    document.addEventListener('mouseup', up, false)
    document.addEventListener("touchmove", move, false)
    document.addEventListener("touchend", up, false)
    document.addEventListener("touchcancel", up, false)

  }
  setStyle(style){
    for(var key in style){
      if(style[key]===undefined||style[key]===null)
        style[key] = ''
      if(this.refs.element)
        this.refs.element.style[key] = style[key]
    }
  }
  getPosition(center){
    const container = this.container
    if(center){
      this.left = Math.max(0, Math.floor((container.offsetWidth - this.width)/2))
      this.top = Math.max(0, Math.floor((container.offsetHeight - this.height)/2))
    }
    else{
      this.left = Math.max(0, Math.floor((container.offsetWidth - this.width)*(Math.random()*0.5+0.25)))
      this.top = Math.max(0, Math.floor((container.offsetHeight - this.height)*(Math.random()*0.5+0.25)))
    }
  }
  _aniopen(){
    this.setStyle({
      visibility: "visible"
    })
    const ele = this.refs.element
    ele.className += ' open-p'
    setTimeout(()=>{
      ele.className += ' open-f'
      setTimeout(()=>{
        this._open()
        ele.className = ele.className.replace(new RegExp(' open-p','g'),'')
        ele.className = ele.className.replace(new RegExp(' open-f','g'),'')
      },250)
    },20)
  }
  _open(){
    this.setStyle({
      visibility: "visible",
      opacity: 1
    })
  }
  _animax(){
    const ele = this.refs.element
    if(!this.maximised){
      ele.className += ' max-p'
      setTimeout(()=>{
        ele.className += ' max-f'
        setTimeout(()=>{
          this._maximise()
          ele.className = ele.className.replace(new RegExp(' max-p','g'),'')
          ele.className = ele.className.replace(new RegExp(' max-f','g'),'')
        },250)
      },20)
    }else{
      ele.className += ' max-restore-p'
      setTimeout(()=>{
        this._maximise()
        ele.className += ' max-restore-f'
        setTimeout(()=>{
          ele.className = ele.className.replace(new RegExp(' max-restore-p','g'),'')
          ele.className = ele.className.replace(new RegExp(' max-restore-f','g'),'')
        },250)
      },20)
    }
  }
  _maximise(){
    const ct = this.container
    const maxBtn = this.refs.maximise
    if(!this.maximised){
      this.maximised = 1
      this.setStyle({
        left: 0,
        top: 0,
        width: ct.offsetWidth +'px',
        height: ct.offsetHeight +'px'
      })
      maxBtn.className += ' restore'
      if(this.resizable) this.refs.resize.style.visibility = 'hidden'
    }else {
      this.maximised = 0
      this.clinging = 0
      this.setStyle({
        left: this.left+'px',
        top: this.top+'px',
        width: this.width +'px',
        height: this.height +'px'
      })
      maxBtn.className = maxBtn.className.replace(new RegExp(' restore', 'g'), '')
      if(this.resizable)this.refs.resize.style.visibility = 'visible'
    }
  }

  _aniclose(){
    const ele = this.refs.element
    ele.className += ' close-p'
    setTimeout(()=>{
      ele.className += ' close-f'
      setTimeout(()=>{
        this._close()
        ele.className = ele.className.replace(new RegExp(' close-p','g'),'')
        ele.className = ele.className.replace(new RegExp(' close-f','g'),'')
      },250)
    },20)
  }
  _close(){
    if(this.onClose) this.onClose(this)
    this.props.parent.remove(this)
  }
}

export default Windows
