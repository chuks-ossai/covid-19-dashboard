import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';

const DonutChartContainer = ({ data }) => (
  <Card className="m-1 p-0">
    <Card.Body className="p-0">
      <div>
        <Doughnut data={data} width={250} height={250} />
      </div>
    </Card.Body>
  </Card>
);

export default DonutChartContainer;