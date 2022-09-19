import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import AuthRouter from './modules/Auth/AuthRouter';

dotenv.config();
const App = express();
App.use(bodyParser.json());
App.use(express.static('public'));
App.use('/api', AuthRouter());
App.listen(process.env.PORT, () => {
	  console.log(`Server is running on port ${process.env.PORT}`);
});
