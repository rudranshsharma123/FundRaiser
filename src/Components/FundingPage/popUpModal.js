import React, { useState } from "react";

import Modal from "react-modal";
import * as s from "../../styles/globalStyles";
import Project from "../../contracts/Project.json";
import { Button } from "react-bootstrap";

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
};

function PopUpModal(props) {
	let subtitle;
	let words;
	const [modalIsOpen, setIsOpen] = React.useState(false);
	const [projectName, setProjectName] = useState("");
	const [description, setDesciption] = useState("");
	const [raisingMoney, setRaisingMoney] = useState(0);
	const [days, setDays] = useState(0);
	const [phoneNumber, setphoneNumber] = useState("");
	const [NaturalCalamity, setNaturalCalamity] = useState("");

	async function sendMessages(phoneNumber) {
		let body = {
			sendee: phoneNumber,
			message:
				"Hi, We have Recived your FundRaiser and it is live on the website all you need to do is step back and check the status of your request from time to time!",
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

	async function handleSubmit(event) {
		event.preventDefault();
		let projFact = props.projectFactory;
		//Creating a new project
		await projFact.methods
			.createProject(
				projectName,
				description,
				days,
				raisingMoney,

				phoneNumber, //  TODO Enter the phone number herer
			)
			.send({ from: props.account });

		// Getting the handle to the project just created
		let projIndex = await projFact.methods
			.numProjects()
			.call()
			.then((number) => {
				return number - 1;
			});

		let proj = await projFact.methods
			.allProjects(projIndex)
			.call()
			.then(async (result) => {
				console.log(result);
				let x = new props.web3.eth.Contract(Project.abi, result);
				return x;
			});

		await proj.methods
			.sendDetails()
			.call()
			.then((result) => {
				console.log(result);
			});
		await sendMessages(phoneNumber);
		setIsOpen(false);
		window.location.reload();
	}

	function openModal() {
		setIsOpen(true);
	}

	function afterOpenModal() {
		// references are now sync'd and can be accessed.
	}

	function onChangeTextFeild(event, name) {
		switch (name) {
			case "projectName":
				setProjectName(event.target.value);
				break;

			case "description":
				setDesciption(event.target.value);
				break;

			case "raisingMoney":
				setRaisingMoney(event.target.value);
				break;

			case "days":
				setDays(event.target.value);
				break;

			case "phoneNumber":
				setphoneNumber(event.target.value);
				break;

			case "NaturalCalamity":
				setNaturalCalamity(event.target.value);
				break;
			default:
				break;

			// setProjectName(event.target.value);
		}
	}

	function closeModal() {
		setIsOpen(false);
	}

	return (
		<div>
			<Button onClick={openModal} variant="danger">
				Start A Project
			</Button>

			<Modal
				isOpen={modalIsOpen}
				onAfterOpen={afterOpenModal}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel="Example Modal">
				<s.TextTitle>Start a FundRaiser</s.TextTitle>

				<form>
					<label>
						Enter the name of the FundRaiser: <br></br>
						<s.SpacerXSmall></s.SpacerXSmall>
						<input
							type={"text"}
							name="Enter the name of the Project"
							ref={(input) => {
								words = input;
							}}
							onChange={(event) => {
								onChangeTextFeild(event, "projectName");
								console.log(projectName);
							}}
						/>
					</label>
					<br></br>
					<label>
						Enter the description of the FundRaiser <br></br>
						<s.SpacerXSmall></s.SpacerXSmall>
						<input
							type={"text"}
							name="Enter the name of the Project"
							onChange={(event) => {
								onChangeTextFeild(event, "description");
								console.log(description);
							}}
						/>
					</label>
					<br></br>
					<label>
						How Much money (in eth) are you trying to raise? <br></br>
						<s.SpacerXSmall></s.SpacerXSmall>
						<input
							type={"number"}
							name="Enter the name of the Project"
							onChange={(event) => {
								onChangeTextFeild(event, "raisingMoney");
								console.log(raisingMoney);
							}}
						/>
					</label>
					<br></br>
					<label>
						How many days are you planning to let it run? <br></br>
						<s.SpacerXSmall></s.SpacerXSmall>
						<input
							type={"number"}
							name="Enter the name of the Project"
							onChange={(event) => {
								onChangeTextFeild(event, "days");
								console.log(days);
							}}
						/>
					</label>
					<br></br>
					<label>
						Your Phone number (for information regarding your FundRaiser){" "}
						<br></br>
						<s.SpacerXSmall></s.SpacerXSmall>
						<input
							type={"text"}
							name="Enter the name of the Project"
							onChange={(event) => {
								onChangeTextFeild(event, "phoneNumber");
								console.log(phoneNumber);
							}}
						/>
					</label>
					<br></br>
					<s.SpacerXSmall></s.SpacerXSmall>
					<label>
						Pick the type of Calamity you are raising for: <br></br>
						<s.SpacerXSmall></s.SpacerXSmall>
						<select
							onChange={(event) => {
								onChangeTextFeild(event, "NaturalCalamity");
								console.log(NaturalCalamity);
							}}>
							<option value={"Hurricane"}>Hurricane</option>
							<option value={"Earthquake"}>Earthquake</option>
							<option value={"Landslide"}>Landslide</option>
							<option value={"Tornado"}>Tornado</option>
							<option value={"Health Hazards"}>Tornado</option>
							<option value={"Others"}>Tornado</option>
						</select>
					</label>
					<br></br>
					<s.SpacerXSmall></s.SpacerXSmall>

					<Button type={"submit"} value={"Submit"} onClick={handleSubmit}>
						{" "}
						Submit{" "}
					</Button>
				</form>
				<s.SpacerXSmall></s.SpacerXSmall>

				<Button variant="danger" onClick={closeModal}>
					close
				</Button>
			</Modal>
		</div>
	);
}

export default PopUpModal;
