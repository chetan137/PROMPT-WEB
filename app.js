const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const path = require('path');
const app = express();

const MONGODB_URI = config.MONGODB_URI;
const cookieParser = require('cookie-parser');

main().then(() => {
  console.log('MongoDB connected...');
}).catch((err) => {
  console.log(`MongoDB connection error: ${err}`);
  process.exit(1);
});

async function main() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const certificateRoutes = require('./routes/certificateRoutes');


app.use('/', certificateRoutes);

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/questions', require('./routes/questions'));

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
