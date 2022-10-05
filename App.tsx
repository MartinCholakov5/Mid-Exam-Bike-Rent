import React from 'react';

const Periods = [
  {
    price_per_day: 2, from: "2020-01-01 ", to: "2020-01-04", added: "2020-06-01"
  },
  {
    price_per_day: 60, from: "2020-01-03", to: "2020-01-08", added: "2020-06-02"
  },
  {
    price_per_day: 15, from: "2020-01-05", to: "2020-01-06", added: "2020-06-01"
  },
  {
    price_per_day: 150, from: "2020-01-08", to: "2020-01-15", added: "2020-06-15"
  }
];

const DefaultPrice = 5;

interface IState {
  periodBegin: string;
  periodEnd: string;
  showResult: boolean;
  result: number;
}

class App extends React.Component<{}, IState> {

  state = {
    periodBegin: '',
    periodEnd: '',
    showResult: false,
    result: 0
  };

  App() {

  }

  getDaysOfMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  }

  addDay(date: Date): Date {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let maxDaysOfMonth = this.getDaysOfMonth(date);

    day++;

    if (day > maxDaysOfMonth) {
      day = 1;
      month++;

      if (month > 11) {
        month = 0;
        year++;
      }
    }

    return new Date(year, month, day);
  }

  areDatesEqual(date1: Date, date2: Date): boolean {
    return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
  }

  isBeforeOrEqueal(date1: Date, date2: Date): boolean {
    if (date1.getFullYear() < date2.getFullYear()) {
      return true;
    }
    else if (date1.getFullYear() > date2.getFullYear()) {
      return false;
    }
    else {
      if (date1.getMonth() < date2.getMonth()) {
        return true;
      }
      else if (date1.getMonth() > date2.getMonth()) {
        return false;
      }
      else {
        return date1.getDate() <= date2.getDate();
      }
    }
  }

  isAfterOrEqueal(date1: Date, date2: Date): boolean {
    if (date1.getFullYear() > date2.getFullYear()) {
      return true;
    }
    else if (date1.getFullYear() < date2.getFullYear()) {
      return false;
    }
    else {
      if (date1.getMonth() > date2.getMonth()) {
        return true;
      }
      else if (date1.getMonth() < date2.getMonth()) {
        return false;
      }
      else {
        return date1.getDate() >= date2.getDate();
      }
    }
  }

  getPriceForDate(date: Date): number {
    let result = DefaultPrice;
    let lastPeriodAdded = new Date('2000-01-01');

    for (let i = 0; i < Periods.length; i++) {
      let from = new Date(Periods[i].from);
      let to = new Date(Periods[i].to);
      let added = new Date(Periods[i].added);
      let price = Periods[i].price_per_day;

      if (this.isAfterOrEqueal(date, from) && this.isBeforeOrEqueal(date, to)) {
        if (this.isAfterOrEqueal(added, lastPeriodAdded)) {
          result = price;
          lastPeriodAdded = added;
        }
      }
    }

    return result;
  }

  calculate() {
    let begin = new Date(this.state.periodBegin);
    let end = new Date(this.state.periodEnd);

    let result = 0;

    while (this.isBeforeOrEqueal(begin, end)) {
      result += this.getPriceForDate(begin);

      begin = this.addDay(begin);
    }

    this.setState({
      showResult: true,
      result: result
    });
  }

  onBeginInputChange(handler: any) {
    this.setState({
      periodBegin: handler.target.value
    });
  }

  onEndInputChange(handler: any) {
    this.setState({
      periodEnd: handler.target.value
    });
  }

  render() {
    return (
      <>
        <h1>Rent bikes</h1>
        <table className='main-table'>
          <tr>
            <th>Price per day</th>
            <th>From</th>
            <th>To</th>
            <th>Added</th>
          </tr>
          {
            Periods.map((item, index) =>
              <tr key={index}>
                <td>{item.price_per_day}</td>
                <td>{item.from}</td>
                <td>{item.to}</td>
                <td>{item.added}</td>
              </tr>
            )
          }
        </table>

        <form className='main-form'>
          <div className='input-group'>
            <label>Start period</label>
            <input type='text' value={this.state.periodBegin} onChange={this.onBeginInputChange.bind(this)} />
          </div>

          <div className='input-group'>
            <label>End period</label>
            <input type='text' value={this.state.periodEnd} onChange={this.onEndInputChange.bind(this)} />
          </div>

          <button type='button' onClick={this.calculate.bind(this)}>Calculate</button>
        </form>

        {this.state.showResult &&
          <span>Result : {this.state.result}</span>
        }

      </>)
  }
}

export default App;