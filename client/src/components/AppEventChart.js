import React, { Component } from 'react';
import {Button, ButtonGroup, ButtonDropdown,
		DropdownToggle, DropdownMenu, DropdownItem,
		Container, Fade, Row, Col} from 'reactstrap';
import {Line} from 'react-chartjs-2';
import {SingleDatePicker} from 'react-dates';
import moment from 'moment';

class AppEventChart extends Component{
	constructor(props){
		super(props);

		this.state = {

			// Chart props
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
							max: 40
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
							min: 15,
							max: 65
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
			noDataAvailable: false,

			// UI
			// Calendar related states
			UI_buttonDateSpecifier: 1,
			UI_SelectedDate: moment(),
			UI_CalIsFocus: false,
			UI_CalFadeStatus: true,

			// Query limit dropdown
			UI_LimitDropdownOpen: false,
			UI_LimitSelection: 80,
			UI_LimitLabels: {20 : 20, 40: 40, 80: '80 (default)', 100: 100, 120: 120, 0: "no limit"},

			// Query sort order (descending default)
			UI_SortOrder: -1,
		}
		this.toggleLimit = this.onToggleLimit.bind(this);
	}

	// requests new data from API server
	updateChartFromData(jsonData = null){
		var formattedHumArray = [];
		var formattedTmpArray = [];

		// POST
		this.postQuery("./events", (jsonData != null) ? jsonData : {
			limit: this.state.UI_LimitSelection,
			sortBy: this.state.UI_SortOrder,
			date: this.state.UI_SelectedDate,
			ignoreDate: !this.state.UI_CalFadeStatus
		}).then(response => response.json()).then(data => {
			if (data.length === 0){
				this.setState({noDataAvailable: true})
			}else{
				// extract relevant chart data
				formattedTmpArray = data.map(item => {
					formattedHumArray.push({
						x: moment(item.timestamp),
						y: parseInt(item.data[1], 10)
					});
					return {
						x: moment(item.timestamp),
						y: parseInt(item.data[0], 10)
					};
				});

				// update all state variables
				this.setState({
					noDataAvailable: false,
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
			}
			
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
		this.setState({UI_LimitSelection : rSelected}); //setState might update asynchronously in batches!
		this.updateChartFromData({
			limit: rSelected,
			sortBy: this.state.UI_SortOrder,
			date: this.state.UI_SelectedDate,
			ignoreDate: !this.state.UI_CalFadeStatus
		});
	}

	onChangingSorting(rSelected){
		this.setState({UI_SortOrder: rSelected});
		this.updateChartFromData({
			limit: this.state.UI_LimitSelection,
			sortBy: rSelected,
			date: this.state.UI_SelectedDate,
			ignoreDate: !this.state.UI_CalFadeStatus
		});
	}

	onToggleLimit(){
		this.setState({UI_LimitDropdownOpen : !this.state.UI_LimitDropdownOpen});
	}

	selectionOfDate(sOption){
		this.setState({UI_CalIsFocus: sOption, UI_CalFadeStatus: sOption});
		if (sOption === false){
			// ignore date, therefore update calendar
			this.updateChartFromData({
				limit: this.state.UI_LimitSelection,
				sortBy: this.state.UI_SortOrder,
				date: this.state.UI_SelectedDate,
				ignoreDate: !sOption
			});
		}
	}

	changedDate(selectedDt){
		this.setState({UI_SelectedDate: selectedDt});
		this.updateChartFromData({
			limit: this.state.UI_LimitSelection,
			sortBy: this.state.UI_SortOrder,
			date: selectedDt,
			ignoreDate: !this.state.UI_CalFadeStatus
		});
	}

	// limit selection of dates only to past dates
	isOutsidePermittedRange(date){
		return date.isAfter(moment(), 'day');
	}

	render(){
		// IMPORTANT: redraw mechanism updates automatically if one property changed
		return (
				<Container>
					<Row>
						<Col>
							<h6>Select date </h6>
							<ButtonGroup>
								<Button onClick={() => this.selectionOfDate(false)} active={this.state.UI_CalFadeStatus === false}>ignore</Button>
								<Button onClick={() => this.selectionOfDate(true)}  active= {this.state.UI_CalFadeStatus === true}>specify</Button>
							</ButtonGroup>
							<Fade in={this.state.UI_CalFadeStatus}>
								<SingleDatePicker	id = 'date_selector'
													date={this.state.UI_SelectedDate}
													onDateChange={date => this.changedDate(date)}
													focused ={this.state.UI_CalIsFocus}
													onFocusChange = {({focused}) => this.setState({UI_CalIsFocus: focused})}
													isOutsideRange={this.isOutsidePermittedRange}
													disabled={!this.state.UI_CalFadeStatus}
													displayFormat="DD.MM.YYYY"
													readOnly/>
							</Fade>
						</Col>
						<Col>
							<h6>Dataset limit</h6>
							<ButtonDropdown isOpen={this.state.UI_LimitDropdownOpen} toggle={this.toggleLimit} direction="right">
								<DropdownToggle caret>
									{this.state.UI_LimitLabels[this.state.UI_LimitSelection]}
								</DropdownToggle>
								<DropdownMenu>
									<DropdownItem onClick={()=> this.onLimitSelection(20)} active={this.state.UI_LimitSelection === 20}>20</DropdownItem>
									<DropdownItem onClick={()=> this.onLimitSelection(40)} active={this.state.UI_LimitSelection === 40}>40</DropdownItem>
									<DropdownItem onClick={()=> this.onLimitSelection(80)} active={this.state.UI_LimitSelection === 80}>80 (default)</DropdownItem>
									<DropdownItem onClick={()=> this.onLimitSelection(100)} active={this.state.UI_LimitSelection === 100}>100</DropdownItem>
									<DropdownItem onClick={()=> this.onLimitSelection(120)} active={this.state.UI_LimitSelection === 120}>120</DropdownItem>
									<DropdownItem onClick={()=> this.onLimitSelection(0)} active={this.state.UI_LimitSelection === 0}>no limit</DropdownItem>
								</DropdownMenu>
							</ButtonDropdown>
						</Col>
						<Col>
							<h6>Sorting sets by</h6>
						<ButtonGroup>
								<Button onClick={() => this.onChangingSorting(-1)} active={this.state.UI_SortOrder === -1}>latest</Button>
								<Button onClick={() => this.onChangingSorting(1)}  active= {this.state.UI_SortOrder === 1}>earliest</Button>
							</ButtonGroup>
						</Col>
					</Row>
					<div>
					{ (this.state.noDataAvailable) ? <h5>No data available.</h5>: <Line data={this.state.chartData} options={this.state.chartOptions}/>	 }
					</div>
				</Container>
		);
	}
}

export default AppEventChart;