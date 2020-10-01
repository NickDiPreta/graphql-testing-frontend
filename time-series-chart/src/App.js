import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { Subscription } from "react-apollo";
import gql from "graphql-tag";
import moment from "moment";

const TWENTY_MIN_STATUS_SUBSCRIPTION = gql`
 subscription {
  last_24_hr_status {
    five_sec_interval
    status
  }
}
`;

// subscription {
//   last_20_min_status(order_by: { five_sec_interval: asc }) {
//     five_sec_interval
//     status
//   }
// }

// subscription {
//   status(order_by: { recorded_at: asc }) {
//     recorded_at
//     status
//   }
// }


class App extends Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "20px",
        }}
      >
        <Subscription subscription={TWENTY_MIN_STATUS_SUBSCRIPTION}>
          {({ data, error, loading }) => {
            if (error) {
              console.error(error);
              return "Error";
            }
            if (loading) {
              return "Loading";
            }
            let chartJSData = {
              labels: [],
              datasets: [
                {
                  label: "Server check every five seconds",
                  data: [],
                  pointBackgroundColor: [],
                  borderColor: "brown",
                  fill: false,
                },
              ],
            };
            console.log(data);
            data.last_24_hr_status.forEach((item) => {
              const humanReadableTime = moment(item.five_sec_interval).format(
                "LTS"
              );
              chartJSData.labels.push(humanReadableTime);
              chartJSData.datasets[0].data.push(item.status);
              chartJSData.datasets[0].pointBackgroundColor.push("brown");
            });
            return (
              <Line
                data={chartJSData}
                options={{
                  animation: { duration: 0 },
                  scales: { yAxes: [{ ticks: { min: 0, max: 1000 } }] },
                }}
              />
            );
          }}
        </Subscription>
      </div>
    );
  }
}

export default App;
