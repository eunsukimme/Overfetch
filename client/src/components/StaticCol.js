import React, { Component } from "react";
import * as d3 from "d3";
import "./css/statistics_col.css";

export class StaticCol extends Component {
  componentDidMount() {
    this.visualization();
  }

  visualization() {
    const val = this.props.value;
    const width = 70; // %값임
    const height = 40; // px값임
    const kdScale = d3
      .scaleLinear()
      .domain([0, 5])
      .range([0, 100])
      .clamp(true);
    // svg를 생성한다
    const svg = d3
      .select(`#${this.props.en_name}`)
      .append("svg")
      .attr("class", "statistics_svg")
      .attr("width", `${width}%`)
      .attr("height", height)
      .style("border", "1px solid darkgray");
    // g를 생성한다
    const g = svg
      .selectAll("g")
      .data([val])
      .enter()
      .append("g")
      .attr("class", "statistics_g");
    // 막대(rect)를 생성한다
    const bar = g
      .append("rect")
      .attr("height", height)
      .transition()
      .duration(1500)
      .style("fill", "#10316b")
      .attr("width", d => {
        if (this.props.criteria === "kd") {
          return `${kdScale(d)}%`;
        }
        return `${d}%`;
      });

    // 마우스 오버 함수 등록
    function mouseOver_kd(d) {
      const kd = d.toFixed(2);
      d3.select(this).style("stroke", "white");

      d3.select(this.parentNode)
        .append("text")
        .attr("class", "text modal")
        .attr("x", d => `${kdScale(d) + 5}%`)
        .attr("y", 22)
        .html(`${kd}:1`);
    }
    function mouseOver(d) {
      const per = d.toFixed(0);
      d3.select(this).style("stroke", "white");

      d3.select(this.parentNode)
        .append("text")
        .attr("class", "text modal")
        .attr("x", d => `${d + 5}%`)
        .attr("y", 22)
        .html(`${per}%`);
    }
    function mouseOut(d) {
      d3.select(this).style("stroke", "none");
      d3.select(this.parentNode)
        .select(".modal")
        .remove();
    }
    if (this.props.criteria === "kd") {
      g.selectAll("rect")
        .on("mouseover", mouseOver_kd)
        .on("mouseout", mouseOut);
    } else {
      g.selectAll("rect")
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut);
    }
  }

  render() {
    return (
      <tr
        className={
          this.props.type === "odd"
            ? "statistics-card odd"
            : "statistics-card even"
        }
      >
        <td className="statistics-card-order">{this.props.order}</td>
        <td>
          <img
            className="statistics-card-image"
            src={`https://d1u1mce87gyfbn.cloudfront.net/hero/${this.props.en_name}/icon-portrait.png`}
            alt="statistics-card"
          />
        </td>
        <td className="statistics-card-name">{this.props.name}</td>
        <td className="statistics-card-rate">
          <div id={this.props.en_name} />
        </td>
        <td>
          <div className="statistics-card-value">
            {this.props.value.toFixed(2)}
          </div>
        </td>
      </tr>
    );
  }
}
