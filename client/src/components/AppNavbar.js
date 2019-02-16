import React, {Component} from 'react';
import {
	Navbar,
	NavbarBrand
} from 'reactstrap';

class AppNavbar extends Component{

	constructor(props){
		super(props);
	}

	render() {
		return (
		<Navbar color="dark" dark expand="sm" className="mb-5">
			<NavbarBrand href="/">Home system log</NavbarBrand>
		</Navbar>
		);
		
	}
}

export default AppNavbar;