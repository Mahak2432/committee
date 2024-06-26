import React, { Component } from 'react'
import NepaliDate from 'nepali-date-converter'

export default class Expense extends Component {
  render() {
    var i = 0
    return (
      <div className='innerIncome'>
        <p>{this.props.i}</p>
        <p>
          {new NepaliDate(new Date(this.props.createdAt)).format('YYYY-MM-DD')}
        </p>
        <p>
          Total Salary paid Rs {this.props.salaryAmount} to{' '}
          {this.props.chairperson_name
            ? this.props.chairperson_name
            : this.props.hod_name}
        </p>
      </div>
    )
  }
}
