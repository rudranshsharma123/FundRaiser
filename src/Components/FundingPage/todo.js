let y = await x.methods
	.sendDetails()
	.call()
	.then((result) => {
		console.log(result);
	});
let v = await x.methods
	.contribute()
	.send({
		from: props.account,
		value: props.web3.utils.toWei("1", "ether"),
		gas: 3000000,
	})
	.then((result) => {
		console.log(result);
	});
let z = await x.methods
	.amountToBeRasied()
	.call()
	.then((result) => {
		console.log(result);
	});
