import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAdress: '',
      postalAdress: ''
    }
  };

  isNewStudent = false;
  header = '';
  displayProfileImageUrl= '';

  genderList: Gender[] = [];

  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute, private readonly genderService: GenderService, private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if (this.studentId) {

          if (this.studentId.toLocaleLowerCase() === 'Add'.toLocaleLowerCase())
          {
            this.isNewStudent = true;
            this.header = 'Add New Student';
            this.setImage();

          } else {
            this.isNewStudent = false;
            this.header = 'Edit Student';

            this.studentService.getStudent(this.studentId).subscribe(
              (successResponse) => {
                this.student = successResponse;
                this.setImage();
              },
              (errorResponse) => {
                //if there is any errors
                this.setImage();
              }
            );
          }






          this.genderService.getGenderList()
          .subscribe(
            (successResponse) => {
              this.genderList = successResponse;
            }
          );
        }
      }
    );

  }

  onUpdate(): void
{
  if(this.studentDetailsForm?.form.valid)
  {
    this.studentService.updateStudent(this.student.id, this.student)
    .subscribe(
      (successResponse) => {
        //show notification
        this.snackbar.open('Student has been updated successfully', undefined, {
          duration: 2000
        });
      },
      (errorResponse) => {
        //show error
      }

    );
  }


}



onDelete(): void{
  this.studentService.deleteStudent(this.student.id)
  .subscribe(
    (successResponse) => {
      //show notification
      this.snackbar.open('Student has been deleted successfully', undefined, {
        duration: 2000
      });

      //navigate to student after 2000 (2 seconds)
      setTimeout(()=>{
        this.router.navigateByUrl('students');
      },2000);

    },
    (errorResponse) => {
      //show notification
    }
  );
}

onAdd(): void
{
  if(this.studentDetailsForm?.form.valid)
  {
    //Submit form date to api
    this.studentService.addStudent(this.student)
  .subscribe(
    (succesResponse) => {
      // success Response
      this.snackbar.open('Student has been created successfully', undefined, {
        duration: 2000
      });

      //navigate to student after 2000 (2 seconds)
      setTimeout(()=>{
        this.router.navigateByUrl(`students/${succesResponse.id}`);
      },2000);
    },
    (errorResponse) => {
      // error response
    }
  );
  }

}

uploadImage(event: any): void
{
  if(this.studentId){
    const file: File = event.target.files[0];
    this.studentService.uploadImage(this.student.id, file)
    .subscribe(
      (successResponse) => {
        this.student.profileImageUrl = successResponse;
        this.setImage();

        //show notification
        this.snackbar.open('The profile image has been updated successfully', undefined, {
          duration: 2000
        });
      },
      (errorResponse) => {

      }
    );
  }
}

private setImage(): void
{
  if (this.student.profileImageUrl){
    //fetch the image
    this.displayProfileImageUrl = this.studentService.getImagePath(this.student.profileImageUrl);
  } else {
    //display default
    this.displayProfileImageUrl = '/assets/user.png';
  }
}

}
