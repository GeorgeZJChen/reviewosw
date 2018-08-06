import React, { Component } from 'react'
import axios from 'axios'
import '../css/header.css'

class Header extends Component {
  constructor(props){
    super(props)
    this.blockShows = 0
    this.state = {
      renderFlag: 1
    }
    this.demos = []
  }
  componentDidMount(){
    document.addEventListener('click', ()=>{
      if(this.blockShows === 1&&!this.__click_on_more_projects__){
        this.blockShows = 0
        this.refs.mp.style.display = ''
        this.refs.ob.className = this.refs.ob.className.replace(/ open/g,'')
        this.refs.mp.className = this.refs.mp.className.replace(/ open/g,'')
      }
      this.__click_on_more_projects__ = 0
    })
    this.loadDemos()
  }
  loadDemos(){
    const url = 'https://georgechenzj.github.io/static/demos.json'
    axios({
      method: 'get',
      url: url,
      responseType: 'json'
    }).then((res)=>{
      try {
        this.demos = res.data.demos
        this.setState((prevState)=>{
          return {
            renderFlag: ~prevState.renderFlag
          }
        })
      } catch (e) {
        console.warn(e);
        console.error('Data format error');
      }
    }).catch((err)=>{
      console.warn(err);
    })
  }
  render() {
    return (
      <div className='header'>
        <img src='img/logo.svg' className="header-logo" alt="logo"/>
        <div className='header-title'>{this.props.title}</div>
        <div className='options' onClick={()=>this.moreProjects()} ref='ob'>
          <div className='options-text'>More Projects</div>
          <div className='options-btn'></div>
        </div>
        <div className='more-projects' ref='mp' onClick={()=>{this.__click_on_more_projects__=1}}>
          <div className='btn-placeholder' onClick={()=>this.moreProjects()}></div>
          <div className='mp-hide-scroll' ref='mpscroll'>
              <div className='mp-content'>
                <div className='mp-welcome'>
                  <div className='mp-welcome-content'>
                      <div className='mp-welcome-ball-ct'>
                                  <div className='mp-welcome-ball-r1'>
                                    <div className='mp-welcome-ball1'>
                                      <div className='mp-welcome-ball-r2'>
                                      <div className='mp-welcome-ball2'></div>
                                      </div>
                                    </div>
                                  </div>
                      </div>
                      <div className='mp-welcome-text'>{"Hi! Let's discover more interesting projects."}</div>
                  </div>
                </div>
              <div className='mp-demos' ref='demos'>
                {
                  this.demos.map((item, index)=>{
                    if(item.title)
                      return(
                        <Demo title={item.title} desc={item.desc} source={item.preview} link={item.link} key={index}/>
                      )
                    return null
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  moreProjects(){
    this.__click_on_more_projects__ = 1
    if(!this.blockShows){
      this.refs.mp.style.display = 'block'
      this.refs.mpscroll.scrollTop = 0
      setTimeout(()=>{
        this.blockShows = 1
        this.refs.ob.className += ' open'
        this.refs.mp.className += ' open'
      }, 50)
    }else{
      this.blockShows = 0
      this.refs.mp.style.display = ''
      this.refs.ob.className = this.refs.ob.className.replace(/ open/g,'')
      this.refs.mp.className = this.refs.mp.className.replace(/ open/g,'')
    }
  }
}
class Demo extends Component{
  constructor(props){
    super(props)
    this.state = {
      ready: 0,
      error: 0
    }
  }
  visit(){
    if(this.props.link){
      window.open(this.props.link)
    }
  }
  render(){
    return (
      <div className='demo'>
        <div className='demo-title'>{this.props.title}</div>
        <div className='demo-desc'>{this.props.desc}</div>
          {
            this.props.source?
            (
              <div className='demo-img-frame'>

                <img src={this.props.source} className='demo-img' alt='' title={this.props.title}
                style={{visibility: this.state.ready&&!this.state.error?'visible':'hidden'}}
                onLoad={()=>this.setState({ready:1})} onError={()=>this.setState({error:1})}
                onClick={()=>this.visit()}/>
                {
                  this.state.ready&&!this.state.error?
                  ''
                  :
                  <img src='img/loading.gif' className="demo-img-loading" alt="loading" onClick={()=>this.visit()}/>
                }
              </div>
            ):(
              <div className='demo-img-frame'>
                <div className='demo-plaintext' onClick={()=>this.visit()} title={this.props.title}>
                  <img className='demo-texticon' src='img/texticon.png' alt=''/>
                </div>
              </div>
            )
          }
      </div>
    )
  }
}

export default Header
