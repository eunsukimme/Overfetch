const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true }, 
    tag: { type: String, required: true },
    icon: String,
    level: Number,
    update: String,
    rank: {
        val: Number,
        imageSrc: String
    },
    quickplay: {
        type: Object,
        mostChampion: {
            type: Object,
            // 플레이 시간
            byPlaytime: {
                type: Object
                // 챔피언 이름: 값
            },
            // 승리한 게임
            byWinGame: {
                type: Object
            },
            // 명중률
            byHitRate: {
                type: Object
            },
            // 목숨당 처치
            byKD: {
                type: Object
            },
            // 치명타 명중률
            byCriticalHitRate: {
                type: Object
            },
            // 동시 처치 - 최고기록
            byMultiKill: {
                type: Object
            },
            // 임무기여 처치
            byMissionContributeKill: {
                type: Object
            }
        },
        record: {
            type: Object,
            byAllChampion: {
                type: Object,
                // 최고
                best:{
                    type: Object
                },
                // 지원
                assists: {
                    type: Object
                },
                // 전투
                combat: {
                    type: Object
                },
                // 게임
                game: {
                    type: Object
                },
                // 평균
                average: {
                    type: Object
                },
                // 기타
                miscellaneous: {
                    type: Object
                },
                // 경기 보상
                award: {
                    type: Object
                }
            },
            '아나': {
                // 전투
                combat: {

                },
                // 게임
                game: {

                },
                // 최고
                best: {

                },
                // 기타
                miscellaneous: {

                },
                // 경기 보상
                award: {

                },
                // 영웅별
                champion: {

                },
                // 지원
                assists: {

                },
                // 평균
                average: {

                }
            },
            '애쉬': {

            },
            '바스티온': {

            },
            '브리기테': {

            },
            'D-Va': {

            },
            '둠피스트': {

            },
            '겐지': {

            },
            '한조': {

            },
            '정크랫': {

            },
            '루시우': {

            },
            '맥크리': {

            },
            '메이': {

            },
            '메르시': {

            },
            '모이라': {

            },
            '오리사': {

            },
            '파라': {

            },
            '리퍼': {

            },
            '라인하르트': {

            },
            '로드호그': {

            },
            '솔저': {

            },
            '솜브라': {

            },
            '시메트라': {

            },
            '토르비욘': {

            },
            '트레이서': {

            },
            '위도우메이커': {

            },
            '윈스턴': {

            },
            '레킹볼': {

            },
            '자리야': {

            },
            '젠야타': {

            }
        }
    },
    rankplay: {
        mostChampion: {
            // 플레이 시간
            byPlaytime: {
                // 챔피언 이름: 값
            },
            // 승리한 게임
            byWinGame: {
    
            },
            // 명중률
            byHitRate: {
    
            },
            // 승률
            byWinRate: {

            },
            // 목숨당 처치
            byKD: {
    
            },
            // 치명타 명중률
            byCriticalHitRate: {
    
            },
            // 동시 처치 - 최고기록
            byMultiKill: {
    
            },
            // 임무기여 처치
            byMissionContributeKill: {
    
            }
        },
        record: {
            byAllChampion: {
                // 최고
                best:{

                },
                // 지원
                assists: {

                },
                // 전투
                combat: {

                },
                // 게임
                game: {

                },
                // 평균
                average: {

                },
                // 기타
                miscellaneous: {

                },
                // 경기 보상
                award: {

                }
            },
            '아나': {

            },
            '애쉬': {

            },
            '바스티온': {

            },
            '브리기테': {

            },
            'D-Va': {

            },
            '둠피스트': {

            },
            '겐지': {

            },
            '한조': {

            },
            '정크랫': {

            },
            '루시우': {

            },
            '맥크리': {

            },
            '메이': {

            },
            '메르시': {

            },
            '모이라': {

            },
            '오리사': {

            },
            '파라': {

            },
            '리퍼': {

            },
            '라인하르트': {

            },
            '로드호그': {

            },
            '솔저': {

            },
            '솜브라': {

            },
            '시메트라': {

            },
            '토르비욘': {

            },
            '트레이서': {

            },
            '위도우메이커': {

            },
            '윈스턴': {

            },
            '레킹볼': {

            },
            '자리야': {

            },
            '젠야타': {

            }
        }
    }
});

module.exports = mongoose.model('user', userSchema);