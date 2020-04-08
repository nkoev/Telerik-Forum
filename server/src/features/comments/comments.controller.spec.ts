import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "../../database/entities/user.entity";
import { CommentCreateDTO } from "../../models/comments/comment-create.dto";
import { CommentUpdateDTO } from "../../models/comments/comment-update.dto";

describe('Comments Controller', () => {
    let controller: CommentsController;
    const commentsService: Partial<CommentsService> = {
        getComments() { return null; },
        getSingleComment() { return null; },
        createComment() { return null; },
        updateComment() { return null; },
        likeComment() { return null; },
        deleteComment() { return null; },
    };

    const userMocked: User = new User();
    const commentCreateDTOMocked: CommentCreateDTO = new CommentCreateDTO();
    const commentUpdateDTOMocked: CommentUpdateDTO = new CommentUpdateDTO();


    // beforeAll

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CommentsController],
            providers: [
                {
                    provide: CommentsService,
                    useValue: commentsService,
                }
            ],
        }).compile();

        controller = module.get<CommentsController>(CommentsController);

        jest.clearAllMocks();
    });

    // afterEach
    // afterAll

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getComments', () => {
        it('should call commentsService.getComments once with the correct argument', async () => {

            // Arrange
            const spy = jest.spyOn(commentsService, 'getComments');

            // Act
            await controller.getComments(2);

            // Assert
            expect(commentsService.getComments).toHaveBeenCalledTimes(1);
            expect(commentsService.getComments).toHaveBeenCalledWith(2);

            spy.mockClear();

        });

        it('should return the result from commentsService.getComments', async () => {

            // Arrange
            const spy = jest
                .spyOn(commentsService, 'getComments')
                .mockImplementation(async () => Promise.resolve('mocked result') as any);

            // Act
            const response = await controller.getComments(2);

            // Assert
            expect(response).toBe('mocked result');

            spy.mockClear();

        });
    });

    describe('getSingleComment', () => {
        it('should call commentsService.getSingleComment once with the correct arguments', async () => {

            // Arrange
            const spy = jest.spyOn(commentsService, 'getSingleComment');

            // Act
            await controller.getSingleComment(2, 3);

            // Assert
            expect(commentsService.getSingleComment).toHaveBeenCalledTimes(1);
            expect(commentsService.getSingleComment).toHaveBeenCalledWith(2, 3);

            spy.mockClear();

        });

        it('should return the result from commentsService.getSingleComment', async () => {

            // Arrange
            const spy = jest
                .spyOn(commentsService, 'getSingleComment')
                .mockImplementation(async () => Promise.resolve('mocked result') as any);

            // Act
            const response = await controller.getSingleComment(2, 3);

            // Assert
            expect(response).toBe('mocked result');

            spy.mockClear();

        });
    });

    describe('createComment', () => {
        it('should call commentsService.createComment once with the correct arguments', async () => {

            // Arrange
            const spy = jest.spyOn(commentsService, 'createComment');

            // Act
            await controller.createComment(userMocked, 2, commentCreateDTOMocked);

            // Assert
            expect(commentsService.createComment).toHaveBeenCalledTimes(1);
            expect(commentsService.createComment).toHaveBeenCalledWith(userMocked, 2, commentCreateDTOMocked);

            spy.mockClear();

        });

        it('should return the result from commentsService.createComment', async () => {

            // Arrange
            const spy = jest
                .spyOn(commentsService, 'createComment')
                .mockImplementation(async () => Promise.resolve('mocked result') as any);

            // Act
            const response = await controller.createComment(userMocked, 2, commentCreateDTOMocked);

            // Assert
            expect(response).toBe('mocked result');

            spy.mockClear();

        });
    });

    describe('updateComment', () => {
        it('should call commentsService.updateComment once with the correct arguments', async () => {

            // Arrange
            const spy = jest.spyOn(commentsService, 'updateComment');

            // Act
            await controller.updateComment(userMocked, false, 2, 3, commentUpdateDTOMocked);

            // Assert
            expect(commentsService.updateComment).toHaveBeenCalledTimes(1);
            expect(commentsService.updateComment).toHaveBeenCalledWith(userMocked, 2, 3, commentUpdateDTOMocked, false);

            spy.mockClear();

        });

        it('should return the result from commentsService.updateComment', async () => {

            // Arrange
            const spy = jest
                .spyOn(commentsService, 'updateComment')
                .mockImplementation(async () => Promise.resolve('mocked result') as any);

            // Act
            const response = await controller.updateComment(userMocked, false, 2, 3, commentUpdateDTOMocked);

            // Assert
            expect(response).toBe('mocked result');

            spy.mockClear();

        });
    });

    describe('likeComment', () => {
        it('should call commentsService.likeComment once with the correct arguments', async () => {

            // Arrange
            const spy = jest.spyOn(commentsService, 'likeComment');

            // Act
            await controller.likeComment(userMocked, 2, 3, false);

            // Assert
            expect(commentsService.likeComment).toHaveBeenCalledTimes(1);
            expect(commentsService.likeComment).toHaveBeenCalledWith(userMocked, 2, 3, false);

            spy.mockClear();

        });

        it('should return the result from commentsService.likeComment', async () => {

            // Arrange
            const spy = jest
                .spyOn(commentsService, 'likeComment')
                .mockImplementation(async () => Promise.resolve('mocked result') as any);

            // Act
            const response = await controller.likeComment(userMocked, 2, 3, false);

            // Assert
            expect(response).toBe('mocked result');

            spy.mockClear();

        });
    });

    describe('deleteComment', () => {
        it('should call commentsService.deleteComment once with the correct arguments', async () => {

            // Arrange
            const spy = jest.spyOn(commentsService, 'deleteComment');

            // Act
            await controller.deleteComment(userMocked, false, 2, 3);

            // Assert
            expect(commentsService.deleteComment).toHaveBeenCalledTimes(1);
            expect(commentsService.deleteComment).toHaveBeenCalledWith(userMocked, 2, 3, false);

            spy.mockClear();

        });

        it('should return the result from commentsService.deleteComment', async () => {

            // Arrange
            const spy = jest
                .spyOn(commentsService, 'deleteComment')
                .mockImplementation(async () => Promise.resolve('mocked result') as any);

            // Act
            const response = await controller.deleteComment(userMocked, false, 2, 3);

            // Assert
            expect(response).toBe('mocked result');

            spy.mockClear();

        });
    });
});
