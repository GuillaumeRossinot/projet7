import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { ArticleService } from 'src/app/services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from 'src/app/models/article.model';
import { DomSanitizer } from '@angular/platform-browser';
import { UploadFilesService } from 'src/app/services/upload-files.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit {
  currentArticle: Article = {
    title: '',
    description: '',
    image: ''
  };
  article: Article = {
    image: ''
  };
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  imagePost: any;
  fileInfos?: Observable<any>;
  imageToUpdate = false;

  constructor(
    private ArticleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private sanitizer: DomSanitizer,
    private uploadService: UploadFilesService) { }

  ngOnInit(): void {
    this.message = '';
    this.getArticle(this.route.snapshot.params.id);
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateImage(): void {
    this.imageToUpdate = true;
  }

  upload(idPost: any): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile, idPost).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          });

      }

      this.selectedFiles = undefined;
    }
  }

  getArticle(id: string): void {
    this.ArticleService.get(id)
      .subscribe(
        data => {
          this.currentArticle = data;
          this.imagePost = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.currentArticle.imageEncoded}`);
          //  console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updateArticle(): void {
    this.message = '';
    if (this.imageToUpdate) {
      this.currentArticle.imageEncoded = '';
    }
    delete this.currentArticle.imageEncoded;
    console.log("this.currentArticle.imageEncoded " + this.currentArticle.imageEncoded);
    this.ArticleService.update(this.currentArticle.id, this.currentArticle)
      .subscribe(
        response => {
          //  console.log("response" + response);
          this.message = response.message ? response.message : 'This Article was updated successfully!';
          if (this.imageToUpdate) { this.upload(this.currentArticle.id); }
          this.redirectArticle();
        },
        error => {
          console.log(error);
        });
  }

  deleteArticle(): void {
    this.ArticleService.delete(this.currentArticle.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/post']);
        },
        error => {
          console.log(error);
        });
  }

  redirectArticle(): void {
    (async () => {

      await this.delay(1000);
      window.location.href = "/post/" + this.currentArticle.id;

    })();
  }
}


