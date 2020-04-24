import React, { Component } from 'react';

export default class Filter extends Component {
  state = {
    filterValue: '',
  };

  handleChange = (e) => {
    let filterValue = e.target.value;
    this.setState(() => ({ filterValue }));
    this.props.inputChange(e.target.value);
  };

  render() {
    return (
      <div>
        <input
          type="text"
          id="filter"
          value={this.state.filterValue}
          onChange={this.handleChange}
          placeholder="Search by Country"
        />
      </div>
    );
  }
}
