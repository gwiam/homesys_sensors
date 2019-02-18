import React, { Component } from 'react';
import {Button, ButtonGroup, ButtonDropdown,
		DropdownToggle, DropdownMenu, DropdownItem,
		Container, Row, Col} from 'reactstrap';
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
							min: 15,
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
							min: 20,
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
			limitSelected: 80,
			sortingDropdownOpen: false,
			sortingSelection: 0,
			sortingSelectionNames: ["latest", "earliest today", "earliest"]
		}
		this.toggleSorting = this.toggleSorting.bind(this);
	}

	updateChartFromData(jsonData = null){
		var formattedHumArray = [];
		var formattedTmpArray = [];
		this.postQuery("./events", (jsonData != null) ? jsonData : {
			limit: this.state.limitSelected,
			sortBy: this.state.sortingSelection
		}).then(response => response.json()).then(data => {
			// new array
			formattedTmpArray = data.map(item => {
					formattedHumArray.push({
						x: new Date(item.timestamp),
						y: parseInt(item.data[1], 10)
					});
					return {
						x: new Date(item.timestamp),
						y: parseInt(item.data[0], 10)
					};
			});
			this.setState({
				dbRaw: data,
				chartPoints : formattedTmpArray,
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

	componentDidMount(){
		this.updateChartFromData();	
	}

	postQuery(url, jsonData){
		return fetch(url, {
			method: "POST",
			//mode: "cors", // no-cors, cors, *same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			//credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
				// "Content-Type": "application/x-www-form-urlencoded",
			},
			//redirect: "follow", // manual, *follow, error
			//referrer: "no-referrer", // no-referrer, *client
			body: JSON.stringify(jsonData), // body data type must match "Content-Type" header
		});
	}

	onLimitSelection(rSelected){
		this.setState({limitSelected : rSelected}); //setState might update asynchronously in batches!
		this.updateChartFromData({
			limit: rSelected,
			sortBy: this.state.sortingSelection
		});
	}

	onChangingSorting(sSorting){
		this.setState({sortingSelection: sSorting});
		this.updateChartFromData({
			limit: this.state.limitSelected,
			sortBy: sSorting
		});
	}

	toggleSorting(){
		this.setState({sortingDropdownOpen : !this.state.sortingDropdownOpen});
	}

	render(){
		// IMPORTANT: redraw mechanism updates automatically if one property changed
		return (
			<div>
				<Container>
					<Row>
						<Col>
							<h6>Query limit</h6> {' '}
							<ButtonGroup>
								<Button onClick={() => this.onLimitSelection(30)} active={this.state.limitSelected === 30}>30</Button>
								<Button onClick={() => this.onLimitSelection(80)}  active= {this.state.limitSelected === 80}>80 (default)</Button>
								<Button onClick={() => this.onLimitSelection(160)}  active={this.state.limitSelected === 160}>160</Button>
								<Button onClick={() => this.onLimitSelection(0)}  active={this.state.limitSelected === 0}>no limit</Button>
							</ButtonGroup>
						</Col>
						<Col>
							<h6>Query sorted by</h6> {' '}
							<ButtonDropdown isOpen={this.state.sortingDropdownOpen} toggle={this.toggleSorting} direction="right">
								<DropdownToggle caret>
									{this.state.sortingSelectionNames[this.state.sortingSelection]}
								</DropdownToggle>
								<DropdownMenu>
									<DropdownItem onClick={()=> this.onChangingSorting(0)} active={this.state.sortingSelection === 0}>latest</DropdownItem>
									<DropdownItem onClick={()=> this.onChangingSorting(1)} active={this.state.sortingSelection === 1}>earliest today</DropdownItem>
									<DropdownItem onClick={()=> this.onChangingSorting(2)} active={this.state.sortingSelection === 2}>earliest</DropdownItem>
								</DropdownMenu>
							</ButtonDropdown>
						</Col>
					</Row>
					<Line data={this.state.chartData} options={this.state.chartOptions}/>	
				</Container>
				
			</div>
		);
	}
}

export default AppEventChart;