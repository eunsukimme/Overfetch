const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String, 
    tag: String,
    level: {
        imageURL: String,
        value: Number
    },
    rank: Number,
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
            byAna: {
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
            byAshe: {

            },
            byBastion: {

            },
            byBrigitte: {

            },
            byDva: {

            },
            byDoomfist: {

            },
            byGenji: {

            },
            byHanzo: {

            },
            byJunkrat: {

            },
            byLucio: {

            },
            byMccree: {

            },
            byMei: {

            },
            byMercy: {

            },
            byMoira: {

            },
            byOrisa: {

            },
            byPharah: {

            },
            byReaper: {

            },
            byReinhardt: {

            },
            byRoadhog: {

            },
            bySoldier: {

            },
            bySombra: {

            },
            bySymmetra: {

            },
            byTorbjorn: {

            },
            byTracer: {

            },
            byWidowmaker: {

            },
            byWinston: {

            },
            byWreckingBall: {

            },
            byZarya: {

            },
            byZenyatta: {

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
            byAna: {

            },
            byAshe: {

            },
            byBastion: {

            },
            byBrigitte: {

            },
            byDva: {

            },
            byDoomfist: {

            },
            byGenji: {

            },
            byHanzo: {

            },
            byJunkrat: {

            },
            byLucio: {

            },
            byMccree: {

            },
            byMei: {

            },
            byMercy: {

            },
            byMoira: {

            },
            byOrisa: {

            },
            byPharah: {

            },
            byReaper: {

            },
            byReinhardt: {

            },
            byRoadhog: {

            },
            bySoldier: {

            },
            bySombra: {

            },
            bySymmetra: {

            },
            byTorbjorn: {

            },
            byTracer: {

            },
            byWidowmaker: {

            },
            byWinston: {

            },
            byWreckingBall: {

            },
            byZarya: {

            },
            byZenyatta: {
                
            }
        }
    }
});

module.exports = mongoose.model('user', userSchema);