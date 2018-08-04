import React, { Component } from 'react'
import '../css/math.css'

class MathJax extends Component {

  constructor(props){
    super(props)
    if(!window.__count_maths__){
      window.__count_maths__ = 1
    }else {
      window.__count_maths__ ++
    }
    this.number = window.__count_maths__
  }

  componentDidMount(){
    setTimeout(()=>{
      const MJ = window.MathJax
      if(MJ) MJ.Hub.Queue(["Typeset",MJ.Hub,'QV0LZU9TWC'+this.number])
    },100)
  }

  render() {
    return (
        <span className='math' id={'QV0LZU9TWC'+this.number}
          dangerouslySetInnerHTML={{__html: '$$'+ this.props.math +'$$'}} >
        </span>
    )
  }
}

export default MathJax
