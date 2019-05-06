import React, { Component } from "react";
import "./css/about.css";

export class About extends Component {
  render() {
    return (
      <div className="about-container">
        <div className="about-section">
          <div className="about-intro">
            <div className="about-main-background" />
            ABOUT OVERFETCH
          </div>
          <div className="about-detail">
            Overfetch는 한국장학재단이 주관하고 블리자드 엔터테인먼트(Blizzard
            Entertainment)가 지원하는 푸른등대 기부장학금 수혜 대학생이
            만들어가는 서비스 입니다. 오버워치에서 제공하는 게임 데이터를
            시각화하여 보다 더 나은 사용자 경험을 제공하고자 푸른등대
            기부장학생이 힘을 모아 프로젝트를 진행하고 있습니다
          </div>
        </div>
        <div className="about-section">
          <div className="about-intro">
            <div className="about-main-background2" />
            WHO WE ARE
          </div>
          <div className="about-detail">
            <div className="people-cards-container">
              <div className="people-card">
                <img
                  className="card-image"
                  src="../../../document/about_profile/eunsu.jpg"
                />
                <h1 className="card-name">Kim Eunsu</h1>
                <p className="title">Fullstack Developer</p>
                <p className="description">
                  프로그래밍과 커피, 게임을 좋아하는 대학생
                </p>
                <div className="card-icon-container">
                  <a href="#">
                    <i class="fab fa-linkedin-in" />
                  </a>
                  <a href="#">
                    <i class="fab fa-facebook-square" />
                  </a>
                  <a href="#">
                    <i class="fab fa-instagram" />
                  </a>
                </div>
                <p>
                  <button>contact</button>
                </p>
              </div>
              <div className="people-card">
                <img
                  className="card-image"
                  src="../../../document/about_profile/eunsu.jpg"
                />
                <h1 className="card-name">Kim Eunsu</h1>
                <p className="title">Fullstack Developer</p>
                <p className="description">
                  프로그래밍과 커피, 게임을 좋아하는 대학생
                </p>
                <div className="card-icon-container">
                  <a href="#">
                    <i class="fab fa-linkedin-in" />
                  </a>
                  <a href="#">
                    <i class="fab fa-facebook-square" />
                  </a>
                  <a href="#">
                    <i class="fab fa-instagram" />
                  </a>
                </div>
                <p>
                  <button>contact</button>
                </p>
              </div>
              <div className="people-card">
                <img
                  className="card-image"
                  src="../../../document/about_profile/eunsu.jpg"
                />
                <h1 className="card-name">Kim Eunsu</h1>
                <p className="title">Fullstack Developer</p>
                <p className="description">
                  프로그래밍과 커피, 게임을 좋아하는 대학생
                </p>
                <div className="card-icon-container">
                  <a href="#">
                    <i class="fab fa-linkedin-in" />
                  </a>
                  <a href="#">
                    <i class="fab fa-facebook-square" />
                  </a>
                  <a href="#">
                    <i class="fab fa-instagram" />
                  </a>
                </div>
                <p>
                  <button>contact</button>
                </p>
              </div>
              <div className="people-card">
                <img
                  className="card-image"
                  src="../../../document/about_profile/eunsu.jpg"
                />
                <h1 className="card-name">Kim Eunsu</h1>
                <p className="title">Fullstack Developer</p>
                <p className="description">
                  프로그래밍과 커피, 게임을 좋아하는 대학생
                </p>
                <div className="card-icon-container">
                  <a href="#">
                    <i class="fab fa-linkedin-in" />
                  </a>
                  <a href="#">
                    <i class="fab fa-facebook-square" />
                  </a>
                  <a href="#">
                    <i class="fab fa-instagram" />
                  </a>
                </div>
                <p>
                  <button>contact</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
