import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://cabanajuan:Password123@cluster0.g0qhylu.mongodb.net/planning_poker',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'planning_poker', // Agrega la opción dbName para especificar la base de datos
      }
    );
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
