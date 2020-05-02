import { Test, TestingModule } from "@nestjs/testing";
import { DeepPartial } from "typeorm";
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentsService } from "./comments.service";
import { ActivityService } from "../core/activity.service";
import { Comment } from "../../database/entities/comment.entity";
import { Post } from "../../database/entities/post.entity";
import { User } from "../../database/entities/user.entity";
import { CommentCreateDTO } from "../../models/comments/comment-create.dto";
import { CommentUpdateDTO } from "../../models/comments/comment-update.dto";
import { ActivityType } from "../../models/activity/activity-type.enum";
import { ForumSystemException } from "../../common/exceptions/system-exception";
import { CommentShowDTO } from "../../models/comments/comment-show.dto";

describe('Comments Service', () => {
    let commentsService: CommentsService;
    const activityService: Partial<ActivityService> = {
        logCommentEvent: jest.fn()
    };
    const postsRepository = {
        find() { return null; },
        findOne() { return null; },
        save() { return null; },
        createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            loadRelationCountAndMap: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockReturnThis(),
        })),
    };
    const commentsRepository = {
        find() { return null; },
        findOne() { return null; },
        save() { return null; },
        create() { return null; },
    };

    let fakeUser: User;
    let fakePost: Post;
    let fakeComment: Comment;
    const fakeDate = new Date();
    const commentShowDTOFake1: CommentShowDTO = {
        id: 2,
        content: 'Random Content',
        user: new User(),
        votes: [],
        createdOn: fakeDate,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentsService,
                {
                    provide: getRepositoryToken(Post),
                    useValue: postsRepository,
                }, {
                    provide: getRepositoryToken(Comment),
                    useValue: commentsRepository,
                }, {
                    provide: ActivityService,
                    useValue: activityService,
                }
            ],
        }).compile();

        commentsService = module.get<CommentsService>(CommentsService);


        fakeUser = new User();
        fakeUser.id = '1234';
        fakePost = {
            id: 1,
            title: 'Mocked Post',
            content: 'Random Content',
            createdOn: fakeDate,
            user: fakeUser,
            votes: [],
            isDeleted: false,
            isLocked: false,
            comments: Promise.resolve([]),
            commentsCount: 0,
            flags: [],
        };
        fakeComment = {
            id: 2,
            content: 'Random Content',
            createdOn: fakeDate,
            user: new User(),
            post: new Post(),
            votes: [],
            isDeleted: false,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should be defined', () => {
        expect(commentsService).toBeDefined();
    });

    describe('getComments', () => {
        it('should call postsRepository findOne() once with correct filtering object', async () => {
            // Arrange
            jest.spyOn(postsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakePost));

            jest.spyOn(commentsRepository, 'find')
                .mockReturnValue(Promise.resolve([]));


            const expectedFilteringObject = { where: { id: 1, isDeleted: false } };

            // Act
            await commentsService.getComments(1);

            // Assert
            expect(postsRepository.findOne).toHaveBeenCalledTimes(1);
            expect(postsRepository.findOne).toHaveBeenCalledWith(expectedFilteringObject);
        });

        it('should throw if post is not found', async () => {
            // Arrange
            jest.spyOn(postsRepository, 'findOne')
                .mockReturnValue(undefined);

            jest.spyOn(commentsRepository, 'find')
                .mockReturnValue(Promise.resolve([]));

            // Act & Assert
            expect(commentsService.getComments(1))
                .rejects.toThrowError(ForumSystemException);
        });

        it('should call commentsRepository find() once with correct filtering object', async () => {
            // Arrange
            jest.spyOn(postsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakePost));

            jest.spyOn(commentsRepository, 'find')
                .mockImplementation(async () => Promise.resolve([]));

            const expectedFilteringObject = { where: { post: { id: 1 }, isDeleted: false } };

            // Act
            await commentsService.getComments(1);

            // Assert
            expect(commentsRepository.find).toHaveBeenCalledTimes(1);
            expect(commentsRepository.find).toHaveBeenCalledWith(expectedFilteringObject);
        });

        it('should return array of transformed CommentShowDTO objects', async () => {
            // Arrange
            jest.spyOn(postsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakePost));

            jest.spyOn(commentsRepository, 'find')
                .mockReturnValue(Promise.resolve([fakeComment]));

            // Act
            const result = await commentsService.getComments(1);

            // Assert
            expect(result).toEqual(expect.arrayContaining([commentShowDTOFake1]));
            expect(result.length).toBe(1);
            expect(result[0]).toBeInstanceOf(CommentShowDTO);
        });
    });

    describe('getSingleComment', () => {
        it('should call commentsRepository findOne() once with correct filtering object', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            const expectedFilteringObject = { where: { id: 2, post: { id: 1, isDeleted: false }, isDeleted: false } };

            // Act
            await commentsService.getSingleComment(1, 2);

            // Assert
            expect(commentsRepository.findOne).toHaveBeenCalledTimes(1);
            expect(commentsRepository.findOne).toHaveBeenCalledWith(expectedFilteringObject);
        });

        it('should throw if comment is not found', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(undefined);

            const expectedFilteringObject = { where: { id: 2, post: { id: 1, isDeleted: false }, isDeleted: false } };

            // Act& Assert
            expect(commentsService.getSingleComment(1, 2))
                .rejects.toThrowError(ForumSystemException);

            // Assert
            expect(commentsRepository.findOne).toHaveBeenCalledTimes(1);
            expect(commentsRepository.findOne).toHaveBeenCalledWith(expectedFilteringObject);
        });

        it('should return transformed CommentShowDTO object', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            // Act
            const result = await commentsService.getSingleComment(1, 2);

            // Assert
            expect(result).toBeInstanceOf(CommentShowDTO);
            expect(result).toEqual(commentShowDTOFake1);
        });
    });

    describe('createComment', () => {

        const commentCreateDTOFake: CommentCreateDTO = {
            content: 'Random Content'
        };
        it('should call postsRepository findOne() once with correct filtering object', async () => {
            // Arrange
            jest.spyOn(postsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakePost));

            jest.spyOn(commentsRepository, 'create')
                .mockReturnValue(fakeComment);

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeComment));

            const expectedFilteringObject = { where: { id: 1, isDeleted: false } };

            // Act
            await commentsService.createComment(fakeUser, 1, commentCreateDTOFake);

            // Assert
            expect(postsRepository.findOne).toHaveBeenCalledTimes(1);
            expect(postsRepository.findOne).toHaveBeenCalledWith(expectedFilteringObject);
        });

        it('should throw if post is not found', async () => {
            // Arrange
            jest.spyOn(postsRepository, 'findOne')
                .mockReturnValue(undefined);

            jest.spyOn(commentsRepository, 'create')
                .mockReturnValue(fakeComment);

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeComment));

            // Act & Assert
            expect(commentsService.createComment(fakeUser, 1, commentCreateDTOFake))
                .rejects.toThrowError(ForumSystemException);
        });

        it('should throw if post is locked', async () => {
            // Arrange
            jest.spyOn(postsRepository, 'findOne')
                .mockReturnValue(undefined);

            jest.spyOn(commentsRepository, 'create')
                .mockReturnValue(fakeComment);

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeComment));

            // Act & Assert
            expect(commentsService.createComment(fakeUser, 1, commentCreateDTOFake))
                .rejects.toThrowError(ForumSystemException);
        });

        it('should call commentsRepository create() once with correct object', async () => {
            // Arrange
            const votes: DeepPartial<User>[] = [];
            const post = fakePost;
            const user = fakeUser;
            jest.spyOn(postsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakePost));

            jest.spyOn(commentsRepository, 'create')
                .mockReturnValue(fakeComment);

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeComment));

            const expectedObject = { ...commentCreateDTOFake, user, post, votes };

            // Act
            await commentsService.createComment(fakeUser, 1, commentCreateDTOFake);

            // Assert
            expect(commentsRepository.create).toHaveBeenCalledTimes(1);
            expect(commentsRepository.create).toHaveBeenCalledWith(expectedObject);
        });

        it('should call commentsRepository save() once with correct object', async () => {
            // Arrange
            jest.spyOn(postsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakePost));

            jest.spyOn(commentsRepository, 'create')
                .mockReturnValue(fakeComment);

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeComment));

            // Act
            await commentsService.createComment(fakeUser, 1, commentCreateDTOFake);

            // Assert
            expect(commentsRepository.save).toHaveBeenCalledTimes(1);
            expect(commentsRepository.save).toHaveBeenCalledWith(fakeComment);
        });

        it('should call activityService logCommentEvent() once with correct arguments', async () => {
            // Arrange
            jest.spyOn(postsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakePost));

            jest.spyOn(commentsRepository, 'create')
                .mockReturnValue(fakeComment);

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeComment));

            // Act
            await commentsService.createComment(fakeUser, 1, commentCreateDTOFake);

            // Assert
            expect(activityService.logCommentEvent).toHaveBeenCalledTimes(1);
            expect(activityService.logCommentEvent).toHaveBeenCalledWith(fakeUser, ActivityType.Create, 1, fakeComment.id);
        });

        it('should return transformed CommentShowDTO object', async () => {
            // Arrange
            jest.spyOn(postsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakePost));

            jest.spyOn(commentsRepository, 'create')
                .mockReturnValue(fakeComment);

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeComment));

            // Act
            const result = await commentsService.createComment(fakeUser, 1, commentCreateDTOFake);

            // Assert
            expect(result).toBeInstanceOf(CommentShowDTO);
            expect(result).toEqual(commentShowDTOFake1);
        });
    });

    describe('updateComment', () => {

        const fakeUpdatedComment: Comment = {
            id: 2,
            content: 'New Content',
            createdOn: fakeDate,
            user: new User(),
            post: new Post(),
            votes: [],
            isDeleted: false,
        };
        const commentUpdateDTOFake: CommentUpdateDTO = {
            content: 'New Content'
        };
        const commentShowDTOFake2: CommentShowDTO = {
            id: 2,
            content: 'New Content',
            user: new User(),
            votes: [],
            createdOn: fakeDate,
        };

        it('should call commentsRepository findOne() once with correct filtering object', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeUpdatedComment));

            const expectedFilteringObject = { where: { id: 2, post: { id: 1, isDeleted: false }, isDeleted: false } };

            // Act
            await commentsService.updateComment(fakeUser, 1, 2, commentUpdateDTOFake, true);

            // Assert
            expect(commentsRepository.findOne).toHaveBeenCalledTimes(1);
            expect(commentsRepository.findOne).toHaveBeenCalledWith(expectedFilteringObject);
        });

        it('should throw if comment is not found', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(undefined);

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeUpdatedComment));

            // Act & Assert
            expect(commentsService.updateComment(fakeUser, 1, 2, commentUpdateDTOFake, true))
                .rejects.toThrowError(ForumSystemException);
        });


        it('should throw if the user is not an admin and is trying to update other users comments', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeUpdatedComment));

            // Act& Assert
            expect(commentsService.updateComment(fakeUser, 1, 2, commentUpdateDTOFake, false))
                .rejects.toThrowError(ForumSystemException);
        });

        it('should call commentsRepository save() once with correct object', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeUpdatedComment));

            // Act
            await commentsService.updateComment(fakeUser, 1, 2, commentUpdateDTOFake, true);

            // Assert
            expect(commentsRepository.save).toHaveBeenCalledTimes(1);
            expect(commentsRepository.save).toHaveBeenCalledWith(fakeUpdatedComment);
        });

        it('should call activityService logCommentEvent() once with correct arguments', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeUpdatedComment));

            // Act
            await commentsService.updateComment(fakeUser, 1, 2, commentUpdateDTOFake, true);

            // Assert
            expect(activityService.logCommentEvent).toHaveBeenCalledTimes(1);
            expect(activityService.logCommentEvent).toHaveBeenCalledWith(fakeUser, ActivityType.Update, 1, 2);
        });

        it('should return transformed CommentShowDTO object', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeUpdatedComment));

            // Act
            const result = await commentsService.updateComment(fakeUser, 1, 2, commentUpdateDTOFake, true);

            // Assert
            expect(result).toBeInstanceOf(CommentShowDTO);
            expect(result).toEqual(commentShowDTOFake2);
        });
    });

    describe('deleteComment', () => {

        const fakeDeletedComment: Comment = {
            id: 2,
            content: 'Random Content',
            createdOn: fakeDate,
            user: new User(),
            post: new Post(),
            votes: [],
            isDeleted: true,
        };

        it('should call commentsRepository findOne() once with correct filtering object', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeDeletedComment));

            const expectedFilteringObject = { where: { id: 2, post: { id: 1, isDeleted: false }, isDeleted: false } };

            // Act
            await commentsService.deleteComment(fakeUser, 1, 2, true);

            // Assert
            expect(commentsRepository.findOne).toHaveBeenCalledTimes(1);
            expect(commentsRepository.findOne).toHaveBeenCalledWith(expectedFilteringObject);
        });

        it('should throw if comment is not found', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(undefined);

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeDeletedComment));

            // Act & Assert
            expect(commentsService.deleteComment(fakeUser, 1, 2, true))
                .rejects.toThrowError(ForumSystemException);
        });

        it('should throw if the user is not an admin and is trying to delete other users comments', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeDeletedComment));

            // Act & Assert
            expect(commentsService.deleteComment(fakeUser, 1, 2, false))
                .rejects.toThrowError(ForumSystemException);
        });

        it('should call commentsRepository save() once with correct object', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeDeletedComment));

            // Act
            await commentsService.deleteComment(fakeUser, 1, 2, true);

            // Assert
            expect(commentsRepository.save).toHaveBeenCalledTimes(1);
            expect(commentsRepository.save).toHaveBeenCalledWith(fakeDeletedComment);
        });

        it('should call activityService logCommentEvent() once with correct arguments', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeDeletedComment));

            // Act
            await commentsService.deleteComment(fakeUser, 1, 2, true);

            // Assert
            expect(activityService.logCommentEvent).toHaveBeenCalledTimes(1);
            expect(activityService.logCommentEvent).toHaveBeenCalledWith(fakeUser, ActivityType.Remove, 1, 2);
        });

        it('should return transformed CommentShowDTO object', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            jest.spyOn(commentsRepository, 'save')
                .mockReturnValue(Promise.resolve(fakeDeletedComment));

            // Act
            const result = await commentsService.deleteComment(fakeUser, 1, 2, true);

            // Assert
            expect(result).toBeInstanceOf(CommentShowDTO);
            expect(result).toEqual(commentShowDTOFake1);
        });
    });

    describe('likeComment', () => {
        it('should call commentsRepository findOne() once with correct filtering object', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            const expectedFilteringObject = { where: { id: 2, post: { id: 1, isDeleted: false }, isDeleted: false } };

            // Act
            await commentsService.likeComment(fakeUser, 1, 2, true);

            // Assert
            expect(commentsRepository.findOne).toHaveBeenCalledTimes(1);
            expect(commentsRepository.findOne).toHaveBeenCalledWith(expectedFilteringObject);
        });

        it('should throw if comment is not found', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(undefined);

            // Act & Assert
            expect(commentsService.likeComment(fakeUser, 1, 2, true))
                .rejects.toThrowError(ForumSystemException);
        });

        it('should throw if loggedUser same as comment owner', async () => {
            // Arrange
            fakeComment.user = fakeUser;

            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));
            expect.assertions(1);

            // Act & Assert
            await expect(commentsService.likeComment(fakeUser, 1, 2, true))
                .rejects.toThrowError(ForumSystemException);
        });

        it('should throw if post has been already (un)liked', async () => {
            // Arrange
            fakeComment.votes.push(fakeUser);
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));
            expect.assertions(1);

            // Act & Assert
            await expect(commentsService.likeComment(fakeUser, 1, 2, true))
                .rejects.toThrowError(ForumSystemException);
        });

        // it('should call commentsRepository createQueryBuilder() once', async () => {
        //     // Arrange
        //     jest.spyOn(commentsRepository, 'findOne')
        //         .mockReturnValue(Promise.resolve(fakeComment));

        //     // Act
        //     await commentsService.likeComment(fakeUser, 1, 2, true);

        //     // Assert
        //     expect(commentsRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
        // });

        it('call activityService logCommentEvent() once with correct arguments', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            // Act
            await commentsService.likeComment(fakeUser, 1, 2, true);

            // Assert
            expect(activityService.logCommentEvent).toHaveBeenCalledTimes(1);
            expect(activityService.logCommentEvent).toHaveBeenCalledWith(fakeUser, ActivityType.Like, 1, 2);
        });

        it('should return transformed CommentShowDTO object', async () => {
            // Arrange
            jest.spyOn(commentsRepository, 'findOne')
                .mockReturnValue(Promise.resolve(fakeComment));

            // Act
            const result = await commentsService.likeComment(fakeUser, 1, 2, true);

            // Assert
            expect(result).toBeInstanceOf(CommentShowDTO);
            expect(result).toEqual(commentShowDTOFake1);
        });
    });
});