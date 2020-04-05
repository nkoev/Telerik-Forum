import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { Post } from "../database/entities/post.entity";

@EventSubscriber()
export class ActivitySubscriber implements EntitySubscriberInterface<Post> {

  listenTo() {
    return Post;
  }

  beforeInsert() {
    console.log(`BEFORE ENTITY INSERTED`);
  }
}
