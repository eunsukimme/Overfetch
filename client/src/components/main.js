import React from 'react';
import cheerio from 'cheerio';

export class Main extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: '기운찬곰',
            tag: '36941',
            most: []
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


        fetch(url)
        .then(res => res.text())
        .then(data => {
            const $  = cheerio.load(data);

            console.log($('.masthead-player-progression').find('.competitive-rank > div').html());
        });
        
        
        /*request(url, (error, response, body) => {
            if(error) console.warn(error);
            const $ = cheerio.load(body);

            // 만약 유저 프로필을 찾았다면 body의 클래스는 career-detail 이다
            // 만약 유저 프로필을 못 찾았다면 body의 클래스는 ErrorPage 이다
            if($('body').attr('class').includes('ErrorPage')){
                alert('프로필을 찾을 수 없습니다. 닉네임과 배틀태그를 다시 확인하세요');
                return;
            }
            
            const _most_champion = {};
            // 빠른대전의 현재 보이는 모든 기록을 가져온다
            //console.log($('#quickplay').find('.is-active').text());
            // 현재 플레이어 정보(티어, 레벨을 가져온다)
            const rank = $('.masthead-player-progression').
                            find('.competitive-rank > div').html();
            console.log(rank);

            const quickplay_list = $('#quickplay').find($('hr')).nextUntil('button', '.progress-category');
            console.log(quickplay_list);

            quickplay_list.each( (i, el) => {
                let category;
                let category_result = {};
                switch(i){
                    case 0: 
                        category = 'byPlaytime';
                        break;
                    case 1:
                        category = 'byWinGame';
                        break;
                    case 2:
                        category = 'byHitRate';
                        break;
                    case 3:
                        category = 'byKD';
                        break;
                    case 4:
                        category = 'byCriticalHitRate';
                        break;
                    case 5:
                        category = 'byMultiKill';
                        break;
                    case 6:
                        category = 'byMissionContributeKill';
                        break;
                }
                $(el).find('.ProgressBar').each( (i, el) =>{
                    const championName = $(el).find('div > div').find('.ProgressBar-title').text();
                    const championValue = $(el).find('div > div').find('.ProgressBar-description').text();
                    category_result[championName] = championValue;
                });
                _most_champion[category] = category_result;
            });
            console.log('most champion: ', _most_champion);


            // 현재 기준(플레이시간) 상위 영웅 리스트를 가져온다
            const list = $('#quickplay').find($('.is-active')).find('.ProgressBar');
            list.each((i, el) =>{
                const championName = $(el).find('div > div').find('.ProgressBar-title').text();
                const championValue = $(el).find('div > div').find('.ProgressBar-description').text();
                champion[championName] = championValue;

                const temp = this.state.most;
                temp.push(<li>{championName}  -  {championValue}</li>);
                this.setState({
                    most: temp
                });

            });
            console.log(champion);
        })
        */
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
                    <input placeholder="배틀태그" type='text' onChange={this.handleChangeTag}/>
                    <button type='submit'>Submit</button>
                </form>
                <div id='data-field'>
                    <h1>영웅 정보</h1>
                    <div id='most-champion'>
                        <h2>상위 영웅</h2>
                        <ol>
                            {this.state.most}
                        </ol>
                    </div>
                </div>
            </div>
        )
    }
}