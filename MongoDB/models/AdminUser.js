import mongoose from 'mongoose'
import bcrypt from 'bcrypt';

const AdminSchema = mongoose.Schema({
    user: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    superAdmin: {
        type: Boolean,
        required: true
    },
    token: {
        type: String,
    }
    }
);

AdminSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

AdminSchema.methods.checkPass = async function(passForm){
    return await bcrypt.compare(passForm, this.password);
}

const AdminUser = mongoose.model('AdminUser', AdminSchema);
export default AdminUser