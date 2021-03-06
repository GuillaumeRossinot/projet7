import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {
  articles: Article[] = [];
  currentArticle?: Article;
  currentIndex = -1;
  title = '';
  imagePost: any;
  error = '';

  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];

  constructor(private articleService: ArticleService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.retrieveArticles();
  }

  getRequestParams(searchTitle: string, page: number, pageSize: number): any {
    let params: any = {};

    if (searchTitle) {
      params[`title`] = searchTitle;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }


  retrieveArticles(): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.articleService.getAll(params)
      .subscribe(
        data => {
          const { posts, totalItems } = data;
          this.articles = posts;
          this.count = totalItems;
          this.articles.forEach(element => {
            element.imageEncoded2 = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${element.imageEncoded}`);
          });
        },
        error => {
          this.error = error;
        });
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveArticles();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveArticles();
  }

  refreshList(): void {
    this.retrieveArticles();
    this.currentArticle = undefined;
    this.currentIndex = -1;
  }

  goToArticle(index: number): void {
    window.location.href = '/post/' + index;
  }

  searchTitle(): void {
    this.currentArticle = undefined;
    this.currentIndex = -1;

    this.articleService.findByTitle(this.title)
      .subscribe(
        data => {
          this.articles = data;
        },
        error => {
          this.error = error;
        });
  }

}
