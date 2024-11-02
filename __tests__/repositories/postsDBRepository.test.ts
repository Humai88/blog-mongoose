import { ObjectId, WithId } from "mongodb";
import { postsDBRepository } from "../../src/repositories/postsDBRepository";
import { blogsCollection, postsCollection } from "../../src/db/mongo-db";
import { v4 as uuidv4 } from 'uuid';
import { PostViewModel } from "../../src/models/PostViewModel";
import { BlogViewModel } from "../../src/models/BlogViewModel";
import { PostInputModel } from "../../src/models/PostInputModel";

jest.mock('../../src/db/mongo-db', () => ({
  blogsCollection: {
    findOne: jest.fn(),
  },
  postsCollection: {
    find: jest.fn(),
    findOne: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

describe('PostsDBRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });



  describe('createPost', () => {
    it('should create a new post and return a PostViewModel', async () => {
      const mockBlog: BlogViewModel = { id: '1', name: 'Blog 1', description: 'Description 1', createdAt: '2023-07-08', websiteUrl: 'https://blog1.com', isMembership: false};
      (blogsCollection.findOne as jest.Mock).mockResolvedValueOnce(mockBlog);

      const newPost: PostInputModel = {
        title: 'New Post', blogId: '1', content: 'Content', shortDescription: 'Short',
      };
      const createdPost: WithId<PostViewModel> = {
        _id: new ObjectId(), id: uuidv4(), title: 'New Post', blogId: '1', content: 'Content', shortDescription: 'Short', createdAt: '2023-07-08', blogName: 'Blog 1',
      };
      (postsCollection.insertOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true, insertedId: createdPost._id });

      const post = await postsDBRepository.createPost(newPost);

      expect(blogsCollection.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(postsCollection.insertOne).toHaveBeenCalled();
      expect(post.content).toEqual('Content');
      expect(post.shortDescription).toEqual('Short');
      expect(post.title).toEqual('New Post');
    });
  });

  describe('updatePost', () => {
    it('should update an existing post and return true', async () => {
      const updatedPost: PostInputModel = {
        title: 'Updated Post', blogId: '2', content: 'Updated Content', shortDescription: 'Updated Short',
      };
      (postsCollection.updateOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true, matchedCount: 1, modifiedCount: 1 });

      const result = await postsDBRepository.updatePost('1', updatedPost);

      expect(postsCollection.updateOne).toHaveBeenCalledWith({ id: '1' }, { $set: updatedPost });
      expect(result).toBe(true);
    });

    it('should return false if the post does not exist', async () => {
      const updatedPost: PostInputModel = {
        title: 'Updated Post', blogId: '2', content: 'Updated Content', shortDescription: 'Updated Short',
      };
      (postsCollection.updateOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true, matchedCount: 0, modifiedCount: 0 });

      const result = await postsDBRepository.updatePost('non-existing-id', updatedPost);

      expect(postsCollection.updateOne).toHaveBeenCalledWith({ id: 'non-existing-id' }, { $set: updatedPost });
      expect(result).toBe(false);
    });
  });

  describe('deletePost', () => {
    it('should delete an existing post and return true', async () => {
      (postsCollection.deleteOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true, deletedCount: 1 });

      const result = await postsDBRepository.deletePost('1');

      expect(postsCollection.deleteOne).toHaveBeenCalledWith({ id: '1' });
      expect(result).toBe(true);
    });

    it('should return false if the post does not exist', async () => {
      (postsCollection.deleteOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true, deletedCount: 0 });

      const result = await postsDBRepository.deletePost('non-existing-id');

      expect(postsCollection.deleteOne).toHaveBeenCalledWith({ id: 'non-existing-id' });
      expect(result).toBe(false);
    });
  });
});