let p = {
    title: String,
    page: String,
    ip: String,

    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
}

module.exports = 'ErrorCaught';