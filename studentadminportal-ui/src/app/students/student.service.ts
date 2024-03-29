import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/api-models/student.model';
import { updateStudentRequest } from '../models/api-models/update-student-request.model';
import { addStudentRequest } from '../models/api-models/add-student-request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(private httpClient: HttpClient) { }

  getStudents(): Observable<Student[]>{
    return this.httpClient.get<Student[]>(this.baseApiUrl + '/students');
  }

  getStudent(studentId: string): Observable<Student> {
     return this.httpClient.get<Student>(this.baseApiUrl + '/students/' + studentId);
  }


  updateStudent(studentId: string, studentRequest: Student): Observable<Student>{
    const updateStudentRequest: updateStudentRequest = {
      firstName: studentRequest.firstName,
      lastName: studentRequest.lastName,
      dateOfBirth: studentRequest.dateOfBirth,
      email: studentRequest.email,
      mobile:studentRequest.mobile,
      genderId:studentRequest.genderId,
      physicalAdress: studentRequest.address.physicalAdress,
      postalAdress:studentRequest.address.postalAdress
    }

    return this.httpClient.put<Student>(this.baseApiUrl + '/students/' + studentId, updateStudentRequest);

  }

  deleteStudent(studentId: string): Observable<Student>{
    return this.httpClient.delete<Student>(this.baseApiUrl + '/students/' + studentId);
  }

  addStudent(studentRequest: Student):Observable<Student>
  {
    const addStudentRequest: addStudentRequest = {
      firstName: studentRequest.firstName,
      lastName: studentRequest.lastName,
      dateOfBirth: studentRequest.dateOfBirth,
      email: studentRequest.email,
      mobile:studentRequest.mobile,
      genderId:studentRequest.genderId,
      physicalAdress: studentRequest.address.physicalAdress,
      postalAdress:studentRequest.address.postalAdress
    };


    return this.httpClient.post<Student>(this.baseApiUrl + '/students/add', addStudentRequest);

  }

  uploadImage(studentId: string, file: File): Observable<any>
  {
    const formData = new FormData();
    formData.append("profileImage", file);

    return this.httpClient.post(this.baseApiUrl + '/students/' + studentId + '/upload-image', formData, {
      responseType: 'text'
    });
  }

  getImagePath(relativePath: string)
  {
    return `${this.baseApiUrl}/${relativePath}`;
  }

}
