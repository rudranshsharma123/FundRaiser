import logo from './logo.svg';
import './App.css';
import Web3 from "web3";
import { Component } from "react";

import test from "./contracts/test.json";
import Project from "./contracts/Project.json";
import Navbar from "./Components/navbar/navbar";
import FundingPage from "../src/Views/fundingPage";

class App extends Component {
	// async componentWillMount() {
	// 	await this.loadWeb3();
	// 	await this.loadBlockchainData();
	// }
	constructor(props) {
		super(props);
		this.state = {
			buffer: null,
			account: "",
			test: null,
			web3: null,
		};
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

	async loadBlockchainData() {
		const web3 = window.web3;
		// Load account
		const accounts = await web3.eth.getAccounts();
		this.setState({ account: accounts[0] });
		this.setState({ web3: web3 });
		// Network ID
		const networkId = await web3.eth.net.getId();
		const networkData = test.networks[networkId];
		if (networkData) {
			this.setState({
				test: new web3.eth.Contract(test.abi, networkData.address),
			});
		}
		console.log(networkData);
	}

	async testFunctions() {
		await this.state.test.methods
			.createNew("Hellpo")
			.send({ from: this.state.account })
			.on("transactionHash", function (hash) {
				console.log(hash);
			});
	}

	async testDeployedContract() {
		let res;
		let project = await this.state.test.methods
			.proj(0)
			.call()
			.then((result) => {
				console.log(result);
				res = result;
				// return result;
			});
		console.log(res);
		let project2 = new this.state.web3.eth.Contract(Project.abi, res);
		project2.methods
			.name()
			.call()
			.then((result) => {
				console.log(result);
			});
		// console.log(project);
	}

	render() {
		return (
			<div>
				<Navbar />
				<FundingPage />
			</div>
		);
	}
}

export default App;
