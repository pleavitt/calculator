import React, { Component } from 'react';
import { buttonRow1, buttonRow2, buttonRow3, buttonRow4, buttonRow5 } from './buttons';

import './App.css';

const Display = props => (
  <div className="lcd">
    <div className="result">{props.display}</div>
    <div className="errors">
      {props.errors}
      {props.isLoading && <div className="spinner" />}
    </div>
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
      operationButtonPressedLast: false,
      isDisplayUserInput: true,
      callApi: false,
      lastOperationEquals: false,
      errorMessage: '',
    };

    this.handleNumberButtonClick = this.handleNumberButtonClick.bind(this);
    this.handleOperationClick = this.handleOperationClick.bind(this);
  }

  componentDidUpdate() {
    const { operation, left, right, callApi } = this.state;

    if (callApi && operation !== '') {
      this.callMathApi(operation, left, right);
    }
  }

  wipeData() {
    this.setState({
      display: 0,
      operation: '',
      nextOperation: '',
      left: null,
      right: null,
      operationButtonPressedLast: false,
      isDisplayUserInput: true,
      callApi: false,
      errorMessage: '',
    });
  }

  handleNumberButtonClick(event) {
    const {
      display,
      operationButtonPressedLast,
      isDisplayUserInput,
      lastOperationEquals,
      errorMessage,
      callApi,
    } = this.state;

    if (callApi) {
      return;
    }

    // if errorMessage, api result and equals pressed, clear button then clear everything
    if (
      (!isDisplayUserInput && lastOperationEquals) ||
      event.target.id === 'clear' ||
      errorMessage !== ''
    ) {
      console.log('wipe now');
      this.wipeData();
      if (!isDisplayUserInput && lastOperationEquals) {
        this.setState({
          display: event.target.innerHTML,
        });
      }
      // if last is not a decimal or button pressed is not a decimal AND its not the clear command
    } else if (
      (display[display.length - 1] !== '.' || event.target.innerHTML !== '.') &&
      event.target.id !== 'clear' &&
      event.target.id !== 'backspace' &&
      event.target.id !== 'negate'
    ) {
      this.setState({
        display:
          (display > 0 || display[display.length - 1] === '.') && !operationButtonPressedLast
            ? display + event.target.innerHTML
            : event.target.innerHTML,
        operationButtonPressedLast: false,
        isDisplayUserInput: true,
      });
    } else if (
      (event.target.id === 'negate' || event.target.id === 'backspace') &&
      display !== 0 &&
      display[display.length - 1] !== '.'
    ) {
      if (event.target.id === 'negate') {
        this.setState({
          display: display * -1,
          operationButtonPressedLast: false,
          isDisplayUserInput: true,
        });
      } else if (
        event.target.id === 'backspace' &&
        !operationButtonPressedLast &&
        isDisplayUserInput
      ) {
        this.setState({
          display: display.length === 1 ? 0 : display.slice(0, -1),
          operationButtonPressedLast: false,
          isDisplayUserInput: true,
        });
      }
    }
  }

  handleOperationClick(event) {
    const {
      operation,
      left,
      right,
      display,
      operationButtonPressedLast,
      isDisplayUserInput,
      errorMessage,
      nextOperation,
      callApi,
    } = this.state;

    if (callApi) {
      return;
    }

    if (event.target.id === 'pi') {
      this.setState({
        callApi: true,
        operation: event.target.id,
        left: null,
        right: null,
      });
    } else if (event.target.id === 'log10' || event.target.id === 'square_root') {
      this.setState({
        operation: event.target.id,
        left: display > 0 ? display : 0,
        right: null,
        callApi: errorMessage === '',
      });
    } else if (!operationButtonPressedLast || (event.target.innerHTML === '=' && right !== null)) {
      if (left === null || !isDisplayUserInput) {
        this.setState({
          left: display,
          callApi: false,
        });
      } else if (!operationButtonPressedLast) {
        this.setState({
          right: display,
        });
      }

      if (event.target.innerHTML !== '=') {
        this.setState({
          operation: operation === '' ? event.target.id : operation,
          display: event.target.innerHTML,
        });
      }
      if (operation !== '') {
        this.setState({
          callApi: errorMessage === '',
        });
      }
    }

    this.setState({
      operationButtonPressedLast: !['=', 'log', '√'].includes(event.target.innerHTML),
      nextOperation: operation !== '' ? event.target.id : nextOperation,
      lastOperationEquals: ['=', 'log', '√'].includes(event.target.innerHTML),
    });
  }

  callMathApi() {
    const { left, operation, right, nextOperation } = this.state;
    console.log('fetching now');
    fetch(`https://arcane-beyond-77883.herokuapp.com/${operation}?op1=${left}&op2=${right}`)
      .then(res => res.json())
      .then(
        result => {
          if (typeof result.result === 'number') {
            this.setState({
              display: result.result,
              left: result.result,
              isDisplayUserInput: false,
              callApi: false,
              operation: nextOperation !== 'equals' ? nextOperation : '',
              nextOperation: '',
            });
          } else {
            this.wipeData();
            this.setState({
              errorMessage: `Api error (${result.result})`,
              operation: nextOperation !== 'equals' ? nextOperation : '',
            });
          }
        },
        error => {
          this.wipeData();
          this.setState({
            errorMessage: error.message,
          });
        }
      );
  }

  render() {
    const { display, errorMessage, callApi } = this.state;

    const rowOneButtons = buttonRow1.map(b => (
      <button
        id={b.id}
        className={`${b.isNumber ? 'number' : ''} ${b.cssClass}`}
        key={b.text}
        text={b.text}
        disabled={b.disabled}
        type="button"
        onClick={b.functionButton ? this.handleOperationClick : this.handleNumberButtonClick}
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
        onClick={b.functionButton ? this.handleOperationClick : this.handleNumberButtonClick}
      >
        {b.text}
      </button>
    ));

    const rowThreeButtons = buttonRow3.map(b => (
      <button
        id={b.id}
        className={`${b.isNumber ? 'number' : ''} ${b.cssClass}`}
        key={b.text}
        text={b.text}
        type="button"
        onClick={b.functionButton ? this.handleOperationClick : this.handleNumberButtonClick}
      >
        {b.text}
      </button>
    ));

    const rowFourButtons = buttonRow4.map(b => (
      <button
        id={b.id}
        className={`${b.isNumber ? 'number' : ''} ${b.cssClass}`}
        key={b.text}
        text={b.text}
        type="button"
        onClick={b.functionButton ? this.handleOperationClick : this.handleNumberButtonClick}
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
        onClick={b.functionButton ? this.handleOperationClick : this.handleNumberButtonClick}
      >
        {b.text}
      </button>
    ));

    return (
      <div className="container">
        <div className="calculator">
          <Display display={display} errors={errorMessage} isLoading={callApi} />
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
