import React, { Component } from 'react';
import './App.css';
import Header from './js/header.js'
import Footer from './js/footer.js'
import Title from './js/title.js'
import Content from './js/content.js'
import {FigureView} from './js/figure.js'

class App extends Component {
  componentDidMount(){
    window.__App = this
  }
  render() {
    const title='Review of “It’s About Time: Smartwatches as Public Displays”'
    return (
      <div className="App">
        <Header title={title} ref='header'/>
        <div className='container'>
          <Title ref='title' title={title}/>
          <Content parent={this}/>
        </div>
        <Footer parent={this}/>
        <FigureView ref='figure_view'/>
      </div>
    )
  }
}

export default App;
