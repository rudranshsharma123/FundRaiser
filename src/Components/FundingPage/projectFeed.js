import React, { useEffect, useState } from "react";

import * as s from "../../styles/globalStyles";
import Project from "../../contracts/Project.json";
import Web3 from "web3";
import Card from "react-bootstrap/Card";
import ProjectFactory from "../../contracts/ProjectFactory.json";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
function ProjectFeed(props) {
	const [projList, setProjList] = useState([]);
	const [mounted, setMounted] = useState(false);
	const [web3, setWeb3] = useState(null);
	const [account, setAccount] = useState("");
	const [ownerProjectList, setOwnerProjectList] = useState([]);
	const [notOwnerProjectList, setNotOwnerProjectList] = useState([]);
	const [ownerProjectContracts, setOwnerProjectContracts] = useState([]);
	const [notOwnerProjectContracts, setNotOwnerProjectContracts] = useState([]);
	const [moneyToBeSent, setMoneyToBeSent] = useState(0);

	function handleInputMoney(event) {
		setMoneyToBeSent(event.target.value);
	}
	async function sendMessages(phoneNumber) {
		let body = {
			sendee: phoneNumber,
			message:
				"Hi, Your FundRaiser is done! Check your Wallet to see your money and click on the check the staus of your project button to see the changes",
		};
		let response = await fetch("http://127.0.0.1:5000/message", {
			body: JSON.stringify(body),
			method: "POST",
			mode: "no-cors",
		});
		// let responseJson = await response.json();
		// console.log(responseJson);
		console.log("done");
	}

	async function checkTheStatutsOfTheProject(projectIndex, event) {
		event.preventDefault();
		let projectContract = new web3.eth.Contract(
			Project.abi,
			notOwnerProjectContracts[projectIndex],
		);

		let check = await projectContract.methods
			.checkTheStatusOfTheProject()
			.send({ from: account })
			.then((result) => {
				return result;
			});
		console.log(check);
		let state = await projectContract.methods
			.projectState()
			.call()
			.then((result) => {
				return result;
			});
		let phoneNumber = await projectContract.methods
			.phoneNumber()
			.call()
			.then((result) => {
				return result;
			});
		// console.log(state);
		console.log(phoneNumber);
		if (state === "1" || state === "2") {
			sendMessages(phoneNumber);
		}
		setTimeout(1000);
		window.location.reload();
	}
	async function checkTheStatutsOfTheSelfProject(projectIndex, event) {
		event.preventDefault();
		let projectContract = new web3.eth.Contract(
			Project.abi,
			ownerProjectContracts[projectIndex],
		);

		let check = await projectContract.methods
			.checkTheStatusOfTheProject()
			.send({ from: account })
			.then((result) => {
				return result;
			});
		console.log(check);
		let state = await projectContract.methods
			.projectState()
			.call()
			.then((result) => {
				return result;
			});
		let phoneNumber = await projectContract.methods
			.phoneNumber()
			.call()
			.then((result) => {
				return result;
			});
		// console.log(state);
		console.log(phoneNumber);
		if (state === "1" || state === "2") {
			sendMessages(phoneNumber);
		}
		setTimeout(1000);
		window.location.reload();
	}

	async function fundTheProjects(projectID, event) {
		event.preventDefault();
		let projectContract = new web3.eth.Contract(
			Project.abi,
			notOwnerProjectContracts[projectID],
		);

		let check = await projectContract.methods
			.checkTheStatusOfTheProject()
			.send({ from: account })
			.then((result) => {
				return result;
			});

		let state = await projectContract.methods
			.projectState()
			.call()
			.then((result) => {
				console.log(result);
			});
		console.log(check);
		if (check === "Project is Funded" || check === "Project is Expired") {
			return;
		}
		let reciept = await projectContract.methods
			.contribute()
			.send({
				from: account,
				value: web3.utils.toWei(moneyToBeSent, "ether"),
				gas: 3000000,
			})
			.then((result) => {
				console.log(result);
			});
		let reCheck = await projectContract.methods
			.checkTheStatusOfTheProject()
			.send({ from: account })
			.then((result) => {
				return result;
			});
		window.location.reload();
	}

	let projectFactory = null;
	async function loadProjects() {
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
		const web3 = window.web3;
		// Load account
		const accounts = await window.ethereum.request({
			method: "eth_accounts",
		});
		// this.setState({ account: accounts[0] });
		// this.setState({ web3: web3 });
		// Network ID
		const networkId = await window.ethereum.request({
			method: "net_version",
		});
		const networkData = ProjectFactory.networks[networkId];
		let proj = new web3.eth.Contract(ProjectFactory.abi, networkData.address);
		// console.log(networkData);
		// console.log(proj);
		// console.log(projectFactory);
		// console.log(accounts);
		let ownerProjList = await proj.methods
			.getOwnerProjects(accounts[0])
			.call()
			.then((res) => {
				return res;
			});
		let notOwnerProjList = await proj.methods
			.getNotOwnerProjects(accounts[0])
			.call()
			.then((res) => {
				return res;
			});
		// console.log(ownerProjList);
		let actualProjList = [];
		for (let i in ownerProjList) {
			let projectContract = new web3.eth.Contract(
				Project.abi,
				ownerProjList[i],
			);

			// console.log(projectContract);
			let info = await projectContract.methods
				.sendDetails()
				.call()
				.then((res) => {
					return res;
				});
			actualProjList.push(info);
			// console.log(info);
		}
		// console.log(actualProjList);
		let actualNotOwnerProjList = [];
		for (let i in notOwnerProjList) {
			let projectContract = new web3.eth.Contract(
				Project.abi,
				notOwnerProjList[i],
			);

			// console.log(projectContract);
			let info = await projectContract.methods
				.sendDetails()
				.call()
				.then((res) => {
					return res;
				});
			actualNotOwnerProjList.push(info);
			// console.log(info);
		}

		return {
			ownerProjList: actualProjList,
			account: accounts[0],
			notOwnerProjList: actualNotOwnerProjList,
			web3: web3,
			ownerProjectContracts: ownerProjList,
			notOwnerProjectContracts: notOwnerProjList,
		};
	}

	function test() {
		// console.log(account);
		// console.log(ownerProjectList);
		// console.log(notOwnerProjectList);
		// console.log(web3);
		console.log(ownerProjectContracts);
		console.log(notOwnerProjectContracts);
		// console.log(actualProjList);
	}

	useEffect(async () => {
		let x = await loadProjects();
		// console.log(x);
		setAccount(x["account"]);
	}, [account]);
	useEffect(async () => {
		let x = await loadProjects();

		const web3 = window.web3;

		setOwnerProjectList((prevState) => {
			return x["ownerProjList"];
		});
		setNotOwnerProjectList((prevState) => {
			return x["notOwnerProjList"];
		});

		setOwnerProjectContracts((prevState) => {
			return x["ownerProjectContracts"];
		});

		setNotOwnerProjectContracts((prevState) => {
			return x["notOwnerProjectContracts"];
		});

		setWeb3((prevState) => {
			return x["web3"];
		});
	}, []);
	return (
		<div style={{ background: "#666666 " }}>
			<s.Container jc={"center"} ai={"center"}>
				<s.TextTitle
					style={{
						color: "white",
						fontSize: "35px",
						alignItems: "center",
						textAlign: "center",
					}}>
					See All Your FundRaisers
				</s.TextTitle>
			</s.Container>
			<s.Container
				style={{ padding: "10px", flexWrap: "wrap" }}
				fd={"row"}
				jc={"center"}>
				{/* {console.log(ownerProjectList)} */}

				{ownerProjectList.map((project, index) => {
					// console.log(project);
					let color = "red";
					if (project.stateOfTheProj === "Funded") {
						color = "green";
					} else if (project.stateOfTheProj === "Expired") {
						color = "black";
					}

					let utcSec = project.timeLeft;
					let date = new Date(0);
					date.setUTCSeconds(utcSec);
					return (
						<div key={index}>
							<Card style={{ margin: "10px", width: "30rem" }}>
								<Card.Body style={{ background: color }}>
									<s.Container
										style={{ padding: "15px" }}
										className="card-header">
										<s.SpacerXSmall />
										<Card.Title style={{ color: "white" }}>
											Name of the FundRaiser:{" "}
											<s.TextTitle fs={"40"}>
												{project.nameOftheProj}
											</s.TextTitle>
										</Card.Title>
										<s.SpacerSmall></s.SpacerSmall>
										<s.Container>
											<ListGroup className="list-group-flush">
												<ListGroupItem>
													Fund Raiser description
													<s.TextTitle>{project.descOfProj}</s.TextTitle>
												</ListGroupItem>
												<ListGroupItem>
													Amount to be raised (in eth)
													<s.TextTitle>
														{project.fundRaiseAmount / 10 ** 18}
													</s.TextTitle>
												</ListGroupItem>
												<ListGroupItem>
													Amount Rasied Till now (in eth)
													<s.TextTitle>
														{project.amountRaised / 10 ** 18}
													</s.TextTitle>
												</ListGroupItem>
												<ListGroupItem>
													Phone Number of the Fundraiser Creator {"   "}
													<s.TextTitle>{project.cellNumber}</s.TextTitle>
												</ListGroupItem>
												<ListGroupItem>
													Time at which the fundraiser will end {"   "}
													<s.TextTitle>{date.toDateString()}</s.TextTitle>
												</ListGroupItem>
												<ListGroupItem>
													Project State:
													<s.TextTitle>{project.stateOfTheProj}</s.TextTitle>
												</ListGroupItem>
											</ListGroup>
											<Button
												onClick={(event) => {
													checkTheStatutsOfTheSelfProject(index, event);
												}}>
												{" "}
												Check The Stauts of the project
											</Button>
										</s.Container>

										<s.Container style={{ paddingTop: "10px" }}></s.Container>
									</s.Container>
								</Card.Body>
							</Card>
						</div>
					);
				})}
			</s.Container>
			<s.TextTitle
				style={{
					color: "white",
					fontSize: "35px",
					alignItems: "center",
					textAlign: "center",
				}}>
				See all the FundRaisers You can Contribute to!
			</s.TextTitle>
			<s.Container
				style={{ padding: "10px", flexWrap: "wrap" }}
				fd={"row"}
				jc={"center"}>
				{notOwnerProjectList.map((project, index) => {
					// console.log(project);
					let color = "red";
					if (project.stateOfTheProj === "Funded") {
						color = "green";
					} else if (project.stateOfTheProj === "Expired") {
						color = "black";
					}
					let utcSec = project.timeLeft;
					let date = new Date(0);
					date.setUTCSeconds(utcSec);
					return (
						<div key={index}>
							<Card style={{ margin: "10px", width: "30rem" }}>
								<Card.Body style={{ background: color }}>
									<s.Container
										style={{ padding: "15px" }}
										className="card-header">
										<s.SpacerXSmall />
										<Card.Title style={{ color: "white" }}>
											Name{" "}
											<s.TextTitle fs={40}>{project.nameOftheProj}</s.TextTitle>
										</Card.Title>
										<s.Container>
											<ListGroup className="list-group-flush">
												<ListGroupItem>
													Fund Raiser description{" "}
													<s.TextTitle>{project.descOfProj}</s.TextTitle>
												</ListGroupItem>
												<ListGroupItem>
													Amount to be raised(in eth){" "}
													<s.TextTitle>
														{" "}
														{project.fundRaiseAmount / 10 ** 18}
													</s.TextTitle>
												</ListGroupItem>
												<ListGroupItem>
													Amount Rasie Till now(in eth){" "}
													<s.TextTitle>
														{project.amountRaised / 10 ** 18}
													</s.TextTitle>
												</ListGroupItem>
												<ListGroupItem>
													Phone Number of the Fundraiser Creator
													<s.TextTitle>{project.cellNumber}</s.TextTitle>
												</ListGroupItem>
												<ListGroupItem>
													Time at which the fundraiser will end
													<s.TextTitle>{date.toDateString()}</s.TextTitle>
												</ListGroupItem>
												<ListGroupItem>
													Project State
													<s.TextTitle>{project.stateOfTheProj}</s.TextTitle>
												</ListGroupItem>
											</ListGroup>
											<s.SpacerLarge />
											<form>
												<label style={{ color: "white", fontSize: "20px" }}>
													How Much money (in eth) do you want to Contribute{" "}
													<br></br>
													<s.SpacerSmall></s.SpacerSmall>
													<input
														type={"number"}
														name="Enter the name of the Project"
														onChange={(event) => {
															handleInputMoney(event);
															console.log(moneyToBeSent);
														}}
													/>
												</label>
												<s.SpacerSmall></s.SpacerSmall>
												<Button
													type={"submit"}
													value={"submit"}
													onClick={(event) => {
														fundTheProjects(index, event);
													}}
													variant="danger">
													Fund The Project
												</Button>
											</form>
											<Button
												onClick={(event) => {
													checkTheStatutsOfTheProject(index, event);
												}}>
												{" "}
												Check The Stauts of the project
											</Button>
										</s.Container>

										<s.Container style={{ paddingTop: "10px" }}></s.Container>
									</s.Container>
								</Card.Body>
							</Card>
							<s.SpacerLarge></s.SpacerLarge>
						</div>
					);
				})}
			</s.Container>
		</div>
	);
}

export default ProjectFeed;
