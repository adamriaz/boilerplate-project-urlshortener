const yup = require('yup');
const linkSchema = yup.object({
    url: yup.string().url("invalid url").required()
});

exports.linkSchema = linkSchema;