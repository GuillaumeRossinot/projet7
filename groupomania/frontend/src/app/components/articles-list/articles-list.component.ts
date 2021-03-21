import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {
  articles?: Article[];
  currentArticle?: Article;
  currentIndex = -1;
  title = '';

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    this.retrieveArticles();
  }

  retrieveArticles(): void {
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

  goToArticle(index: number): void {
    window.location.href = '/post/' + index;
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
