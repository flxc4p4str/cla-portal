import {Request, Response} from 'express';
import {COURSES, DETMACH0, DETMACH2} from "./db-data";



export function getAllCourses(req: Request, res: Response) {

  /*
      console.log("ERROR loading courses!");
      res.status(500).json({message: 'error occurred.'});
      return;
  */



  setTimeout(() => {

    res.status(200).json({courses:Object.values(COURSES)});

  }, 1500);


}


export function getAllDETMACH0(req: Request, res: Response) {
  console.log("loading Devices!");
  setTimeout(() => {
    res.status(200).json({DETMACH0:Object.values(DETMACH0)});
  }, 1500); 
}

export function getAllDETMACH2(req: Request, res: Response) {
  console.log("loading Machines!");
  setTimeout(() => {
    res.status(200).json({DETMACH2:Object.values(DETMACH2)});
  }, 1500);
}

export function getCourseById(req: Request, res: Response) {

  setTimeout(() => {
    const courseId = req.params["id"];

    const courses:any = Object.values(COURSES);

    const course = courses.find((course:any) => course.id == courseId);

    res.status(200).json(course);
  }, 1500);

}
