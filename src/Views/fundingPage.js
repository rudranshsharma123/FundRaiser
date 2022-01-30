import React, { Component } from "react";
import TopBanner from "../Components/FundingPage/topBanner";
import PopUpModal from "../Components/FundingPage/popUpModal";

import * as s from "../styles/globalStyles";
import Web3 from "web3";

import ProjectFactory from "../contracts/ProjectFactory.json";
import Project from "../contracts/Project.json";
import ProjectFeed from "../Components/FundingPage/projectFeed";

class FundingPage extends Component {
	async componentWillMount() {
		await this.loadWeb3();
		await this.loadBlockchainData();
	}
	constructor(props) {
		super(props);
		this.state = {
			account: "",
			web3: null,
			loading: true,
			projectFactory: null,
			ownerProjects: [],
			notOwenProjects: [],
		};
	}
	componentDidMount() {
		window.ethereum.on("accountsChanged", (accounts) => {
			this.setState({ account: accounts[0] });
		});
	}
	async loadBlockchainData() {
		const web3 = window.web3;
		// Load account
		const accounts = await web3.eth.getAccounts();
		this.setState({ account: accounts[0] });
		this.setState({ web3: web3 });
		// Network ID
		const networkId = await web3.eth.net.getId();
		const networkData = ProjectFactory.networks[networkId];
		if (networkData) {
			this.setState({
				projectFactory: new web3.eth.Contract(
					ProjectFactory.abi,
					networkData.address,
				),
			});
		}
		console.log(networkData);

	}
	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		} else {
			window.alert(
				"Non-Ethereum browser detected. You should consider trying MetaMask!",
			);
		}
	}
	render() {
		return (
			<>
				<TopBanner />
				<div style={{ background: "#CC99CC" }}>
					<s.Container style={{ padding: "5rem", color: "white" }}>
						<s.TextTitle style={{ fontSize: "25px" }}>
							Start a FundRaiser by clicking the button below ---{">"}
						</s.TextTitle>

						<PopUpModal
							account={this.state.account}
							web3={this.state.web3}
							projectFactory={this.state.projectFactory}></PopUpModal>
						
					</s.Container>
				</div>
				<ProjectFeed
					account={this.state.account}
					web3={this.state.web3}
					projectFactory={this.state.projectFactory}></ProjectFeed>
			</>
		);
	}
}

export default FundingPage;
