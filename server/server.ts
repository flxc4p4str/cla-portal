
import * as express from 'express';
import {Application} from "express";
import {getAllCourses, getCourseById, getAllDETMACH0, getAllDETMACH2} from "./get-courses.route";
import {searchLessons} from "./search-lessons.route";
import {saveCourse} from './save-course.route';
import {loginUser} from './login.route';
import {createCourse} from "./create-course.route";
import {deleteCourse} from "./delete-course.route";
import {saveLesson} from "./save-lesson.route";

const bodyParser = require('body-parser');

const app: Application = express();

app.use(bodyParser.json());

const cors = require('cors');

app.use(cors({origin: true}));

// http://localhost:9001/api/DETMACH0 - note that this server does not support https
app.route('/api/DETMACH0').get(getAllDETMACH0);
app.route('/api/DETMACH2').get(getAllDETMACH2);

app.route('/api/courses').get(getAllCourses);

app.route('/api/courses').post(createCourse);

app.route('/api/courses/:id').get(getCourseById);

app.route('/api/search-lessons').get(searchLessons);

app.route('/api/courses/:id').put(saveCourse);

app.route('/api/courses/:id').delete(deleteCourse);

app.route('/api/lessons/:id').put(saveLesson);

app.route('/api/login').post(loginUser);

const httpServer = app.listen(9001, () => {
  console.log("HTTP REST API Server running at http://localhost:" + httpServer.address()["port"]);
});
