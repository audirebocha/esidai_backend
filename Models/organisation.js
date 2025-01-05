import mongoose from 'mongoose'

const farms_data=new mongoose.Schema({
    date:{type:Date,default: Date.now},
    sensor_name:{type:String,default:""},
    sensor_id:{type:String,default:""},
    humidity:{type:String,default:""},
    temp:{type:String,default:""},
    co2:{type:String,default:""},
})


const farms=new mongoose.Schema({
    name:{type:String,default:"Farm A"},
    data:[farms_data]
})

const organisations_schema=new mongoose.Schema({
    owner:{type:String,required:true},
    name:{type:String,required:true},
    farms: [farms]
})

export default mongoose.model('organisations',organisations_schema)