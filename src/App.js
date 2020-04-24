import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css';
import { Button } from '@progress/kendo-react-buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { savePDF } from '@progress/kendo-react-pdf';
import { Ripple } from '@progress/kendo-react-ripple';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input } from '@progress/kendo-react-inputs';
import DonutChartContainer from './components/charts/doughnut.chart';
import LineChartContainer from './components/charts/line.chart';
import 'bootstrap-4-grid/css/grid.min.css';
import '@progress/kendo-theme-material/dist/all.css';
import './App.css';
import CardContainer from './components/card/card';
import EnhancedTable from './components/data-table/data-table-container';


const columns = [
  {
    Header: 'Country',
    accessor: 'country',
  },
  {
    Header: 'Cases',
    accessor: 'cases',
  },
  {
    Header: 'Tests',
    accessor: 'tests',
  },
  {
    Header: 'Today Cases',
    accessor: 'todayCases',
  },
  {
    Header: 'Today Deaths',
    accessor: 'todayDeaths',
  },
  {
    Header: 'Active Cases',
    accessor: 'active',
  },
  {
    Header: 'Critical Cases',
    accessor: 'critical',
  },
  {
    Header: 'Last Updated',
    accessor: 'updated',
  },
];

// const rows = [
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Donut', 452, 25.0, 51, 4.9),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
//   createData('Honeycomb', 408, 3.2, 87, 6.5),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Jelly Bean', 375, 0.0, 94, 0.0),
//   createData('KitKat', 518, 26.0, 65, 7.0),
//   createData('Lollipop', 392, 0.2, 98, 0.0),
//   createData('Marshmallow', 318, 0, 81, 2.0),
//   createData('Nougat', 360, 19.0, 9, 37.0),
//   createData('Oreo', 437, 18.0, 63, 4.0),
// ];
const headCells = [
  {
    id: 'country',
    numeric: false,
    disablePadding: false,
    label: 'Country',
  },
  { id: 'tests', numeric: true, disablePadding: false, label: 'Total Tests' },
  { id: 'todayCases', numeric: true, disablePadding: false, label: "Today's Cases" },
  { id: 'todayDeaths', numeric: true, disablePadding: false, label: "Today's Deaths" },
  { id: 'active', numeric: true, disablePadding: false, label: 'Active Cases' },
  { id: 'critical', numeric: true, disablePadding: false, label: 'Critical Cases' }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.appContainer = React.createRef();
    this.state = {
      showDialog: false,
      donutChartData: {},
      lineChartData: {},
      summaryData: undefined,
      countryData: [],
      filterCountries: [],
      transformedCountries: [],
      selectedCountry: 'USA',
      rows: [],
    };
  }

  handlePDFExport = () => {
    savePDF(ReactDOM.findDOMNode(this.appContainer), { paperSize: 'auto' });
  };

  handleShare = () => {
    this.setState(
      {
        showDialog: !this.state.showDialog,
      },
      () => console.log(this.state)
    );
  };

  componentDidMount() {
    this.getDonughtChartData();
    this.getAllData();
    this.getContryData();
    // this.transformToSelectOption();
  }

  getDonughtChartData = async () => {
    try {
      const response = await axios.get(
        'https://corona.lmao.ninja/v2/continents'
      );
      this.setState((prevState) => ({
        donutChartData: {
          labels: response.data.map((d) => d.continent),
          datasets: [
            {
              label: 'Total continental Cases',
              data: response.data.map((v) => v.cases),
              backgroundColor: [
                'rgba(255, 99, 132, 0.9)',
                'rgba(54, 162, 235, 0.9)',
                'rgba(255, 206, 86, 0.9)',
                'rgba(75, 192, 192, 0.9)',
                'rgba(153, 102, 255, 0.9)',
                'rgba(255, 159, 64, 0.9)',
              ],
            },
          ],
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  getAllData = async () => {
    try {
      const response = await axios.get('https://corona.lmao.ninja/v2/all');
      this.setState((prevState) => ({
        summaryData: response.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  createData = (country, tests, todayCases, todayDeaths, active, critical) => {
    return { country, tests, todayCases, todayDeaths, active, critical };
  };

  getContryData = async () => {
    try {
      const response = await axios.get(
        'https://corona.lmao.ninja/v2/countries?sort=cases'
      );

      console.log(response.data);

      this.setState(() => ({
        countryData: response.data,
        transformedCountries: response.data.map((country) => ({
          name: country.country,
          value: country.country,
        })),
        lineChartData: {
          labels: response.data.map((d) => d.country),
          datasets: [
            {
              label: 'Countries Active Cases',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              height: 3,
              data: response.data.map((d) => d.active),
            },
          ],
        },
        filterCountries: response.data,
        rows: response.data.map((v) =>
          this.createData(
            v.country,
            v.tests,
            v.todayCases,
            v.todayDeaths,
            v.active,
            v.critical
          )
        ),
      }));
      console.log(this.state.transformedCountries);
    } catch (error) {
      console.error(error);
    }
  };

  getSingleContryData = async (country) => {
    try {
      const response = await axios.get(
        `https://corona.lmao.ninja/v2/countries/${country}?yesterday=true`
      );

      console.log(response.data);
      const data = [response.data]

      this.setState((prevState) => ({
        countryData: data,
        rows: data.map((v) =>
          this.createData(
            v.country,
            v.tests,
            v.todayCases,
            v.todayDeaths,
            v.active,
            v.critical
          )
        ),
      }));
      console.log(this.state.transformedCountries);
    } catch (error) {
      console.error(error);
    }
  };

  updateCountry = (value) => {
    if (value) {
      this.getSingleContryData(value);
      this.setState({
        selectedCountry: value,
      });
    } else {
      this.getContryData();
    }
  };

  handleClear = () => {
    this.getContryData();
  }

  render() {
    return (
      <Ripple>
        <div
          className="app-container container-fluid"
          ref={(el) => (this.appContainer = el)}
        >
          <div className="row">
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              <h1>Covid-19 | Dashboard</h1>
            </div>
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 d-flex justify-content-center align-items-center">
              <SelectSearch
                key="countries"
                options={this.state.transformedCountries}
                defaultValue={this.state.selectedCountry}
                onChange={this.updateCountry}
                name="countries"
                search
                placeholder="Select a country"
              />
              <span className="cancel-button p-auto" onClick={this.handleClear}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </span>
            </div>
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 buttons-right">
              <Button primary={true} onClick={this.handleShare}>
                Share
              </Button>
              <Button onClick={this.handlePDFExport}>Export to PDF</Button>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 px-1">
              <CardContainer
                summaryData={this.state.summaryData}
                title={'World Wide Confirmed Cases'}
                totalCases={true}
              />
              <CardContainer
                countryData={this.state.countryData}
                title={'Confirmed Cases by Country'}
                totalCases={true}
              />
            </div>
            <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 p-1">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <LineChartContainer data={this.state.lineChartData} />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <EnhancedTable
                    rows={this.state.rows}
                    headCells={headCells}
                    columns={columns}
                    data={this.state.countryData}
                  />
                </div>
              </div>
            </div>
            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 pl-1">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pr-0">
                  <CardContainer
                    summaryData={this.state.summaryData}
                    countryData={this.state.countryData}
                    title={'Total Deaths'}
                    totalDeaths={true}
                  />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pl-1">
                  <CardContainer
                    countryData={this.state.countryData}
                    summaryData={this.state.summaryData}
                    title={'Total Recovered'}
                    totalRecovered={true}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <DonutChartContainer data={this.state.donutChartData} />
                </div>
              </div>
            </div>
          </div>
          {this.state.showDialog && (
            <Dialog title={'Share this report'} onClose={this.handleShare}>
              <p>Please enter the email address/es of the recipient/s.</p>
              <Input placeholder="example@progress.com" />
              <DialogActionsBar>
                <Button primary={true} onClick={this.handleShare}>
                  Share
                </Button>
                <Button onClick={this.handleShare}>Cancel</Button>
              </DialogActionsBar>
            </Dialog>
          )}
        </div>
      </Ripple>
    );
  }
}

export default App;