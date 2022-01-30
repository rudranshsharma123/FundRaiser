import { Component } from "react";
import { Nav, NavItems } from "../../styles/navbarStyles";
import {
	Circle,
	SpacerXSmall,
	TextTitle,
	Container,
} from "../../styles/globalStyles";
import Web3 from "web3";

import test from "../../contracts/test.json";
import Project from "../../contracts/Project.json";

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			account: "",
			web3: null,
			loading: true,
			projectFactory: null,
		};
	}
	componentDidMount() {
		window.ethereum.on("accountsChanged", (accounts) => {
			this.setState({ account: accounts[0] });
			window.location.reload();
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
		const networkData = test.networks[networkId];
		if (networkData) {
			this.setState({
				projectFactory: new web3.eth.Contract(test.abi, networkData.address),
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
				<Nav>
					<NavItems style={{ fontSize: "20px" }}>FundRaiser</NavItems>
					<>
						<NavItems
							onClick={() => {
								this.setState({ loading: true });
								this.loadWeb3();
								this.loadBlockchainData();
								console.log(this.state.account);
								this.setState({ loading: false });
							}}>
							Connect Wallet
							<SpacerXSmall />
							<Circle
								height={20}
								width={20}
								color={this.state.account === "" ? "black" : "lightgreen"}
							/>
						</NavItems>
						{this.state.account === "" ? (
							""
						) : (
							<TextTitle>{this.state.account}</TextTitle>
						)}
					</>
					<NavItems>About</NavItems>
				</Nav>
			</>
		);
	}
}
//
export default Navbar;
