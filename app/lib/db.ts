import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI ortam değişkeni tanımlanmamış!");
}

export const connectDB = async () => {
  try {
    const { connection } = mongoose;

    if (connection.readyState === 1) {
      console.log("MongoDB bağlantısı zaten aktif.");
      return;
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    await mongoose.connect(MONGODB_URI, options);

    connection.on("connected", () => {
      console.log("MongoDB bağlantısı başarılı.");
    });

    connection.on("error", (err) => {
      console.error("MongoDB bağlantı hatası:", err);
    });

    connection.on("disconnected", () => {
      console.log("MongoDB bağlantısı kesildi.");
    });

    // Uygulama kapandığında bağlantıyı düzgün şekilde kapat
    process.on("SIGINT", async () => {
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
    throw error;
  }
};
