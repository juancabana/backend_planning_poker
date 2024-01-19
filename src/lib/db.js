import mongoose from 'mongoose';
 
export const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://cabanajuan:Password123@cluster0.j8ip3h2.mongodb.net/planning_poker'
    );
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};
