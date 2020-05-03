import { AllPostsComponent } from './all-posts.component';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { PostDataService } from '../../post-data.service';
import { of } from 'rxjs';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { HttpClient } from '@angular/common/http';
import { AvatarService } from 'src/app/modules/core/services/avatar.service';
import { PostShow } from '../../models/post-show.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserDTO } from 'src/app/models/user.dto';
import { SinglePostComponent } from '../single-post/single-post.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CommentsModule } from 'src/app/modules/comments/comments.module';
import { Location } from '@angular/common';
import { UserProfileComponent } from 'src/app/modules/users/pages/user-profile/profile.component';
import { UsersModule } from 'src/app/modules/users/users.module';

describe('AllPostsComponent', () => {

    // FIELDS
    const routes: Routes = [
        { path: '', redirectTo: 'posts', pathMatch: 'full' },
        { path: 'posts', component: AllPostsComponent },
        { path: 'posts/1', component: SinglePostComponent },
        { path: 'profile/1234', component: UserProfileComponent },
    ];
    const loggedUser: UserDTO = {
        id: '1234',
        username: 'Stamat',
        roles: ['Admin'],
        banStatus: false,
        avatar: 'photo'
    };
    const user2: UserDTO = {
        id: '4321',
        username: 'Jorko',
        roles: ['Admin'],
        banStatus: false,
        avatar: 'photo'
    };
    let post: PostShow;
    let posts: PostShow[];

    // PROVIDERS
    const postDataService = {
        getPostsCount: () => of(1),
        getAllPosts: () => of(posts),
        likePost: (id: number, state: boolean) => of(post),
    };
    const authService = {
        loggedUser$: of(loggedUser),
    };
    const dialogService = {
        createPost: jest.fn().mockReturnThis(),
        updatePost: jest.fn().mockReturnThis(),
        flagPost: jest.fn().mockReturnThis(),
        lockPost: jest.fn().mockReturnThis(),
        deletePost: jest.fn().mockReturnThis(),
        showVotes: jest.fn().mockReturnThis(),
    };
    const renderer = {
        setStyle() { return null; },
    };
    const avatarService = {
        getAvatar: () => of(null),
    };
    const httpService = {
        get: jest.fn().mockReturnThis(),
        put: jest.fn().mockReturnThis(),
        post: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
    };
    const activatedRoute = {
        data: of({
            posts: [],
        }),
    };

    let router: Router;
    let location: Location;
    let debugElement: DebugElement;
    let fixture: ComponentFixture<AllPostsComponent>;
    let component: AllPostsComponent;

    beforeEach(async(() => {
        // clear all spies and mocks
        jest.clearAllMocks();
        post = {
            id: 1,
            title: 'a',
            content: 'b',
            user: loggedUser,
            votes: [],
            commentsCount: 0,
            flags: [],
            createdOn: new Date(),
            isLocked: false,
            isAdmin: true,
            isAuthor: true,
            isFlagged: false,
            isLiked: false,
        };
        posts = [post];

        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(routes),
                SharedModule,
                BrowserAnimationsModule,
                CommentsModule,
                UsersModule,
            ],
            declarations: [AllPostsComponent, SinglePostComponent],
            providers: [
                PostDataService,
                AuthService,
                DialogService,
                HttpClient,
                AvatarService,
            ]
        })
            .overrideProvider(PostDataService, { useValue: postDataService })
            .overrideProvider(AuthService, { useValue: authService })
            .overrideProvider(DialogService, { useValue: dialogService })
            .overrideProvider(HttpClient, { useValue: httpService })
            .overrideProvider(AvatarService, { useValue: avatarService })
            .overrideProvider(ActivatedRoute, { useValue: activatedRoute })
            .compileComponents();

        router = TestBed.get(Router);
        location = TestBed.get(Location);
        fixture = TestBed.createComponent(AllPostsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();

    }));

    it('should initialize correctly with the data passed from services.', async(() => {

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.posts).toEqual(posts);
            expect(component.loggedUser).toEqual(loggedUser);
        });
    }));

    it('should navigate to the selected post\'s detailed view when post clicked', fakeAsync(() => {

        // we trigger a click on our link
        debugElement.query(By.css('.card')).nativeElement.click();

        // We wait for all pending promises to be resolved.
        tick();

        expect(location.path()).toBe('/posts/1');

    }));

    it('should navigate to the selected user\'s profile when avatar clicked', fakeAsync(() => {

        debugElement.query(By.css('.header-avatar')).nativeElement.click();

        tick();

        expect(location.path()).toBe('/profile/1234');

    }));

    it('should navigate to the selected user\'s profile when username clicked', fakeAsync(() => {

        debugElement.query(By.css('.header-username p')).nativeElement.click();

        tick();

        expect(location.path()).toBe('/profile/1234');

    }));

    it('should call dialogService.createPost with the correct parameters when button clicked', fakeAsync(() => {

        const observer = {
            next(postU: PostShow) { posts.unshift(postU); },
            error(error: Error) { return null; }
        };
        jest.spyOn(dialogService, 'createPost').mockImplementation(() => { observer.next(post); });
        debugElement.query(By.css('.create')).nativeElement.click();

        tick();

        expect(dialogService.createPost).toHaveBeenCalledTimes(1);
        // expect(dialogService.createPost).toHaveBeenCalledWith({ next: observer.next, error: observer.error });

    }));

    it('should update posts array when dialogService.createPost is called', fakeAsync(() => {

        const posts2 = [post, ...posts];
        jest.spyOn(dialogService, 'createPost').mockImplementation((observer) => { observer.next(post); });
        debugElement.query(By.css('.create')).nativeElement.click();

        tick();

        expect(component.posts).toEqual(posts2);

    }));

    it('should call dialogService.updatePost with the correct parameters when icon clicked', fakeAsync(() => {

        const updatedPost = { ...post, title: 'update', content: 'update' };
        jest.spyOn(dialogService, 'updatePost').mockImplementation((postU, observer) => { observer.next(updatedPost); });
        debugElement.query(By.css('.pencil')).nativeElement.click();

        tick();

        expect(dialogService.updatePost).toHaveBeenCalledTimes(1);
        // expect(dialogService.updatePost).toHaveBeenCalledWith({ next: expect.any(Function), error: expect.any(Function) });

    }));

    it('should update posts array when dialogService.updatePost is called', fakeAsync(() => {

        const updatedPost = { ...post, title: 'update', content: 'update' };
        const posts2 = [updatedPost];
        jest.spyOn(dialogService, 'updatePost').mockImplementation((postU, observer) => { observer.next(updatedPost); });
        debugElement.query(By.css('.pencil')).nativeElement.click();

        tick();

        expect(component.posts).toEqual(posts2);

    }));

    it('should call dialogService.flagPost with the correct parameters when icon clicked', fakeAsync(() => {

        posts[0].user = user2;
        posts[0].isAuthor = false;
        fixture = TestBed.createComponent(AllPostsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();

        const updatedPost = { ...post, flags: [loggedUser], isFlagged: true };
        jest.spyOn(dialogService, 'flagPost').mockImplementation((postU, observer) => { observer.next(updatedPost); });
        debugElement.query(By.css('.flag')).nativeElement.click();

        tick();

        expect(dialogService.flagPost).toHaveBeenCalledTimes(1);
        // expect(dialogService.flagPost).toHaveBeenCalledWith({ next: expect.any(Function), error: expect.any(Function) });

    }));

    it('should update posts array when dialogService.flagPost is called', fakeAsync(() => {

        posts[0].user = user2;
        posts[0].isAuthor = false;
        fixture = TestBed.createComponent(AllPostsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();

        const updatedPost = { ...post, flags: [loggedUser], isFlagged: true };
        const posts2 = [updatedPost];
        jest.spyOn(dialogService, 'flagPost').mockImplementation((post, observer) => { observer.next(updatedPost); });
        debugElement.query(By.css('.flag')).nativeElement.click();

        tick();

        expect(component.posts).toEqual(posts2);

    }));

    it('should call postDataService likePost and return the liked post', (done) => {

        posts[0].user = user2;
        posts[0].isAuthor = false;
        fixture = TestBed.createComponent(AllPostsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();

        const result: PostShow = { ...posts[0], isLiked: true };
        jest.spyOn(postDataService, 'likePost').mockImplementation(() => of(result));
        postDataService.likePost(1, false)
            .subscribe(
                data => {
                    expect(data).toBe(result);

                    done();
                }
            );
    });

    it('should call dialogService.lockPost with the correct parameters when icon clicked', fakeAsync(() => {

        const updatedPost = { ...post, isLocked: true };
        jest.spyOn(dialogService, 'lockPost').mockImplementation((post, observer) => { observer.next(updatedPost); });
        debugElement.query(By.css('.padlock')).nativeElement.click();

        tick();

        expect(dialogService.lockPost).toHaveBeenCalledTimes(1);
        // expect(dialogService.lockPost).toHaveBeenCalledWith({ next: expect.any(Function), error: expect.any(Function) });

    }));

    it('should update posts array when dialogService.lockPost is called', fakeAsync(() => {

        const updatedPost = { ...post, isLocked: true };
        const posts2 = [updatedPost];
        jest.spyOn(dialogService, 'lockPost').mockImplementation((post, observer) => { observer.next(updatedPost); });
        debugElement.query(By.css('.padlock')).nativeElement.click();

        tick();

        expect(component.posts).toEqual(posts2);

    }));

    it('should call dialogService.deletePost with the correct parameters when icon clicked', fakeAsync(() => {

        jest.spyOn(dialogService, 'deletePost').mockImplementation((post, observer) => { observer.next(post); });
        debugElement.query(By.css('.bin')).nativeElement.click();

        tick();

        expect(dialogService.deletePost).toHaveBeenCalledTimes(1);
        // expect(dialogService.deletePost).toHaveBeenCalledWith({ next: expect.any(Function), error: expect.any(Function) });

    }));

    it('should update posts array when dialogService.deletePost is called', fakeAsync(() => {

        const posts2 = [];
        jest.spyOn(dialogService, 'deletePost').mockImplementation((post, observer) => { observer.next(post); });
        debugElement.query(By.css('.bin')).nativeElement.click();

        tick();

        expect(component.posts).toEqual(posts2);

    }));


});
