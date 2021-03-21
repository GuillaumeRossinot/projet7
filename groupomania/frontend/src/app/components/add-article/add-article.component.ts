import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';


@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {
  article: Article = {
    title: '',
    description: '',
    image: ''
  };
  submitted = false;

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
  }

  saveArticle(): void {
    const data = {
      title: this.article.title,
      description: this.article.description,
      image: this.article.image
      //userId: 
    };

    this.articleService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

  newArticle(): void {
    this.submitted = false;
    this.article = {
      title: '',
      description: '',
      image: ''
    };
  }

}
