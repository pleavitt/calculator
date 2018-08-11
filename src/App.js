import React, { Component } from 'react';
import { inputButtons, opButtons } from './buttons';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 0,
      operation: '',
      left: null,
      right: null,
      isLastActionOp: false,
      isDisplayInput: true,
      callApi: false,
      lastOpWasEquals: false,
      error: '',
    };

    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleOpClick = this.handleOpClick.bind(this);
  }

  componentDidUpdate() {
    const { operation, left, right, callApi } = this.state;

    if (callApi && operation !== '') {
      this.callMathApi(operation, left, right);
    }
  }

  handleInputClick(event) {
    const { display, isLastActionOp, isDisplayInput, lastOpWasEquals } = this.state;
    // if display ends in a . or last operation was =
    if ((!isDisplayInput && lastOpWasEquals) || event.target.className === 'clear') {
      this.setState({
        display: 0,
        operation: '',
        left: null,
        right: null,
        isLastActionOp: false,
        isDisplayInput: true,
        callApi: false,
      });
    }
    // if last is not a decimal or button pressed is not a decimal AND its not the clear command
    if (
      (display[display.length - 1] !== '.' || event.target.innerHTML !== '.') &&
      event.target.className !== 'clear'
    ) {
      this.setState({
        display:
          (display > 0 || display[display.length - 1] === '.') && !isLastActionOp
            ? display + event.target.innerHTML
            : event.target.innerHTML,
        isLastActionOp: false,
        isDisplayInput: true,
      });
    }
  }

  handleOpClick(event) {
    const { operation, left, right, display, isLastActionOp, isDisplayInput } = this.state;

    if (
      event.target.innerHTML === 'log' ||
      event.target.innerHTML === 'ln' ||
      event.target.innerHTML === 'pi'
    ) {
      this.setState({
        operation: event.target.className,
        left: display,
        right: null,
        callApi: true,
      });
    } else if (!isLastActionOp || (event.target.innerHTML === '=' && right !== null)) {
      if (left === null || !isDisplayInput) {
        this.setState({
          left: display,
          callApi: false,
        });
      } else if (!isLastActionOp) {
        this.setState({
          right: display,
        });
      }

      if (event.target.innerHTML !== '=') {
        this.setState({
          operation: event.target.className,
          display: event.target.innerHTML,
        });
      }
      if (operation !== '') {
        this.setState({
          callApi: true,
        });
      }
    }

    this.setState({
      isLastActionOp: true,
      operation: event.target.innerHTML.includes('=') ? operation : event.target.className,
      lastOpWasEquals: event.target.innerHTML === '=',
    });
    // if ((operation !== '' && !isLastActionOp) || event.target.innerHTML === '=') {
    //   console.log('pushing to right');

    //   this.setState({
    //     right: isDisplayInput && event.target.innerHTML !== '=' ? display : right,
    //   });
    //   console.log(this.state);
    //   this.callMathApi(operation, left, right);
    // }
    // if (event.target.innerHTML !== '=') {
    //   this.setState({
    //     operation: event.target.className,
    //     left: display > 0 ? display : left,
    //     right: display > 0 ? left : display,
    //   });

    //   this.setState({
    //     isLastActionOp: true,
    //   });
    // }
  }

  callMathApi(operator, param1, param2) {
    const { left, display } = this.state;
    console.log(`Calling API: ${param1} ${operator} ${param2}`);
    fetch(`http://localhost:8080/${operator}?op1=${param1}&op2=${param2}`)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            display:
              result.result === 'NaN' || result.result === '-Infinity' ? display : result.result,
            left: result.result === 'NaN' || result.result === '-Infinity' ? left : result.result,
            isDisplayInput: false,
            callApi: false,
            error: result.result === 'NaN' || result.result === '-Infinity' ? result.result : '',
          });
        },
        error => {
          console.log(error);
        }
      );
  }

  render() {
    const { display } = this.state;
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
          <input type="text" value={display} disabled className="display" />
          {renderedInputButtons}
          {renderedOpButtons}
        </div>
      </div>
    );
  }
}

export default App;
