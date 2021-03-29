import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import './salesgraph.css'
import {Paper} from "@material-ui/core";


const data = [
  {
    name: 'Jan', sales: 4000
  },
  {
    name: 'Feb', sales: 3000
  },
  {
    name: 'Mar', sales: 2000
  },
  {
    name: 'Apr', sales: 2780
  },
  {
    name: 'May', sales: 1890
  },
  {
    name: 'Jun', sales: 2390
  },
  {
    name: 'Jul', sales: 3490
  },
  {
    name: 'Aug', sales: 2490
  },
  {
    name: 'Sep', sales: 5490
  },
  {
    name: 'Oct', sales: 1490
  },
  {
    name: 'Nov', sales: 2490
  },
  {
    name: 'Dec', sales: 3090
  },
];

class SalesGraph extends PureComponent {

  render() {
    return (
        <ResponsiveContainer width="90%" height={300}>
            <BarChart 
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
        margin={{
          top: 50, right: 50, left: 50, bottom: 50,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#8884d8" />
      </BarChart>
        </ResponsiveContainer>
    );
  }
}

export default SalesGraph;