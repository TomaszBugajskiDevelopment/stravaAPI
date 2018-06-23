import React from "react";
import ChartistGraph from 'react-chartist';

export class Activities extends React.Component {
    state = {
        activities: [],
    };

    componentDidMount(){
        $.get('http://localhost:8000/activities').then((res) => this.setState({ activities: res }));
    }

    formatDate = (d) => {
        let month = d.getMonth();
        let day = d.getDate().toString();
        let year = d.getFullYear();
        year = year.toString().substr(-2);
        month = (month + 1).toString();

        if (month.length === 1) {
            month = "0" + month;
        }
        if (day.length === 1) {
            day = "0" + day;
        }
        return month + '/' + day + '/' + year;
    };

    render() {
        console.log(this.state.activities);

        const distArr = [];
        const dateArr = [];

        for (let i = 0, len = this.state.activities.length; i < len; i++) {
            if (this.state.activities[i].type === "Run") {
                distArr.push((this.state.activities[i].distance / 1000).toFixed(2));
                let dateFormat = new Date(this.state.activities[i].start_date);
                let output = this.formatDate(dateFormat);
                dateArr.push(output);
            }
        }

        const data = {
            labels: dateArr,
            series: [distArr]
        };
        const options = {
            seriesBarDistance: 0,
        };

        const type='Bar';

        // let seq = 0,
        //     delays = 80,
        //     durations = 500;
        // chart.on('created', function () {
        //     seq = 0;
        // });
        // chart.on('draw', function (data) {
        //     seq++;
        //     if (data.type === 'bar') {
        //         data.element.animate({
        //             opacity: {
        //                 // The delay when we like to start the animation
        //                 begin: seq * delays + 1000,
        //                 // Duration of the animation
        //                 dur: durations,
        //                 // The value where the animation should start
        //                 from: 0,
        //                 // The value where it should end
        //                 to: 1
        //             }
        //         });
        //     } else if (data.type === 'grid') {
        //         // Using data.axis we get x or y which we can use to construct our animation definition objects
        //         let pos1Animation = {
        //             begin: seq * delays,
        //             dur: durations,
        //             from: data[data.axis.units.pos + '1'] - 30,
        //             to: data[data.axis.units.pos + '1'],
        //             easing: 'easeOutQuart'
        //         };
        //         let pos2Animation = {
        //             begin: seq * delays,
        //             dur: durations,
        //             from: data[data.axis.units.pos + '2'] - 100,
        //             to: data[data.axis.units.pos + '2'],
        //             easing: 'easeOutQuart'
        //         };
        //         let animations = {};
        //         animations[data.axis.units.pos + '1'] = pos1Animation;
        //         animations[data.axis.units.pos + '2'] = pos2Animation;
        //         animations['opacity'] = {
        //             begin: seq * delays,
        //             dur: durations,
        //             from: 0,
        //             to: 1,
        //             easing: 'easeOutQuart'
        //         };
        //         data.element.animate(animations);
        //     }
        // });

        return (
            <div>
                <h3>Activities</h3>
                <div><ChartistGraph
                    data={data}
                    options={options}
                    type={type}
                    listener={{"draw" : function(data) { if(data.type === 'bar') {
                            data.element.animate({
                                y2: {
                                    begin: 0,
                                    dur: 500,
                                    from: data.y1,
                                    to: data.y2,
                                    easing: Chartist.Svg.Easing.easeOutSine,
                                }});
                        }}}}
                /> </div>
            </div>
        );
    }
}


