import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css';
import { Button } from '@progress/kendo-react-buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { savePDF } from '@progress/kendo-react-pdf';
import { Ripple } from '@progress/kendo-react-ripple';
import { Dialog } from '@progress/kendo-react-dialogs';
import DonutChartContainer from './components/charts/doughnut.chart';
import LineChartContainer from './components/charts/line.chart';
import 'bootstrap-4-grid/css/grid.min.css';
import '@progress/kendo-theme-material/dist/all.css';
import './App.css';
import CardContainer from './components/card/card';
import EnhancedTable from './components/data-table/data-table-container';
import ShimmerLoader from './components/shimmer-loader';
import { Card } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';


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
      countryData: undefined,
      filterCountries: [],
      transformedCountries: [],
      selectedCountry: 'USA',
      rows: [],
      loading: true
    };
  }

  handlePDFExport = () => {
    savePDF(ReactDOM.findDOMNode(this.appContainer), { paperSize: 'auto' });
  };

  handleShare = () => {
    this.setState(
      {
        showDialog: !this.state.showDialog,
      }
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
      this.setState(() => ({
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
        loading: false
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
        loading: !prevState.loading
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
    } catch (error) {
      console.error(error);
    }
  };

  getSingleContryData = async (country) => {
    try {
      const response = await axios.get(
        `https://corona.lmao.ninja/v2/countries/${country}?yesterday=true`
      );
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
    } catch (error) {
      console.error(error);
    }
  };

  updateCountry = (value) => {
    if (value) {
      this.getSingleContryData(value);
      this.setState(prevState => ({
        selectedCountry: value,
        showDialog: !prevState.showDialog
      }))
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
              <h2>Covid-19 | Dashboard</h2>
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
              <div className="row">
                <div className="col-12">
                  {this.state.summaryData ? (
                    <>
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
                    </>
                  ) : (
                    <ShimmerLoader count={25} />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Card>
                    <CardContent>
                      <>
                        Last Updated: {this.state.summaryData ? (<span className="font-weight-bold">{moment(this.state.summaryData?.updated).format('llll')}</span>) : (<ShimmerLoader count={1} />)}
                      </>
                    </CardContent>
                    <p></p>
                  </Card>
                </div>
              </div>
            </div>
            <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 p-1">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  {this.state.lineChartData.datasets ? (
                    <>
                      <LineChartContainer data={this.state.lineChartData} />
                    </>
                  ) : (
                    <>
                      <ShimmerLoader count={12} />
                    </>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  {this.state.countryData ? (
                    <>
                      <EnhancedTable
                        rows={this.state.rows}
                        headCells={headCells}
                        columns={columns}
                        data={this.state.countryData}
                      />
                    </>
                  ) : (
                    <ShimmerLoader count={12} />
                  )}
                </div>
              </div>
            </div>
            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 pl-1">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 pr-lg-1">
                  {this.state.countryData ? (
                    <CardContainer
                      summaryData={this.state.summaryData}
                      countryData={this.state.countryData}
                      title={'Total Deaths'}
                      totalDeaths={true}
                    />
                  ) : (
                    <ShimmerLoader count={25} />
                  )}
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 pl-lg-1">
                  {this.state.countryData ? (
                    <CardContainer
                      countryData={this.state.countryData}
                      summaryData={this.state.summaryData}
                      title={'Total Recovered'}
                      totalRecovered={true}
                    />
                  ) : (
                    <ShimmerLoader count={25} />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  {this.state.donutChartData.datasets ? (
                    <DonutChartContainer data={this.state.donutChartData} />
                  ) : (
                    <ShimmerLoader circle={true} />
                  )}
                </div>
              </div>
            </div>
          </div>
          {this.state.showDialog && (
            <Dialog title={`${this.state.countryData[0].continent} (${this.state.countryData[0].country})`} onClose={this.handleShare}>
              {this.state.countryData.map(country => (
                <>
                  <p>Tests Carried Out: <span className="font-weight-bold">{country.tests.toLocaleString('en')}</span></p>
                  <div className="row">
                    <div className="col-6">
                      <h6>Cases</h6>
                      <p className="m-1 p-2 bg-warning">Active: <span className="font-weight-bold">{country.active.toLocaleString('en')}</span></p>
                      <p className="m-1 p-2 bg-warning">Critical: <span className="font-weight-bold"></span>{country.critical.toLocaleString('en')}</p>
                      <p className="m-1 p-2 bg-warning">Today: <span className="font-weight-bold">{country.todayCases.toLocaleString('en')}</span></p>
                      <hr />
                      <p className="m-1 p-2 bg-warning">Total: <span className="font-weight-bold">{country.cases.toLocaleString('en')}</span></p>
                    </div>
                    <div className="col-6">
                      <h6>Other Info</h6>
                      <p className="m-1 p-2 bg-danger text-light text-center">Today's Deaths: <span className="font-weight-bold">{country.todayDeaths.toLocaleString('en')}</span></p>
                      <p className="m-1 p-2 bg-danger text-light text-center">Total Deaths: <span className="font-weight-bold">{country.deaths.toLocaleString('en')}</span></p>
                      <p className="m-1 p-2 bg-success text-light">Recovered: <span className="font-weight-bold">{country.recovered.toLocaleString('en')}</span></p>
                    </div>
                  </div>
                  </>
              ))}
            </Dialog>
          )}
        </div>
      </Ripple>
    );
  }
}

export default App;