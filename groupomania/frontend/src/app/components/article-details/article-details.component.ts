import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { ArticleService } from 'src/app/services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from 'src/app/models/article.model';
import { Comment } from 'src/app/models/comment.model';
import { DomSanitizer } from '@angular/platform-browser';
import { any } from 'sequelize/types/lib/operators';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  currentArticle: Article = {
    title: '',
    description: '',
    image: '',
    imageEncoded: '',
    comment: '',
    user: ''
  };
  message = '';
  imagePost: any;
  userId = '';
  comment: Comment = {
    text: ''
  };
  submitted = false;


  constructor(
    private ArticleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.userId = this.tokenStorageService.getUser().id;
    this.isAdmin = this.tokenStorageService.getUser().isAdmin;
    this.message = '';
    this.getArticle(this.route.snapshot.params.id);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getArticle(id: string): void {
    this.ArticleService.get(id)
      .subscribe(
        data => {
          this.currentArticle = data;
          this.imagePost = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.currentArticle.imageEncoded}`);
        },
        error => {
          console.log(error);
        });
  }

  deleteArticle(): void {
    this.ArticleService.delete(this.currentArticle.id)
      .subscribe(
        response => {
          this.router.navigate(['/post']);
        },
        error => {
          console.log(error);
        });
  }

  saveComment(): void {
    const data = {
      text: this.comment.text,
      postId: this.currentArticle.id
    };

    this.ArticleService.createComment(data)
      .subscribe(
        response => {
          this.submitted = true;
          this.redirectArticle();
        },
        error => {
          console.log(error);
        });
  }

  deleteComment(commentId: string): void {
    this.ArticleService.deleteComment(commentId)
      .subscribe(
        response => {
          console.log(response);
          this.redirectArticle();
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
