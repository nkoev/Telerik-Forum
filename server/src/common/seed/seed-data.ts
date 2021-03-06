import { Repository, createConnection } from 'typeorm';
import { Role } from '../../database/entities/role.entity';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { BanStatus } from '../../database/entities/ban-status.entity';
import { Post } from '../../database/entities/post.entity';
import { Comment } from '../../database/entities/comment.entity';
import { ActivityRecord } from '../../database/entities/activity.entity';
import { ActivityType } from '../../models/activity/activity-type.enum';
import { FriendRequest } from '../../database/entities/friend-request.entity';

const seededUsers: User[] = [];
const seededPosts: Post[] = [];
const seededComments: Comment[] = [];

const seedUsers = async (connection: any) => {
  const userRepo: Repository<User> = connection.manager.getRepository(User);
  const rolesRepo: Repository<Role> = connection.manager.getRepository(Role);
  const banStatusRepo: Repository<BanStatus> = connection.manager.getRepository(
    BanStatus,
  );

  const allUserRoles: Role[] = await rolesRepo.find({
    where: {
      name: 'Basic',
    },
  });

  if (allUserRoles.length === 0) {
    console.log('ERROR: The DB does not have the role Basic!');
    return;
  }

  for (let i = 1; i < 5; i++) {
    const user = await userRepo.findOne({
      where: {
        username: `user${i}`,
      },
    });

    if (user) {
      console.log(`ERROR: The DB already has a user with username user${i}!`);
      return;
    }

    const username = `user${i}`;
    const password = '1234';
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = '';
    const banStatus = await banStatusRepo.save(banStatusRepo.create());

    const newUser: User = userRepo.create({
      username,
      password: hashedPassword,
      roles: allUserRoles,
      avatar: avatar,
      banStatus,
    });

    seededUsers.push(newUser);
    await userRepo.save(newUser);
    console.log(`Seeded ${newUser.username} successfully!`);
  }
};

const seedPosts = async (connection: any) => {
  const postsRepo: Repository<Post> = connection.manager.getRepository(Post);
  const userRepo: Repository<User> = connection.manager.getRepository(User);
  const activityRepo: Repository<ActivityRecord> = connection.manager.getRepository(
    ActivityRecord,
  );

  if (seededUsers.length === 0) {
    console.log('ERROR: The DB does not have any users!');
    return;
  }

  for (let i = 1; i < 5; i++) {
    const title = `<< My cool post >>`;
    const content = `This is my cool post!`;
    const user = await userRepo.findOne({
      where: {
        id: seededUsers[i - 1].id,
      },
    });
    const comments = Promise.resolve([]);
    const votes = [];

    const newPost: Post = postsRepo.create({
      title: title,
      content: content,
      user: user,
      comments: comments,
      votes: votes,
    });

    await postsRepo.save(newPost);
    seededPosts.push(newPost);
    console.log(`Seeded post by ${user.username} successfully!`);

    const newRecord = activityRepo.create({
      username: user.username,
      action: `${ActivityType.Create} a post`,
      targetURL: `http://loclahost:3000/posts/${newPost.id}`,
      user: user,
    });

    await activityRepo.save(newRecord);
    console.log(
      `Seeded new activity "Create Post" by ${user.username} successfully!`,
    );
  }
};

const seedComments = async (connection: any) => {
  const commentsRepo: Repository<Comment> = connection.manager.getRepository(
    Comment,
  );
  const postsRepo: Repository<Post> = connection.manager.getRepository(Post);
  const userRepo: Repository<User> = connection.manager.getRepository(User);
  const activityRepo: Repository<ActivityRecord> = connection.manager.getRepository(
    ActivityRecord,
  );

  if (seededPosts.length === 0) {
    console.log('ERROR: The DB does not have any posts!');
    return;
  }

  for (let i = 1; i < 5; i++) {
    const content = `Please like this comment for no reason!`;
    const user = await userRepo.findOne({
      where: {
        id: seededUsers[i - 1].id,
      },
    });
    const post = await postsRepo.findOne({
      where: {
        id: seededPosts[i - 1].id,
      },
    });
    const votes = [];

    const newComment: Comment = commentsRepo.create({
      content: content,
      user: user,
      post: post,
      votes: votes,
    });

    await postsRepo
      .createQueryBuilder('post')
      .update()
      .set({
        commentsCount: () => 'commentsCount + 1',
      })
      .where('id = :id', { id: post.id })
      .execute();

    await commentsRepo.save(newComment);
    seededComments.push(newComment);
    console.log(`Seeded comment by ${user.username} successfully!`);

    const newRecord = activityRepo.create({
      username: user.username,
      action: `${ActivityType.Create} a comment`,
      targetURL: `http://loclahost:3000/posts/${post.id}/comments/${newComment.id}`,
      user: user,
    });

    await activityRepo.save(newRecord);
    console.log(
      `Seeded new activity "Create Comment" by ${user.username} successfully!`,
    );
  }
};

const seedPostLikes = async (connection: any) => {
  const postsRepo: Repository<Post> = connection.manager.getRepository(Post);
  const userRepo: Repository<User> = connection.manager.getRepository(User);
  const activityRepo: Repository<ActivityRecord> = connection.manager.getRepository(
    ActivityRecord,
  );

  if (seededPosts.length === 0) {
    console.log('ERROR: The DB does not have any posts!');
    return;
  }

  for (let i = 1; i < 5; i++) {
    const post = await postsRepo.findOne({
      where: {
        id: seededPosts[i - 1].id,
      },
    });
    const user = await userRepo.findOne({
      where: {
        id: seededUsers[seededUsers.length - i].id,
      },
    });

    post.votes.push(user);
    await postsRepo.save(post);
    console.log(`Seeded post like by ${user.username} successfully!`);

    const newRecord = activityRepo.create({
      username: user.username,
      action: `${ActivityType.Like} a post`,
      targetURL: `http://loclahost:3000/posts/${post.id}`,
      user: seededUsers[seededUsers.length - i],
    });

    await activityRepo.save(newRecord);
    console.log(
      `Seeded new activity "Like Post" by ${user.username} successfully!`,
    );
  }
};

const seedCommentLikes = async (connection: any) => {
  const commentsRepo: Repository<Comment> = connection.manager.getRepository(
    Comment,
  );
  const userRepo: Repository<User> = connection.manager.getRepository(User);
  const activityRepo: Repository<ActivityRecord> = connection.manager.getRepository(
    ActivityRecord,
  );

  if (seededComments.length === 0) {
    console.log('ERROR: The DB does not have any comments!');
    return;
  }

  for (let i = 1; i < 5; i++) {
    const comment = await commentsRepo.findOne({
      where: {
        id: seededComments[i - 1].id,
      },
    });
    const user = await userRepo.findOne({
      where: {
        id: seededUsers[seededUsers.length - i].id,
      },
    });

    comment.votes.push(user);
    await commentsRepo.save(comment);
    console.log(`Seeded comment like by ${user.username} successfully!`);

    const newRecord = activityRepo.create({
      username: user.username,
      action: `${ActivityType.Like} a comment`,
      targetURL: `http://loclahost:3000/posts/${comment.post.id}/comments/${comment.id}`,
      user: seededUsers[seededUsers.length - i],
    });

    await activityRepo.save(newRecord);
    console.log(
      `Seeded new activity "Like Comment" by ${user.username} successfully!`,
    );
  }
};

const seedFriendRequests = async (connection: any) => {
  const friendsRepo: Repository<FriendRequest> = connection.manager.getRepository(
    FriendRequest,
  );
  const userRepo: Repository<User> = connection.manager.getRepository(User);

  if (seededUsers.length === 0) {
    console.log('ERROR: The DB does not have any users!');
    return;
  }

  for (let i = 0; i < 2; i++) {
    const user = await userRepo.findOne({
      where: {
        id: seededUsers[i].id,
      },
    });
    for (let j = 0; j < seededUsers.length - i - 1; j++) {
      const friend = await userRepo.findOne({
        where: {
          id: seededUsers[i + j + 1].id,
        },
      });

      const newFriendRequest: FriendRequest = friendsRepo.create({
        userA: user.id,
        userB: friend.id,
      });

      await friendsRepo.save(newFriendRequest);
      console.log(
        `Seeded friend request from ${user.username} to ${friend.username} successfully!`,
      );
    }
  }
};

const seedFriends = async (connection: any) => {
  const userRepo: Repository<User> = connection.manager.getRepository(User);
  const friendsRepo: Repository<FriendRequest> = connection.manager.getRepository(
    FriendRequest,
  );

  if (seededUsers.length === 0) {
    console.log('ERROR: The DB does not have any users!');
    return;
  }

  for (let i = 1; i < 4; i++) {
    const user = await userRepo.findOne({
      where: {
        id: seededUsers[i].id,
      },
    });
    const friend = await userRepo.findOne({
      where: {
        id: seededUsers[0].id,
      },
    });

    const foundFriendRequest: FriendRequest = await friendsRepo.findOne({
      userA: friend.id,
      userB: user.id,
    });

    await friendsRepo.save({ ...foundFriendRequest, status: true });

    (await user.friends).push(friend);
    (await friend.friends).push(user);

    await userRepo.save(user);
    await userRepo.save(friend);

    console.log(
      `Seeded ${user.username} accepted friend request from ${friend.username} successfully!`,
    );
  }
};

const seed = async () => {
  console.log('\n   * * * SEED STARTED * * *\n');
  const connection = await createConnection();

  await seedUsers(connection);
  console.log(`\n\t----- *** -----\n`);
  await seedPosts(connection);
  console.log(`\n\t----- *** -----\n`);
  await seedComments(connection);
  console.log(`\n\t----- *** -----\n`);
  await seedPostLikes(connection);
  console.log(`\n\t----- *** -----\n`);
  await seedCommentLikes(connection);
  console.log(`\n\t----- *** -----\n`);
  await seedFriendRequests(connection);
  console.log(`\n\t----- *** -----\n`);
  await seedFriends(connection);

  await connection.close();
  console.log('\n   * * * SEED COMPLETED * * *\n');
};

seed().catch(console.error);
