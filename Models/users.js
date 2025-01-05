import mongoose from 'mongoose'

const farms=new mongoose.Schema({
    name:{type:String,default:"Farm A"}
})

const organisations_schema=new mongoose.Schema({
    name:{type:String,required:true},
    farms: [farms]
    
})

const users_schema= new mongoose.Schema({
    email:{type:String, default:'' },
    phone:{type:String, default:'' },
    display_name:{type:String, default:'' },
    photoURL:{type:String, default:'' },
    organisations:[organisations_schema],
})

export default mongoose.model('users',users_schema)