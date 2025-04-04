import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { sample } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule], // Add CommonModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  isLoading: boolean = false;
  coverTemplate: string = 
`Write a cover letter based on the provided resume and job description.
Your response should only be the cover letter.
The cover letter should follow this format:

[Your Name]
[City, State, Zip Code]  
[Your Email Address]  
[Your Phone Number]  

[Date]

[Hiring Manager's Name]  
[Company Name]  
[Company Address (omit this bracket if unknown)]
[City, State, Zip Code (omit this bracket if unknown)]

Dear [Hiring Manager's Name or Hiring Team],

[Cover Letter Body]

Best Regards,
[Your Name]`;

  constructor(private http: HttpClient) {}

  selectedResume: File | null = null;
  jobDescription: string = '';

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedResume = file;
    }
  }

  generatedCoverLetter: string = '';

  setGeneratedResults(coverLetter: string): void {
    this.generatedCoverLetter = coverLetter;
  }

  generateDocuments(): void {
    console.log("generating");
    if (this.selectedResume && this.jobDescription) {
      this.isLoading = true; // Set loading to true before starting the request
  
      const formData = new FormData();
      formData.append('resume', this.selectedResume);
      formData.append('jobDescription', this.jobDescription);
      formData.append('coverTemplate', this.coverTemplate); // Send custom prompt

      this.http.post<any>('http://localhost:5687/job-assist/generate-cl', formData).subscribe((response: any) => {
        this.setGeneratedResults(response.generatedCoverLetter);
        console.log(response.generatedCoverLetter);
  
        this.isLoading = false; // Set loading to false when the response is received
      }, (error: any) => {
        this.isLoading = false; // Set loading to false in case of error
        alert('An error occurred while generating the cover letter.');
      });
    } else {
      alert('Please upload a resume and enter a job description.');
    }
  }
}