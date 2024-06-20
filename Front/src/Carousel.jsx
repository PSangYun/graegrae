import React, { Component } from "react";
import Carousel from "react-spring-3d-carousel";
import { v4 as uuidv4 } from "uuid";
import { config } from "react-spring";
import ProfileDialog from "./profileDialog";
import './carousel.css'
import profileList from "./profileList";

export default class Carroussel extends Component {
  state = {
    goToSlide: 0,
    offsetRadius: 2,
    showNavigation: true,
    enableSwipe: true,
    config: config.slow,
    dialogOpen: false,
    dialogTitle: "",
    dialogContent: ""
  };

  handleCardClick = (cardIndex) => {
    const profile = profileList.find(p => p.id === this.props.profileId);
    const card = profile.cards[cardIndex]
    if (this.state.goToSlide === cardIndex) {
      this.setState({ dialogOpen: true, dialogTitle: card.title,
        dialogContent: card.content || "No content available."});
    } else {
      this.setState({ goToSlide: cardIndex });
    }
  }
  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  createSlides = () => {
    const profile = profileList.find(p => p.id === this.props.profileId);
    return profile.cards.map((card, index) => {
      return {
        key: uuidv4(),
        content: (
          <button className="cardImgBtn" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + card.image})` }}
          ></button>
        ),
        onClick: () => this.handleCardClick(index)
      };
    });
  };

  render() {
    const { dialogOpen, dialogTitle, dialogContent } = this.state;
    return (
      <div style={{ width: "40%", height: "600px", margin: "0 auto" , position: "relative", top: "-10%" }}>
        <Carousel
          slides={this.createSlides()}
          goToSlide={this.state.goToSlide}
          offsetRadius={this.state.offsetRadius}
          //showNavigation={this.state.showNavigation}
          animationConfig={this.state.config}
        />
        <ProfileDialog
          open={dialogOpen}
          onClose={() => this.setState({ dialogOpen: false })}
          dialogTitle={dialogTitle}
          dialogContent={dialogContent}
        />
        <div
          style={{
            margin: "0 auto",
            marginTop: "2rem",
            width: "50%",
            height: "400px",
            display: "flex",
            justifyContent: "space-around",
          }}
          ></div>
      </div>
    );
  }
}
