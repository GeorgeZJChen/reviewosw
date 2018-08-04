import React, { Component } from 'react'
import '../css/table.css'

class Table extends Component {

  constructor(props){
    super(props)
    if(!window.__count_tables__){
      window.__count_tables__ = 1
    }else {
      window.__count_tables__ ++
    }
    this.number = window.__count_tables__
  }


  render() {
    return (
      <div className='table-outter'>
      <div className='table-frame'
         style={{width:this.props.width}}>
        <div className='table-container' style={{minHeight:120}}>
          <table className='table'>
            {this.props.thead}
            {this.props.tbody}
          </table>
        </div>
        <div className='table-caption'>
          <span className='table-n'>Table {this.number}: </span>
          {this.props.caption}
        </div>
      </div>
      </div>
    )
  }
}

export default Table
