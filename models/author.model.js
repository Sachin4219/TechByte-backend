import mongoose from "mongoose"

let AuthorSchema = mongoose.Schema( {
    name: { type: String },
    photo: { type: String },
    bio: { type: String },
    username: { type: String, index: true },
    email: { type: String, index: true },
    posts: [ { type: mongoose.Schema.Types.ObjectId, ref: 'post' } ],
    password: { type: String }
} );

let Author = mongoose.model( 'author', AuthorSchema );


export default Author;
