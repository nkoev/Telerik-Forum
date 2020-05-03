import { Routes, Router } from "@angular/router";
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PostDataService } from './post-data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SharedModule } from "../../shared/modules/shared.module";
import { of } from 'rxjs';
import { CommentsModule } from "../comments/comments.module";
import { PostShow } from "./models/post-show.model";

describe('PostDataService', () => {

    // const routes: Routes = [
    //     { path: '', redirectTo: 'posts', pathMatch: 'full' },
    //     { path: 'posts', component: AllPostsComponent },
    // ];

    const http = {
        get: jest.fn().mockReturnThis(),
        put: jest.fn().mockReturnThis(),
        post: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
    };

    const post = {
        id: 1,
        title: 'a',
        content: 'b',
        user: {},
        votes: [],
        commentsCount: 0,
        flags: [],
        createdOn: new Date(),
        isLocked: false,
    };
    const postsURL: string = 'http://localhost:3000/posts';

    let getService: () => PostDataService;
    let router: Router;

    beforeEach(() => {
        // clear all spies and mocks
        jest.clearAllMocks();

        TestBed.configureTestingModule({
            imports: [
                // RouterTestingModule.withRoutes(routes),
                SharedModule,
                // CommentsModule,
            ],
            declarations: [AllPostsComponent],
            providers: [
                PostDataService,
                HttpClient,
            ]
        })
            .overrideProvider(HttpClient, { useValue: http })
            .compileComponents();

        getService = () => TestBed.get(PostDataService);
        // router = TestBed.get(Router);
    });


    describe('getAllPosts should', () => {

        it('call http.get with the correct parameters', () => {

            const posts = [post];

            jest.spyOn(http, 'get').mockImplementation(() => of({ posts }));

            const service = getService();
            const params = new HttpParams().set('limit', `1`).set('offset', `0`);

            service.getAllPosts(1, 0);

            expect(http.get).toHaveBeenCalledTimes(1);
            expect(http.get).toHaveBeenCalledWith(`${postsURL}`, { params: params });
        });

        it('return an array of posts on subscribe', () => {

            const posts = [post];

            jest.spyOn(http, 'get').mockImplementation(() => of(posts));

            const service = getService();
            const params = new HttpParams().set('limit', `1`).set('offset', `0`);

            let result: PostShow[];
            service.getAllPosts(1, 0).subscribe({
                next: res => { result = res },
                error: err => { return err }
            });

            expect(result).toEqual(posts);
            expect(result.length).toBe(1);
            expect(result[0]).toBe(post);
        });

    })

    describe('getSinglePost should', () => {

        it('call http.get with the correct parameters', () => {

            jest.spyOn(http, 'get').mockImplementation(() => of(post));

            const service = getService();

            service.getSinglePost(1);

            expect(http.get).toHaveBeenCalledTimes(1);
            expect(http.get).toHaveBeenCalledWith(`${postsURL}/${1}`);
        });

        it('return a single post on subscribe', () => {

            jest.spyOn(http, 'get').mockImplementation(() => of(post));

            const service = getService();

            let result: PostShow;
            service.getSinglePost(1).subscribe({
                next: res => { result = res },
                error: err => { return err }
            });

            expect(result).toEqual(post);
        });

    })

    describe('getPostsCount should', () => {

        it('call http.get with the correct parameters', () => {

            jest.spyOn(http, 'get').mockImplementation(() => of(post));

            const service = getService();

            service.getPostsCount();

            expect(http.get).toHaveBeenCalledTimes(1);
            expect(http.get).toHaveBeenCalledWith(`${postsURL}/count`);
        });

        it('return the number of posts on subscribe', () => {

            jest.spyOn(http, 'get').mockImplementation(() => of(5));

            const service = getService();

            let result: number;
            service.getPostsCount().subscribe({
                next: res => { result = res },
                error: err => { return err }
            });

            expect(result).toEqual(5);
        });

    })

    describe('createPost should', () => {

        it('call http.post with the correct parameters', () => {

            jest.spyOn(http, 'post').mockImplementation(() => of(post));

            const service = getService();

            service.createPost({ title: 'a', content: 'b' });

            expect(http.post).toHaveBeenCalledTimes(1);
            expect(http.post).toHaveBeenCalledWith(`${postsURL}`, { title: 'a', content: 'b' });
        });

        it('return a single post on subscribe', () => {

            jest.spyOn(http, 'post').mockImplementation(() => of(post));

            const service = getService();

            let result: PostShow;
            service.createPost({ title: 'a', content: 'b' }).subscribe({
                next: res => { result = res },
                error: err => { return err }
            });

            expect(result).toEqual(post);
        });

    })

    describe('updatePost should', () => {

        it('call http.put with the correct parameters', () => {

            jest.spyOn(http, 'put').mockImplementation(() => of(post));

            const service = getService();

            service.updatePost(1, { title: 'a', content: 'b' });

            expect(http.put).toHaveBeenCalledTimes(1);
            expect(http.put).toHaveBeenCalledWith(`${postsURL}/${1}`, { title: 'a', content: 'b' });
        });

        it('return a single post on subscribe', () => {

            jest.spyOn(http, 'put').mockImplementation(() => of(post));

            const service = getService();

            let result: PostShow;
            service.updatePost(1, { title: 'a', content: 'b' }).subscribe({
                next: res => { result = res },
                error: err => { return err }
            });

            expect(result).toEqual(post);
        });

    })

    describe('likePost should', () => {

        it('call http.put with the correct parameters', () => {

            jest.spyOn(http, 'put').mockImplementation(() => of(post));

            const service = getService();

            service.likePost(1, false);
            const params = new HttpParams().set('state', `false`);

            expect(http.put).toHaveBeenCalledTimes(1);
            expect(http.put).toHaveBeenCalledWith(`${postsURL}/${1}/votes`, {}, { params: params });
        });

        it('return a single post on subscribe', () => {

            jest.spyOn(http, 'put').mockImplementation(() => of(post));

            const service = getService();

            let result: PostShow;
            service.likePost(1, false).subscribe({
                next: res => { result = res },
                error: err => { return err }
            });

            expect(result).toEqual(post);
        });

    })

    describe('flagPost should', () => {

        it('call http.put with the correct parameters', () => {

            jest.spyOn(http, 'put').mockImplementation(() => of(post));

            const service = getService();

            service.flagPost(1, false);
            const params = new HttpParams().set('state', `false`);

            expect(http.put).toHaveBeenCalledTimes(1);
            expect(http.put).toHaveBeenCalledWith(`${postsURL}/${1}/flag`, {}, { params: params });
        });

        it('return a single post on subscribe', () => {

            jest.spyOn(http, 'put').mockImplementation(() => of(post));

            const service = getService();

            let result: PostShow;
            service.flagPost(1, false).subscribe({
                next: res => { result = res },
                error: err => { return err }
            });

            expect(result).toEqual(post);
        });

    })

    describe('lockPost should', () => {

        it('call http.put with the correct parameters', () => {

            jest.spyOn(http, 'put').mockImplementation(() => of(post));

            const service = getService();

            service.lockPost(1, false);
            const params = new HttpParams().set('state', `false`);

            expect(http.put).toHaveBeenCalledTimes(1);
            expect(http.put).toHaveBeenCalledWith(`${postsURL}/${1}/lock`, {}, { params: params });
        });

        it('return a single post on subscribe', () => {

            jest.spyOn(http, 'put').mockImplementation(() => of(post));

            const service = getService();

            let result: PostShow;
            service.lockPost(1, false).subscribe({
                next: res => { result = res },
                error: err => { return err }
            });

            expect(result).toEqual(post);
        });

    })

    describe('deletePost should', () => {

        it('call http.put with the correct parameters', () => {

            jest.spyOn(http, 'delete').mockImplementation(() => of(post));

            const service = getService();

            service.deletePost(1);
            const params = new HttpParams().set('state', `false`);

            expect(http.delete).toHaveBeenCalledTimes(1);
            expect(http.delete).toHaveBeenCalledWith(`${postsURL}/${1}`);
        });

        it('return a single post on subscribe', () => {

            jest.spyOn(http, 'put').mockImplementation(() => of(post));

            const service = getService();

            let result: PostShow;
            service.deletePost(1).subscribe({
                next: res => { result = res },
                error: err => { return err }
            });

            expect(result).toEqual(post);
        });

    })

});
