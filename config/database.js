const mongoose= require('mongoose');
require('dotenv').config();

const dbConnect= ()=>{
    mongoose.connect(process.env.db_url, {})
    .then(()=>{ console.log('db conn succ')})
    .catch(()=> {
        console.log('error in conn with db');
        process.exit(1);
    })
}

module.exports= dbConnect;
