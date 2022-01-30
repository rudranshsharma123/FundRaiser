import React, { Component } from "react";
import * as s from "../../styles/globalStyles";

function TopBanner(props) {
	return (
		<div style={{ background: "black" }}>
			<s.Container ai={"left"} style={{ padding: "5rem", lineHeight: "small" }}>
				<s.TextTitle style={{ color: "white", fontSize: "40px" }}>
					Welcome to FundRaiser!
				</s.TextTitle>
				<s.TextSubTitle
					style={{ color: "white", fontSize: "25px", marginTop: "-15px" }}>
					FundRaiser is a platform that allows you to raise funds for any
					Calamity
				</s.TextSubTitle>
				<s.TextSubTitle
					style={{ color: "white", fontSize: "25px", marginTop: "-20px" }}>
					Use this Platform to start campiagns and raise money to help with the
					victims
				</s.TextSubTitle>
				<s.TextSubTitle
					style={{ color: "white", fontSize: "25px", marginTop: "-20px" }}>
					The money you raise will directly be deposited into your Crypto Wallet
				</s.TextSubTitle>
			</s.Container>
		</div>
	);
}

export default TopBanner;
