import React, { Component } from "react";
import * as d3 from "d3";
import "./champion.css";

export class Champion extends Component {
  constructor(props) {
    super(props);
    this.championRef = React.createRef();
  }

  componentDidMount() {
    this.scrollToChampionRef();
    this.visualizeData();
  }

  async visualizeData() {
    const data = this.props.championData[0];
    console.log(data);
    const keys = Object.keys(data);

    // 현재 챔피언 플레이 수
    let play = this.props.userData.rankplay.record[`${this.props.championName}`]
      .게임["치른 게임"];
    if (play < 10) {
      alert("플레이 수가 10 보다 적어 부정확한 데이터가 포함될 수 있습니다");
    }
    // 영웅별 필드가 존재하지 않는 경우 알림을 띄운다
    if (
      this.props.userData.rankplay.record[`${this.props.championName}`]
        .영웅별 == undefined
    ) {
      return alert(
        "해당 영웅의 레코드가 존재하지 않습니다. 유저 데이터를 갱신해 주세요"
      );
    }

    keys.forEach((el, i) => {
      let field; // 현재 필드
      if (el == "_id") return;

      if (el.includes("게임당")) {
        const tokens = el.split("_"); // 게임당' 문자열 제외
        field = tokens[1];
        play = this.props.userData.rankplay.record[`${this.props.championName}`]
          .게임["치른 게임"];
      } else {
        field = el;
        play = 1;
      }

      const min = data[el]["min"].toFixed(2);
      const avg = data[el]["avg"].toFixed(2);
      const max = data[el]["max"].toFixed(2);

      const value = this.props.userData.rankplay.record[
        `${this.props.championName}`
      ].영웅별[field];
      const my_val = (value / play).toFixed(2);

      let percentage; // 상위 몇 % 인지를 나타내는 변수
      const topPercentageScale = d3
        .scaleLinear()
        .domain([max, avg])
        .range([1, 50])
        .clamp(true);
      const bottomPercentageScale = d3
        .scaleLinear()
        .domain([min, avg])
        .range([99, 49])
        .clamp(true);
      if (Number(my_val) < Number(avg)) {
        percentage = bottomPercentageScale(my_val);
      } else if (Number(my_val) >= Number(avg)) {
        percentage = topPercentageScale(my_val);
      }

      const dataSet = [min, [my_val, percentage], avg, max];

      const championYScale = d3
        .scaleLinear()
        .domain([min, max])
        .range([40, 360])
        .clamp(true);

      // svg 생성
      const bar_graph = d3
        .select("#viz")
        .append("svg")
        .attr("id", `${this.props.championName}_${i}`)
        .attr("width", "400px")
        .attr("height", "400px")
        .attr("class", "svg-graph")
        .style("border", "1px lightgray solid");

      // bar-graph의 타이틀 생성
      bar_graph
        .append("text")
        .attr("y", 16)
        .attr("class", "text")
        .html(el);

      // g생성하고 그 안에 또 g를 생성(막대 그래프+라벨 포함) 생성
      // 각 막대를 저장하는 g 를 bars 라는 변수에 할당
      const bars = d3
        .select(`#${this.props.championName}_${i}`)
        .append("g")
        .attr("class", `bar_graph`)
        .selectAll("g")
        .data(dataSet)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) {
          if (i == 1) {
            if (Number(d[0]) < Number(avg)) {
              d3.select(this).attr("class", "bar my_bar lt");
            } else if (Number(d[0]) >= Number(avg)) {
              d3.select(this).attr("class", "bar my_bar gte");
            }
          }
          return `translate(${i * 100}, 0)`;
        });

      // 각 g 에 막대 할당
      bars
        .append("rect")
        .attr("width", "50px")
        .attr("y", (d, i) => {
          if (i == 1) {
            return 400 - championYScale(d[0]);
          }
          return 400 - championYScale(d);
        })
        .transition()
        .duration(1500)
        .attr("height", (d, i) => {
          if (i == 1) {
            return championYScale(d[0]);
          }
          return championYScale(d);
        });

      // 각 bar 에 라벨(값) 생성
      bars
        .append("text")
        .text((d, i) => {
          if (i == 1) return d[0];
          return d;
        })
        .attr("y", (d, i) => {
          if (i == 1) return 400 - championYScale(d[0]) - 10;
          return 400 - championYScale(d) - 10;
        })
        .attr("class", "text")
        .style("text-anchor", "left");

      // 각 bar 에 라벨(기준) 생성
      bars
        .append("text")
        .data(["min", "my", "avg", "max"])
        .text((d, i) => {
          if (i == 1) return d[0];
          return d;
        })
        .attr("y", 390)
        .attr("class", "text")
        .style("text-anchor", "left");

      function mouseOver(d) {
        d3.select(this).style("stroke", "white");

        if (typeof d === "object" && d[1] != undefined) {
          const my_val = Number(d[0]);
          const per = d[1].toFixed(0);
          // 막대가 충분히 짧다면 위에 모달 생성
          if (per > 50) {
            d3.select(this.parentNode)
              .append("text")
              .attr("class", "text modal")
              .attr("x", -50)
              .attr("y", 300)
              .html(`상위 ${per}%`);
          }
          // 막대가 충분히 길다면 그 옆에 모달 생성
          else {
            d3.select(this.parentNode)
              .append("text")
              .attr("class", "text modal")
              .attr("x", -50)
              .attr("y", 300)
              .html(`상위 ${per}%`);
          }
        }
      }
      function mouseOut(d) {
        d3.select(this).style("stroke", "none");
        d3.select(this.parentNode)
          .select(".modal")
          .remove();
      }

      // 각 막대에 마우스 오버 함수 생성
      d3.selectAll(".bar_graph")
        .selectAll("rect")
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut);
    });
  }

  // 해당 챔피언 내용으로 스크롤함
  scrollToChampionRef() {
    window.scrollTo(0, this.championRef.current.offsetTop);
  }

  render() {
    console.log(this.props);
    return (
      <div className="champion-detail">
        <div className="section-header-container">
          <div className="section-header">
            <div className="header-bar" />
            <div className="header-parahgraph">{this.props.championName}</div>
          </div>
        </div>
        <div id="viz" ref={this.championRef} />
      </div>
    );
  }
}
