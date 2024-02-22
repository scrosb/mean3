import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../../../models/post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //     {title: 'First Post', content:'this is the first post content'},
  //     {title: 'Second Post', content:'this is the Second post content'},
  //     {title: 'Third Post', content:'this is the Third post content'}
  // ];

  posts: Post[] = [];
  private postsSub: Subscription;
  // any posts = any[];
  isLoading = false;
  //function called when angular creates a new instance of the component.
  constructor(public postsService: PostsService) {
    // this.postsServices = postsService
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
  //Angular executes this when its done
  ngOnInit() {
    //trigger the http request
    this.isLoading = true;
    this.postsService.getPosts();
    //subscribe takes 3 args, data emitted, error emitted, observalble completed.
    //Updates post when we received a new value from post-create.
    //SUBSCRIBE TO THE OBSERVABLE FROM POSTS SERVICE.
    //This is the logic we want to execute whenever next is executed on the subject.
    //this is the observer, we can also throw an error, or emit a complete event.
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }
  //Remove Subscription and prevent memory leaks.
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
