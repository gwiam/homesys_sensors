import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';

class AppEventChart extends Component{
	
	constructor(props){
		super(props);
		this.state = {
			dbRaw: [],
			chartPoints: [],
			chartOptions: {
				responsive: true,
				title:      {
					display: true,
					text:    "Environmental measurements"
				},
				scales:     {
					xAxes: [{
						type:       "time",
						scaleLabel: {
							display:     true,
							labelString: 'Time'
						}
					}],
					yAxes: [{
						id: 'left-y',
						type: "linear",
						ticks: {
							min: 10,
							max: 30
						},
						scaleLabel: {
							display:     true,
							labelString: 'Temp in °C'
						},
						position: 'left'
					},
					{
						id: 'right-y',
						type: "linear",
						ticks: {
							min: 30,
							max: 60
						},
						scaleLabel: {
							display:     true,
							labelString: 'Humidity in %'
						},
						position: 'right'
					}]
				}
			},
			chartData: [],
			isLoaded: false
		}
	}
	componentDidMount(){
		fetch('./events').then(response => response.json()).then(data => {
			// new array
			var formattedHumArray = [];
			var formattedTmpArray = data.map(item => {
					formattedHumArray.push({
						x: new Date(item.timestamp),
						y: parseInt(item.data[1], 10)
					});
					return {
						x: new Date(item.timestamp),
						y: parseInt(item.data[0], 10)
					}
			});


			this.setState({
				dbRaw: data,
				chartPoints : formattedTmpArray,
				isLoaded : true,
				chartData: {
					datasets:[
						{
							label: "Air humidity",
							fill: false,
							lineTension: 0.1,
							backgroundColor: 'rgba(140, 54, 5,0.4)',
							borderColor: 'rgba(140, 54, 5, 1)',
							borderCapStyle: 'butt',
							borderDash: [],
							borderDashOffset: 0.0,
							borderJoinStyle: 'miter',
							pointBorderColor: 'rgba(140, 54, 5,1)',
							pointBackgroundColor: '#fff',
							pointBorderWidth: 2,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: 'rgba(140, 54, 5,1)',
							pointHoverBorderColor: 'rgba(220,220,220,1)',
							pointHoverBorderWidth: 3,
							pointRadius: 3,
							pointHitRadius: 10,
							data: formattedHumArray,
							yAxisID: 'right-y'
						},
						{
							label: "Temperature",
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
							pointBorderWidth: 2,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: 'rgba(75,192,192,1)',
							pointHoverBorderColor: 'rgba(220,220,220,1)',
							pointHoverBorderWidth: 3,
							pointRadius: 3,
							pointHitRadius: 10,
							data: formattedTmpArray,
							yAxisID: 'left-y'
						}
					]
				}
			});
		});
	}
	render(){
		// IMPORTANT: redraw mechanism
		return (
			<div>
				
				<Line data={this.state.chartData} options={this.state.chartOptions} redraw/>
			</div>
		);
	}
}

export default AppEventChart;