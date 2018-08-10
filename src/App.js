import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    console.log(this);
    console.log(event.target.innerHTML);

    event.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <div className="calculator">
          <input type="text" disabled className="display" />

          <button type="button" className="one" onClick={this.handleClick}>
            1
          </button>

          <button type="button" className="three" onClick={this.handleClick}>
            3
          </button>
          <button type="button" className="four" onClick={this.handleClick}>
            4
          </button>
          <button type="button" className="five" onClick={this.handleClick}>
            5
          </button>
          <button type="button" className="six" onClick={this.handleClick}>
            6
          </button>
          <button type="button" className="seven" onClick={this.handleClick}>
            7
          </button>
          <button type="button" className="eight" onClick={this.handleClick}>
            8
          </button>
          <button type="button" className="nine" onClick={this.handleClick}>
            9
          </button>
          <button type="button" className="zero" onClick={this.handleClick}>
            0
          </button>
          <button type="button" className="backspace" onClick={this.handleClick}>
            BS
          </button>
          <button type="button" className="clear" onClick={this.handleClick}>
            C
          </button>
          <button type="button" className="two" onClick={this.handleClick}>
            2
          </button>
          <button type="button" className="power" onClick={this.handleClick}>
            power
          </button>
          <button type="button" className="quotient" onClick={this.handleClick}>
            /
          </button>
          <button type="button" className="clear" onClick={this.handleClick}>
            C
          </button>

          <button type="button" className="pi" onClick={this.handleClick}>
            pi
          </button>
          <button type="button" className="log" onClick={this.handleClick}>
            log 10
          </button>
          <button type="button" className="logNatural" onClick={this.handleClick}>
            log n
          </button>
          <button type="button" className="multiply" onClick={this.handleClick}>
            *
          </button>

          <button type="button" className="subtract" onClick={this.handleClick}>
            -
          </button>
          <button type="button" className="add" onClick={this.handleClick}>
            +
          </button>

          <button type="button" className="equals" onClick={this.handleClick}>
            =
          </button>

          <button type="button" className="decimal" onClick={this.handleClick}>
            <b>.</b>
          </button>
          <button type="button" className="empty" />
        </div>
      </div>
    );
  }
}

export default App;
