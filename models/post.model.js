import mongoose from "mongoose"

let PostSchema = mongoose.Schema( {
    title: { type: String },
    titleimage: { type: String },
    content: { type: String },
    date: { type: Date, default: Date.now },
    tags: [ { type: String } ],
    _author: { type: mongoose.Schema.Types.ObjectId, ref: 'author' }
} );


let Post = mongoose.model( 'post', PostSchema );


export default Post;
