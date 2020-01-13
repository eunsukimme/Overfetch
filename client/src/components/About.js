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
                  alt="profile"
                />
                <h1 className="card-name">Kim Eunsu</h1>
                <p className="title">Fullstack Developer</p>
                <p className="description">
                  프로그래밍과 커피, 게임을 좋아하는 대학생
                </p>
                <div className="card-icon-container">
                  <a
                    href="https://gamsungcoding.tistory.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-blogger" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/eunsukimme/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-linkedin-in" />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=100003647254099"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook-square" />
                  </a>
                  <a
                    href="https://www.instagram.com/eunsu_wag"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                </div>
                <p>
                  <button className="contact-button">contact</button>
                </p>
              </div>
              <div className="people-card">
                <img
                  className="card-image"
                  src="../../../document/about_profile/taeyeong.png"
                  alt="profile"
                />
                <h1 className="card-name">An TaeYeong</h1>
                <p className="title">Content Designer</p>
                <p className="description">블리자드 게임을 좋아하는 대학생</p>
                <div className="card-icon-container">
                  <a
                    href="https://www.instagram.com/a_tae_o/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                </div>
                <p>
                  <button className="contact-button">contact</button>
                </p>
              </div>
              <div className="people-card">
                <img
                  className="card-image"
                  src="../../../document/about_profile/yunhui.jpg"
                  alt="profile"
                />
                <h1 className="card-name">Jang Yunhui</h1>
                <p className="title">Data Scientist</p>
                <p className="description">
                  데이터 마이닝과 프로세스 마이닝으로 세상을 변하게 하고 싶은
                  사람
                </p>

                <div className="card-icon-container">
                  <a
                    href="https://process-mining.tistory.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-blogger" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/%EC%9C%A4%ED%9D%AC-%EC%9E%A5-268458147/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-linkedin-in" />
                  </a>
                  <a
                    href="https://www.instagram.com/travel_unii"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                </div>
                <p>
                  <button className="contact-button">contact</button>
                </p>
              </div>
              <div className="people-card">
                <img
                  className="card-image"
                  src="../../../document/about_profile/hyunjun.jpg"
                  alt="profile"
                />
                <h1 className="card-name">Yoon Hyunjun </h1>
                <p className="title">Prop and Background Modeler, Artist</p>
                <p className="description">
                  적합한 아름다움을 창조하고자 하는 사람
                </p>
                <div className="card-icon-container">
                  <a
                    href="https://www.artstation.com/teneath"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-artstation" />
                  </a>
                </div>
                <p>
                  <button className="contact-button">contact</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
