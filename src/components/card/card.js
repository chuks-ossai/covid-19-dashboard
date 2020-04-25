import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { Button } from '@progress/kendo-react-buttons';
import './card.css';

const CardContainer = ({
  summaryData,
  countryData,
  title,
  handleButtonClick,
  totalCases,
  totalDeaths,
  totalRecovered
}) => (
  <Card className="my-2">
    <Card.Body className="p-2">
      {title && (
        <Card.Subtitle className="text-center mb-1">{title}</Card.Subtitle>
      )}
      {summaryData && totalCases && (
        <div>
          <h2 className="text-center text-danger">
            {summaryData.cases.toLocaleString('en')}
          </h2>
        </div>
      )}
      {summaryData && totalDeaths && (
        <div>
          <h2 className="text-center text-danger">
            {summaryData.deaths.toLocaleString('en')}
          </h2>
        </div>
      )}
      {summaryData && totalRecovered && (
        <div>
          <h2 className="text-center text-success">
            {summaryData.recovered.toLocaleString('en')}
          </h2>
        </div>
      )}

      {countryData && totalCases && (
        <div className="listgroup-container">
          <ListGroup variant="flush">
            {countryData.map((item) => (
              <ListGroup.Item key={item.country} className="p-0">
                <div className="row">
                  <div className="col-7 font-weight-bold text-danger text-right">
                    {item.cases.toLocaleString('en')}
                  </div>
                  <div className="col-5">{item.countryInfo.iso3}</div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      {countryData && totalDeaths && (
        <div className="listgroup-container">
          <ListGroup variant="flush">
            {countryData.map((item) => (
              <ListGroup.Item key={item.country}>
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0">
                    <span className=" font-weight-bold text-danger">
                      {item.deaths.toLocaleString('en')}
                    </span>{' '}
                    deaths in
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 p-0 col-xl-12">
                    {item.country}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      {countryData && totalRecovered && (
        <div className="listgroup-container">
          <ListGroup variant="flush">
            {countryData.map((item) => (
              <ListGroup.Item key={item.country}>
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0">
                    <span className=" font-weight-bold text-success">
                      {item.recovered.toLocaleString('en')}
                    </span>{' '}
                    Recovered in
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 p-0">
                    {item.country}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
      {handleButtonClick && (
        <Button variant="primary" onClick={handleButtonClick}>
          Go somewhere
        </Button>
      )}
    </Card.Body>
  </Card>
);

export default CardContainer