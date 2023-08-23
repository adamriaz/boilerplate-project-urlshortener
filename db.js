const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;
const AutoIncrement = require('mongoose-sequence')(mongoose);
try {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (e) {
    console.log(e);
}

const linkSchema = new mongoose.Schema({
    urlId: {
        type: Number,
        unique: true
    },
    url: {
        type: String,
        required: true
    }
});
linkSchema.plugin(AutoIncrement, { inc_field: "urlId" })

const Link = mongoose.model('Link', linkSchema);

exports.mongoose = mongoose;
exports.Link = Link;