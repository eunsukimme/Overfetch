const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const averageSchema = new Schema({
    bronze: {
        type: Object,
        champion: {
            type: Object
        }
    },
    silver: {
        type: Object,
        champion: {
            type: Object
        }

    },
    gold: {
        type: Object,
        champion: {
            type: Object
        }

    },
    platinum: {
        type: Object,
        champion: {
            type: Object
        }

    },
    diamond: {
        type: Object,
        champion: {
            type: Object
        }

    },
    master: {
        type: Object,
        champion: {
            type: Object
        }

    },
    grandmaster: {
        type: Object,

    }
})