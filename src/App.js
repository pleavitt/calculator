import React, { Component } from 'react';
import { inputButtons, opButtons } from './buttons';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 0,
      operation: '',
      left: 0,
      right: 0,
      isLastActionOperation: false,
    };

    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleOpClick = this.handleOpClick.bind(this);
  }

  handleInputClick(event) {
    const { display, isLastActionOperation, right } = this.state;
    this.setState({
      isLastActionOperation: false,
    });

    this.setState({
      display: display > 0 ? display + event.target.innerHTML : event.target.innerHTML,
      right: isLastActionOperation ? event.target.innerHTML : right + event.target.innerHTML,
    });
  }

  handleOpClick(event) {
    const { operation, left, right, display, isLastActionOperation } = this.state;
    if (operation !== '' && !isLastActionOperation) {
      this.setState({
        right: display,
      });
      console.log(this.state);
      this.callMathApi(operation, left, right);
    }
    this.setState({
      operation: event.target.className,
      left: display > 0 ? display : left,
      right: display > 0 ? left : display,
      display: event.target.innerHTML,
    });
    this.setState({
      isLastActionOperation: true,
    });
  }

  callMathApi(operator, param1, param2) {
    console.log(`Calling API: ${param1} ${operator} ${param2}`);
    fetch(`http://localhost:8080/${operator}?op1=${param1}&op2=${param2}`)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            display: result.result,
            left: result.result,
          });
        },
        error => {
          console.log(error);
        }
      );
  }

  render() {
    const renderedInputButtons = inputButtons.map(b => (
      <button
        className={b.gridClass}
        key={b.text}
        text={b.text}
        type="button"
        onClick={this.handleInputClick}
      >
        {b.text}
      </button>
    ));

    const renderedOpButtons = opButtons.map(b => (
      <button
        className={b.gridClass}
        key={b.text}
        text={b.text}
        type="button"
        onClick={this.handleOpClick}
      >
        {b.text}
      </button>
    ));

    return (
      <div className="container">
        <div className="calculator">
          <input type="text" value={this.state.display} disabled className="display" />
          {renderedInputButtons}
          {renderedOpButtons}
        </div>
      </div>
    );
  }
}

export default App;
