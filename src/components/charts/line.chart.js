import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';

const LineChartContainer = ({ data }) => (
  <Card className="m-1 p-0">
    <Card.Body className="p-0">
      <div>
        <Line data={data} />
      </div>
    </Card.Body>
  </Card>
);

export default LineChartContainer;
