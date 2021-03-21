import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  articles?: Article[];
  currentArticle?: Article;
  currentIndex = -1;
  title = '';

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    this.retrieveArticles();
  }

  retrieveArticles(): void {
    console.log("içi");
    debugger;
    this.articleService.getAll()
      .subscribe(
        data => {
          this.articles = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrieveArticles();
    this.currentArticle = undefined;
    this.currentIndex = -1;
  }

  setActiveArticle(article: Article, index: number): void {
    this.currentArticle = article;
    this.currentIndex = index;
  }

  removeAllArticles(): void {
    this.articleService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }

  searchTitle(): void {
    this.currentArticle = undefined;
    this.currentIndex = -1;

    this.articleService.findByTitle(this.title)
      .subscribe(
        data => {
          this.articles = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

}
