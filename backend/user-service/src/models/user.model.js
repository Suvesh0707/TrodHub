import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
     refreshToken: {       
    type: String,
    default: null
  },
  role : {
    type : String,
    enum : ["user", "admin", "superadmin", "seller", "delivery_person", "customer_support"],
    default : "user"
  }
})

export default mongoose.model("User", userSchema)