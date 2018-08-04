import React, { Component } from 'react'
import '../css/title.css'

class Title extends Component {
  constructor(props){
    super(props)
    this.btnFixed = 0
    this.state = {
      render: 0
    }
    this.SectionTitle = this.SectionTitle.bind(this)
    this.titles = []
    const date = new window.Date()
    this.views = (16*(date.getDay()+1) + date.getHours() + 300) * 0.5
  }
  update(titles){
    this.titles = titles
    this.setState((prevState)=>{
      return {render: ~prevState.render}
    })
  }
  nameOnClick(){
    // TODO:
  }
  SectionTitle(props){
    return <li onClick={()=>this.liOnClick(props.name)} className={props.type===1?'sec-tt':'sec-st'}
              >{props.name}</li>
  }
  liOnClick(to){
    window.location.hash = ''
    window.location.hash = '#'+to
  }
  toggleTableOfContent(){
    if(this.refs.tocToggle.className.indexOf('show')===-1){
      this.refs.tocToggle.className += ' show'
      this.refs.ul.style.maxHeight = (document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight)*0.7 +'px'
    }else{
      this.refs.tocToggle.className = this.refs.tocToggle.className.replace(' show','')
    }
  }
  componentDidMount(){
    const fix = ()=>{
      const top = this.refs.tocPlaceholder.offsetTop
      const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
      if(scrollTop>top){
        if(this.btnFixed === 0){
          this.btnFixed = 1
          if(this.refs.toc.className.indexOf('fixed')===-1){
            this.refs.toc.className += ' fixed'
          }
        }
      }else if(scrollTop<top-30){
        if(this.btnFixed === 1){
          this.btnFixed = 0
          if(this.refs.toc.className.indexOf('fixed')!==-1){
            this.refs.toc.className = this.refs.toc.className.replace(' fixed', '')
          }
        }
      }
    }
    document.body.onscroll = ()=>{
      fix()
      // clearTimeout(this.timeoutId)
      // this.timeoutId = setTimeout(fix,20)
    }
  }
  render() {
    return (
      <div style={{minHeight:200}}>
        <div className='title'>
          <h1 className='title-text'>{this.props.title}</h1>
          <div className='author'>
            <span className='link author-name' title="See more about the author" onClick={()=>this.nameOnClick}>Zhuojun Chen</span>,&nbsp;
            <span className='link author-org' title="Visit official site of University of Dundee" onClick={()=>window.open("http://dundee.ac.uk/")}>University of Dundee</span>
          </div>
        </div>
        <div className='panel'>
          <div className='panel-content'>
            <hr color='#dadada'/>
            <div className='views' style={{width:'2.8rem'}}><div>{this.views}</div><div style={{color:'#666',fontSize:'0.8rem'}}>Views</div></div>
            <div className='views' style={{width:'3.5rem'}}><div>6</div><div style={{color:'#666',fontSize:'0.8rem'}}>Updates</div></div>
            <div className='table-of-content-placeholder' ref='tocPlaceholder'></div>
            <div className='table-of-content' ref='toc'>
              <div className='toc-toggle' onClick={()=>this.toggleTableOfContent()} ref='tocToggle'>
                <span>Sections</span>
                <div className='angle'></div>
              </div>
              <div className='toc-ul-container'>
                <ul className='toc-ul' ref='ul' style={{maxHeight: (document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight)*0.7}}>
                  {this.titles.map((item,index)=>{
                    return <this.SectionTitle name={item.text} type={item.type} key={index}/>
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Title;
