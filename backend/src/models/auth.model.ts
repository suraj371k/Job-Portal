import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'employer';
  googleId?: string;
  picture?: string;
  isGoogleUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const authSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ['user', 'employer'],
      default: 'user',
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    picture: {
      type: String,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

authSchema.pre('save', function (this: IUser, next) {
  if (!this.isGoogleUser && !this.password) {
    return next(new Error('Password is required for non-Google users'));
  }
  next();
});

const Auth = mongoose.model<IUser>('Auth', authSchema);

export default Auth;
