import React from 'react';
import request from 'request';
import cheerio from 'cheerio';

export class Main extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: '기운찬곰',
            tag: '311530'
        }
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeTag = this.handleChangeTag.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(e){
        e.preventDefault();
        const cors = 'https://cors-anywhere.herokuapp.com/';
        const url = cors + 'https://playoverwatch.com/ko-kr/career/pc/'
                    +this.state.name+'-'+this.state.tag;
        /*const response = await fetch(url);
        console.log(response);
        const jsonResponse = await response.text();
        console.log(jsonResponse);*/
        request(url, (error, response, body) => {
            if(error) console.warn(error);

            console.log(body);
            const $ = cheerio.load(body);
            console.log($('div .ProgressBar-bar', 'div', $('#quickplay')).text());
        })

    }

    handleChangeName(e){
        this.setState({
            name: e.target.value
        })
    }

    handleChangeTag(e){
        this.setState({
            tag: e.target.value
        })
    }

    render(){
        return (
            <div>
                <form onSubmit={this.handleSubmit} >
                    <h1>닉네임</h1>
                    <input placeholder="닉네임" type='text' onChange={this.handleChangeName}/>
                    <h1>배틀태그</h1>
                    <input placeholder="tag" type='text' onChange={this.handleChangeTag}/>
                    <button type='submit'>Submit</button>
                </form>
                <div id='data-field'>
                    <h1>Most Champion</h1>
                    <div id='most-champion'>
                    </div>
                </div>
            </div>
        )
    }
}