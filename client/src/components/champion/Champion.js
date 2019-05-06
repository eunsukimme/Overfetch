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
    const keys = Object.keys(data);

    // 현재 챔피언 플레이 수
    if (
      this.props.userData.rankplay.record[`${this.props.championName}`] ===
      undefined
    ) {
      return alert("잘못된 정보가 포함되었습니다. 유저 정보를 갱신해 주세요");
    }
    let play = this.props.userData.rankplay.record[`${this.props.championName}`]
      .게임["치른 게임"];
    if (play < 10) {
      alert("플레이 게임 수가 10게임보다 적어 부정확한 데이터일 수 있습니다");
    }
    // 영웅별 필드가 존재하지 않는 경우 알림을 띄운다
    if (
      this.props.userData.rankplay.record[`${this.props.championName}`]
        .영웅별 === undefined
    ) {
      return alert(
        "해당 영웅의 레코드가 존재하지 않습니다. 유저 데이터를 갱신해 주세요"
      );
    }

    keys.forEach((el, i) => {
      let field; // 현재 필드
      if (el === "_id") return;

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

      const width = 400;
      const height = 400;
      const bar_width = 50;

      // svg 생성
      const bar_graph = d3
        .select("#viz")
        .append("svg")
        .attr("id", `${this.props.championName}_${i}`)
        .attr("width", width)
        .attr("height", height)
        .attr("class", "svg-graph")
        .style("border", "1px lightgray solid");

      // bar-graph의 타이틀 생성
      bar_graph
        .append("text")
        .attr("y", 24)
        .attr("class", "text chart-header")
        .html(d => {
          if (!el.includes("_")) {
            return el;
          }
          const tokens = el.split("_");
          return `${tokens[0]} ${tokens[1]}`;
        });

      // g생성하고 그 안에 또 g를 생성(막대 그래프+라벨 포함) 생성
      const bar_graph_g = d3
        .select(`#${this.props.championName}_${i}`)
        .append("g")
        .attr("class", `bar_graph`);

      // 막대에 대한 설명 추가
      // 해당 막대가 어떤 범주를 말하는지 보여준다
      const reference_g = bar_graph_g
        .selectAll("g")
        .data(["최소", "플레이어", "평균", "최대"])
        .enter()
        .append("g")
        .attr("class", "reference_graph");
      reference_g
        .append("rect")
        .attr("width", 20)
        .attr("height", 5)
        .attr("y", (d, i) => height / 3 - 30 * i + 34)
        .style("fill", (d, i) => {
          if (i === 0) return "#0b8457";
          else if (i === 1) return "#10316b";
          else if (i === 2) return "#eac100";
          else if (i === 3) return "#d65a31";
        });
      reference_g
        .append("text")
        .attr("x", 25)
        .attr("y", (d, i) => height / 3 - 30 * i + 40)
        .attr("class", "text")
        .style("font-size", "14px")
        .html(d => d);

      // 각 막대를 저장하는 g 를 bars 라는 변수에 할당
      const bars = bar_graph_g
        .selectAll(".bar_graph")
        .data(dataSet)
        .enter()
        .append("g")
        .attr("class", (d, i) => {
          if (i === 1) {
            /*if (Number(d[0]) < Number(avg)) {
              return "bar my_bar lt";
            } else if (Number(d[0]) >= Number(avg)) {
              return "bar my_bar gte";
            }*/
            return "bar my_bar";
          }
          return "bar";
        })
        .attr("transform", `translate(${width / 2 - bar_width / 2} , 0)`);

      // 각 g 에 막대 할당
      bars
        .append("rect")
        .attr("width", bar_width)
        .attr("y", (d, i) => {
          if (i === 1) {
            return height - championYScale(d[0]);
          }
          return height - championYScale(d);
        })
        .style("fill", (d, i) => {
          if (i === 0) return "#0b8457";
          else if (i === 1) return "#10316b";
          else if (i === 2) return "#eac100";
          else if (i === 3) return "#d65a31";
        })
        .transition()
        .duration(1500)
        .attr("height", (d, i) => {
          if (i === 1) {
            return championYScale(d[0]);
          }
          return 5;
        });

      // 맨 먼저 그려진 min 사각형이 덮여지므로, 다시 그려준다
      const min_bar = document
        .getElementById(`${this.props.championName}_${i}`)
        .getElementsByClassName("bar")[0];
      min_bar.parentNode.appendChild(min_bar);

      // 각 bar 에 라벨(값) 생성
      bars
        .append("text")
        .text((d, i) => {
          if (i === 1) return d[0];
          return d;
        })
        .attr("y", (d, i) => {
          if (i === 1) return height - championYScale(d[0]) + 10;
          return height - championYScale(d) + 10;
        })
        .attr("x", (d, i) => {
          if (i === 1) {
            if (d[0] >= 10000) return -75;
            else if (d[0] >= 1000) return -65;
            else if (d[0] >= 100) return -55;
            return -45;
          }
          return 60;
        })
        .attr("class", (d, i) => {
          if (i === 1) return "my_text text";
          return "text";
        })
        .style("text-anchor", "left");

      // 각 bar 에 라벨(기준) 생성
      /*bars
        .append("text")
        .data(["min", "my", "avg", "max"])
        .text(d => d)
        .attr("y", 390)
        .attr("class", "text")
        .style("text-anchor", "left");*/

      function mouseOver(d) {
        d3.select(this).style("stroke", "white");

        if (typeof d === "object" && d[1] !== undefined) {
          const per = d[1].toFixed(0);

          d3.select(this.parentNode)
            .append("text")
            .attr("class", "text modal")
            .attr("x", -70)
            .attr("y", 320)
            .html(`상위 ${per}%`);
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
