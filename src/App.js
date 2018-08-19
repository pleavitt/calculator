import React, { Component } from 'react';
import { buttonRow1, buttonRow2, buttonRow3, buttonRow4, buttonRow5 } from './buttons';

import './App.css';

const Display = props => (
  <div className="lcd">
    <div className="result">{props.display}</div>
  </div>
);

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
    const { display, isLastActionOp, isDisplayInput, lastOpWasEquals, error } = this.state;

    // if error, api result and equals pressed, clear button then clear everything
    if ((!isDisplayInput && lastOpWasEquals) || event.target.id === 'clear' || error !== '') {
      this.setState({
        display: 0,
        operation: '',
        left: null,
        right: null,
        isLastActionOp: false,
        isDisplayInput: true,
        callApi: false,
        error: '',
      });
    }
    // if last is not a decimal or button pressed is not a decimal AND its not the clear command
    if (
      (display[display.length - 1] !== '.' || event.target.innerHTML !== '.') &&
      event.target.id !== 'clear' &&
      event.target.id !== 'backspace' &&
      event.target.id !== 'negate'
    ) {
      this.setState({
        display:
          (display > 0 || display[display.length - 1] === '.') && !isLastActionOp
            ? display + event.target.innerHTML
            : event.target.innerHTML,
        isLastActionOp: false,
        isDisplayInput: true,
      });
    } else if (
      (event.target.id === 'negate' || event.target.id === 'backspace') &&
      display !== 0 &&
      display[display.length - 1] !== '.'
    ) {
      if (event.target.id === 'negate') {
        this.setState({
          display: display * -1,
          isLastActionOp: false,
          isDisplayInput: true,
        });
      } else if (event.target.id === 'backspace' && !isLastActionOp && isDisplayInput) {
        this.setState({
          display: display.length === 1 ? 0 : display.slice(0, -1),
          isLastActionOp: false,
          isDisplayInput: true,
        });
      }
    }
  }

  handleOpClick(event) {
    const { operation, left, right, display, isLastActionOp, isDisplayInput, error } = this.state;

    if (event.target.id === 'log' || event.target.id === 'ln' || event.target.id === 'pi') {
      this.setState({
        operation: event.target.id,
        left: display > 0 ? display : left,
        right: null,
        callApi: error === '',
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
          operation: event.target.id,
          display: event.target.innerHTML,
        });
      }
      if (operation !== '') {
        this.setState({
          callApi: error === '',
        });
      }
    }

    this.setState({
      isLastActionOp: true,
      operation: event.target.innerHTML.includes('=') ? operation : event.target.id,
      lastOpWasEquals: event.target.innerHTML === '=',
    });
  }

  callMathApi(operator, param1, param2) {
    const { left } = this.state;
    fetch(`https://arcane-beyond-77883.herokuapp.com/${operator}?op1=${param1}&op2=${param2}`)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            display:
              typeof result.result !== 'number' ? `Api Error (${result.result})` : result.result,
            left: typeof result.result !== 'number' ? left : result.result,
            isDisplayInput: false,
            callApi: false,
            error: typeof result.result !== 'number' ? result.result : '',
          });
        },
        error => {
          this.setState({
            isDisplayInput: false,
            callApi: false,
            display: error,
            error,
          });
        }
      );
  }

  render() {
    const { display } = this.state;

    const rowOneButtons = buttonRow1.map(b => (
      <button
        id={b.id}
        className={`${b.isNumber ? 'number' : ''} ${b.cssClass}`}
        key={b.text}
        text={b.text}
        disabled={b.disabled}
        type="button"
        onClick={b.functionButton ? this.handleOpClick : this.handleInputClick}
      >
        {b.text}
      </button>
    ));

    const rowTwoButtons = buttonRow2.map(b => (
      <button
        id={b.id}
        className={`${b.isNumber ? 'number' : ''} ${b.cssClass}`}
        key={b.text}
        text={b.text}
        type="button"
        onClick={b.functionButton ? this.handleOpClick : this.handleInputClick}
        dangerouslySetInnerHTML={{ __html: b.text }}
      />
    ));

    const rowThreeButtons = buttonRow3.map(b => (
      <button
        id={b.id}
        className={`${b.isNumber ? 'number' : ''} ${b.cssClass}`}
        key={b.text}
        text={b.text}
        type="button"
        onClick={b.functionButton ? this.handleOpClick : this.handleInputClick}
        dangerouslySetInnerHTML={{ __html: b.text }}
      />
    ));

    const rowFourButtons = buttonRow4.map(b => (
      <button
        id={b.id}
        className={`${b.isNumber ? 'number' : ''} ${b.cssClass}`}
        key={b.text}
        text={b.text}
        type="button"
        onClick={b.functionButton ? this.handleOpClick : this.handleInputClick}
      >
        {b.text}
      </button>
    ));

    const rowFiveButtons = buttonRow5.map(b => (
      <button
        id={b.id}
        className={`${b.isNumber ? 'number' : ''} ${b.cssClass}`}
        key={b.text}
        text={b.text}
        type="button"
        onClick={b.functionButton ? this.handleOpClick : this.handleInputClick}
      >
        {b.text}
      </button>
    ));

    return (
      <div className="container">
        <div className="calculator">
          <Display display={display} />
          <div className="buttonRow">{rowOneButtons}</div>
          <div className="buttonRow">{rowTwoButtons}</div>
          <div className="buttonRow">{rowThreeButtons}</div>
          <div className="buttonRow">{rowFourButtons}</div>
          <div className="buttonRow">{rowFiveButtons}</div>
        </div>
      </div>
    );
  }
}

export default App;
