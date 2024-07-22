import dotenv from 'dotenv';
import { app } from "./app.js"
import connectDb from "./db/index.js";

dotenv.config({
    path: "./.env"
});


connectDb().then(() => {
    app.on("error",(error) => {
        console.log("Express Side Error : ", error);
        throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on PORT : ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log('MongoDB connection Failed : ', error);
  });