import React from 'react';
import cheerio from 'cheerio';

export class Main extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: '기운찬곰',
            tag: '36941',
            data: { quickplay: { mostChampion: {} }, rankplay: { mostChampion: {} } }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    async handleSubmit(e){
        e.preventDefault();
        //const cors = 'https://cors-anywhere.herokuapp.com/';
        //const url = cors + 'https://playoverwatch.com/ko-kr/career/pc/'
        //            +this.state.name+'-'+this.state.tag;
        const name = this.state.name;
        const tag = this.state.tag;
        const url = 'http://localhost:5000/users?name='+name+'&tag='+tag;        
        this.fetchData(url);
    }

    fetchData(url){

        fetch(url)
        .then(res => res.json())
        .then(user => {
            if(user.error){
                console.log(user);
                console.log(user.error);
                alert(user.error);
                return;
            }
            console.log(user);
            // 반환된 data는 DB에 저장된 혹은 갱신된 유저 정보 오브젝트이다
            // Object.keys(obj)를 활용하여 각 속성을 iterate 하자
            //console.log(Object.keys(user));
            // 각각 빠른대전/경쟁전 모스트 챔피언 정보 오브젝트
            const quick_most = user.quickplay.mostChampion;
            const rank_most = user.rankplay.mostChampion;
            // 리스트로 뿌려주기 쉽게 배열로 저장된 데이터를 저장하는 정보 오브젝트
            const _quickplay = {};
            const _rankplay = {};

            const _quickplay_mostChampion = {};
            const _rankplay_mostChampion = {};

            Object.keys(quick_most).forEach( (el, i) => {
                const criteria_name = el;       // string
                const criteria_obj = quick_most[el];    // object
                const criteria_value = Object.keys(criteria_obj).map( (_el, _i) => {    // array
                    return <li>{_el + ' - ' + criteria_obj[_el]}</li>;
                    // 위 로직은 [ '아나 - 20%', 'D-va - 15%' ... ] 와 같은 배열을 만든다
                });
                _quickplay_mostChampion[criteria_name] = criteria_value;
            });

            Object.keys(rank_most).forEach( (el, i) => {
                const criteria_name = el;       // string
                const criteria_obj = rank_most[el];    // object
                const criteria_value = Object.keys(criteria_obj).map( (_el, _i) => {    // array
                    return <li>{_el + ' - ' + criteria_obj[_el]}</li>;
                    // 위 로직은 [ '아나 - 20%', 'D-va - 15%' ... ] 와 같은 배열을 만든다
                });
                _rankplay_mostChampion[criteria_name] = criteria_value;
            });

            _quickplay['mostChampion'] = _quickplay_mostChampion;
            //_quickplay['record'] = ???
            _rankplay['mostChampion'] = _rankplay_mostChampion;
            // _rankplay['record'] = ???

            this.setState({
                data: { 
                    rank: user.rank,
                    name: user.name,
                    tag: user.tag,
                    quickplay: _quickplay,
                    rankplay: _rankplay
                }
            });
        });
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleUpdate(e){
        const name = this.state.name;
        const tag = this.state.tag;
        const url = 'http://localhost:5000/users?name='+name+'&tag='+tag+'&update=true';
        this.fetchData(url);
    }

    render(){
        return (
            <div>
                <form onSubmit={this.handleSubmit} >
                    <h1>닉네임</h1>
                    <input placeholder="닉네임" type='text' name='name' onChange={this.handleChange}/>
                    <h1>배틀태그</h1>
                    <input placeholder="배틀태그" type='text' name='tag' onChange={this.handleChange}/>
                    <button type='submit'>Submit</button>
                </form>
                <button onClick={this.handleUpdate}>갱신</button>
                <div id='data-field'>
                    <h1>영웅 정보</h1>
                    <div>
                        <h2>Name: {this.state.data.name}</h2>
                        <h2>Rating: {this.state.data.rank}</h2>
                    </div>
                    <div id='quickplay'>
                        <h1>빠른대전</h1>
                        <div className='champion-list'>
                            <h2>Most Champion</h2>
                            <h3>명중률</h3>
                            <ol>
                                {this.state.data.quickplay.mostChampion.byHitRate}
                            </ol>
                        </div>
                    </div>
                    <div id='competitive'>
                        <h1>경쟁전</h1>
                        <div className='champion-list'>
                            <h2>Most Champion</h2>
                            <h3>명중률</h3>
                            <ol>
                                {this.state.data.rankplay.mostChampion.byHitRate}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}