import React, { Component } from 'react'
import '../css/footer.css'

class Footer extends Component {

  render() {
    return (
      <div className='footer'>
        <hr/>
        <p className='footer-text'>Thanks for sliding the page. The paper is boring, hollow and idle. But there are still some fun projects to know about. Would you like to pay visits to them?</p>
        <div className='footer-mp' onClick={()=>this.moreProjects()}>{"See more projects >"}</div>
        <h3>Contact:</h3>
        <p className='footer-text'>By email: <a className='footer-email' href="mailto:georgechenzj@outlook.com">georgechenzj@outlook.com</a></p>
      </div>
    )
  }
  moreProjects(){
    if(!this.props.parent.refs.header.blockShows){
      this.props.parent.refs.header.moreProjects()
    }
  }
}

export default Footer
