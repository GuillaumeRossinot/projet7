import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { ArticleService } from 'src/app/services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from 'src/app/models/article.model';
//import { Comment } from 'src/app/models/comment.model';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent implements OnInit {
  isLoggedIn = false;
  currentArticle: Article = {
    title: '',
    description: '',
    image: ''
  };
  message = '';

  constructor(
    private ArticleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.message = '';
    this.getArticle(this.route.snapshot.params.id);
  }

  getArticle(id: string): void {
    console.log("içi");
    this.ArticleService.get(id)
      .subscribe(
        data => {
          this.currentArticle = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updateArticle(): void {
    const data = {
      title: this.currentArticle.title,
      description: this.currentArticle.description,
      image: this.currentArticle.image
    };
    this.message = '';

    this.ArticleService.update(this.currentArticle.id, this.currentArticle)
      .subscribe(
        response => {
          console.log(response);
          this.message = response.message ? response.message : 'This article was updated successfully!';
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
          this.router.navigate(['/articles']);
        },
        error => {
          console.log(error);
        });
  }
}
