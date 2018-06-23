import React from "react";
import ChartistGraph from 'react-chartist';

export class Stats extends React.Component {
    state = {
        stats: [],
        statsFetched: false
    };



    componentDidMount(){
        $.get('http://localhost:8000/stats').then((res) => this.setState({ stats: res, statsFetched: true }));
    }

    render() {

        const all_rides = ((this.state.stats || {}).all_ride_totals || {}).count;
        const all_runs = ((this.state.stats || {}).all_run_totals || {}).count;
        const all_swims = ((this.state.stats || {}).all_swim_totals || {}).count;
        const total = (all_runs + all_swims + all_rides) / 100;

        const data = {
            labels: ['Runs ' + Math.round(all_runs / total) + '%', 'Swims ' + Math.round(all_swims / total) + '%', 'Rides ' + Math.round(all_rides / total) + '%'],
            series: [all_runs, all_swims, all_rides]
        };

        const options = {
            labelInterpolationFnc: function (value) {
                return value[0]
            }
        };

        const responsiveOptions = [
            ['screen and (min-width: 640px)', {
                chartPadding: 30,
                labelOffset: 100,
                labelDirection: 'explode',
                labelInterpolationFnc: function (value) {
                    return value;
                }
            }],
            ['screen and (min-width: 1024px)', {
                labelOffset: 80,
                chartPadding: 20
            }]
        ];

        const type='Pie';

        let chart;

        if (this.state.statsFetched) {
            chart = <ChartistGraph
                data={data}
                options={options}
                responsiveOptions={responsiveOptions}
                type={type}
            />;
        }

        return (
            <div>
                <h3>Stats</h3>
                <div>
                    {chart}
                </div>
            </div>
        );
    }
}
