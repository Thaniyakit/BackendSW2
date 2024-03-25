const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    name: {
        type : String,
        require: [true,'Please add name'],
        unique: true,
        trim: true,
        maxlength:[50, 'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required: [true, 'Please add an address']
    },
    district:{
        type: String,
        required: [true,'Please add a district']
    },
    province:{
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode:{
        type: String,
        required: [true, 'Please add a postalcode'], maxlength:[5,'Postal Code can not be more than5 digits']
    },
    tel:{
        type: String,
        required: [true, 'Please add a tel']
    },
    region:{
        type: String,
        required: [true, 'Please add a region']
    },
    provider:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please add provider']
    },
    licensePlate: {
        type:String,
        require:[true, 'Please add licensePlate'],
        unique:true
    },
    image: {
        type:String,
        require:[true, 'Please add image src']
    }
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

//Cascade delete bookings when a car is deleted
CarSchema.pre('deleteOne',{document: true, query: false}, async function(next){
    
    console.log(`Booking being removed from car ${this.id}`);

    await this.model('Booking').deleteMany({car: this.id});

    next();
});

//Reverse populate with virtuals
CarSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'car',
    justOne:false
});

module.exports=mongoose.model('Car',CarSchema);