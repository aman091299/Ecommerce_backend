const mongoose=require('mongoose');
const User=require('./user')

const paymentSchema=new mongoose.Schema({
 
       orderId:{
        type:String,
        required:true,
    },
    userId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'User',
       required:true,

    },
    cartId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cart',
        required:true,
    },
    dateOfPayment:{
        type:Date,
       
    },
    address:{
        type:Object,
        require:true,
    },
    status:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
 paymentStatus: {
     type: String, 
     enum: ['Pending', 'Paid'],
      default: 'Pending'
     },
  paymentMode: { 
    type: String,
     enum: ['COD', 'Online'] 
    },
    currency:{
        type:String,
    },
    notes:{
        firstName:{
            type:String,
        },
        lastName:{
            type:String,
        },
        paymentMethod:{
            type:String,
        },
        emailId:{
            type:String,
        }
    }

},{timestamps:true});


const Payment=mongoose.model('Payment',paymentSchema);

module.exports=Payment;