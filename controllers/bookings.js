const Booking = require('../models/Booking');
const Car = require('../models/Car');

//@desc Get all Booking
//@route Get /api/v1/booking
//@access Private
exports.getBookings = async (req,res,next)=>{
    let query;
    //General user can see only their appointments!
    if(req.user.role !== 'admin' && req.user.role !== 'provider') {
        query = Booking.find({user:req.user.id}).populate({
            path:'car',
            select:'name province tel'
        });
    } else {
            if(req.user.role === "provider"){
                let myid = (await Car.find({provider:req.user.id},{_id:1})).toLocaleString();
                let array = (await myid).split("'");
                const array1 = [];
                for(let i = 0;i < array.length;i++){
                    if(i%4 === 3) array1.push(array[i]);
                }

                query = Booking.find({car:array1}).populate({
                    path:'car',
                    select:'name province tel'
                });
            } else if(req.user.role === "admin")
            {
                if(req.params.carID) {
                    console.log(req.params.carID);
                    query = Booking.find({car:req.params.carID}).populate({
                        path:'car',
                        select:'name province tel'
                    });
                } else {
                    query = Booking.find().populate({
                        path:'car',
                        select:'name province tel'
                    });
                }
            }
        }
    try {
        const bookings = await query;

        res.status(200).json({
            success:true,
            count: bookings.length,
            data:bookings
        })
    } catch(err) {
        console.log(err.stack);
        return res.status(500).json({
            success:false,
            massage:'Cannot find Booking'
        })
    }
}

//@desc Get one booking
//@route Get /api/v1/booking
//@access Public
exports.getBooking = async (req,res,next)=>{
    try {
        const booking = await Booking.findById(req.params.id).populate({
            path:'car',
            select:'name description tel'
        });

        if(!booking) {
            return res.status(404).json({
                success:false,
                massage: `No booking with the id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success:true,
            data: booking
        })
    } catch(err) {
        console.log(err.stack)
        return res.status(500).json({
            success:false,
            message:'Cannot find Booking'
        })
    }
};

//@desc Add single booking
//@route Post /api/v1/car/:carID/bookings/
//@access Public
exports.addBooking = async (req,res,next)=>{
    try {
        req.body.car = req.params.carId;

        const car = await Car.findById(req.params.carId);
        
        if(!car) {
            return res.status(404).json({success:false, massage: `No car with the id of ${req.params.carID}`})
        }

        req.body.user = req.user.id;
        const existedBooking = await Booking.find({user:req.user.id});
        if(existedBooking.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 bookings`})
        }

        //Check time overlap
        const findCar = await Booking.find({car:req.params.carId});
        // let cant = false;
        // findCar.forEach(element => {
        //     if(new Date(element.startDate) <= new Date(req.body.endDate) && new Date(element.endDate) >= new Date(req.body.endDate)) {
        //         console.log(new Date(element.startDate));
        //         console.log(new Date(req.body.endDate));
        //         cant = true;
        //     }
        //     else if(new Date(element.startDate) <= new Date(req.body.startDate) && new Date(element.endDate) >= new Date(req.body.startDate)) cant = true;
        //     else if(new Date(element.startDate) >= new Date(req.body.startDate) && new Date(element.endDate) <= new Date(req.body.endDate)) cant = true;
        // });
        // if(cant) {
        //     return res.status(400).json({success:false,message:`Car is in use this range time`});
        // }
        
        const booking = await Booking.create(req.body);
        res.status(201).json({success:true,data:booking});
    } catch(err) {
        console.log(err.stack);
        return res.status(500).json({success:false, massage : 'Cannot create booking'})
    }
}

//@desc Update booking
//@route Put /api/v1/bookings/:id
//@access Private
exports.updateBooking = async (req,res,next)=>{
    try {
        let booking = await Booking.findById(req.params.id);

        if(!booking) {
            return res.status(404).json({success:false,message:`No booking with id ${req.params.id}`})
        }

        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to update this booking`})
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true})

        res.status(200).json({success:true, data: booking});
    } catch(err) {
        console.log(err.stack);
        return res.status(500).json({success:false, message : 'Cannot update Booking'})
    }
}

//@desc Delete booking
//@route Delete /api/v1/bookings/:id
//@access Private
exports.deleteBooking = async (req,res,next)=>{
    try {
        const booking = await Booking.findById(req.params.id);

        if(!booking) {
            return res.status(404).json({success:false, message: `No booking with id ${req.params.id}`})
        }

        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to delete this booking`})
        }

        await booking.deleteOne();

        res.status(200).json({success:true, data:{}})
    } catch(err) {
        console.log(err.stack);
        return res.status(500).json({success:false, massage : 'Cannot delete Booking'})
    }
}
