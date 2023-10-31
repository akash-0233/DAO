
// src/components/HomePage.js

import React from 'react';
import './HomePage.css'; // Import the CSS file for styling

function HomePage() {
  return (
    <div className="container">
      <h1 className="heading">Welcome to our Decentralized Autonomous Organization (DAO)!</h1>
      <p className="paragraph">
        Our DAO empowers users to become investors and actively participate in the decision-making process of the organization.
        Investors have a voice in shaping the future of the DAO by voting on proposals created by the manager. When a proposal receives a majority of votes, it has the potential to be executed.
      </p>
      <p className="additional-info">
        <strong>What is a DAO?</strong>
        Decentralized Autonomous Organizations (DAOs) are innovative entities governed by smart contracts and the collective decisions of their members. These organizations operate on the blockchain, making them transparent, secure, and decentralized.

        <strong>Why Use Our DAO?</strong>
        Our DAO offers a unique opportunity for individuals to engage in collaborative decision-making without relying on a centralized authority. Key benefits include transparency, security, and direct participation.

        <strong>What Makes Our DAO Different?</strong>
        Our DAO prioritizes inclusivity and community-driven governance. Every member has a say in the organization's future, and smart contracts ensure the execution of proposals is automatic and trustless.
      </p>
      <div className="steps">
        <div className="step">
          <div className="stepIcon">1</div>
          <p className="stepText">Get started by connecting your Ethereum wallet (e.g., MetaMask) to interact with the blockchain.</p>
        </div>
        <div className="step">
          <div className="stepIcon">2</div>
          <p className="stepText">Become an investor by sending a specific amount of Ether to our DAO's smart contract. Your investment contributes to the decision-making power within the organization.</p>
        </div>
        <div className="step">
          <div className="stepIcon">3</div>
          <p className="stepText">Browse and cast your votes on proposals submitted by the manager. Your participation matters in shaping the future of the DAO.</p>
        </div>
        <div className="step">
          <div className="stepIcon">4</div>
          <p className="stepText">If you have innovative ideas or initiatives, you can propose them as a manager. Gain the support of fellow investors, and if your proposal is approved, you can put your plans into action.</p>
        </div>
        <div className="step">
          <div className="stepIcon">5</div>
          <p className="stepText">Our DAO is built on the principles of decentralization, transparency, and community-driven governance. Join us in shaping the future of decentralized organizations!</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
