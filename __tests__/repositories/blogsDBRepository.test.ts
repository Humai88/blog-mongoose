import { ObjectId, WithId } from "mongodb";
import { BlogsDBRepository } from "../../src/repositories/blogsDBRepository";
import { blogsCollection } from "../../src/db/mongo-db";
import { BlogInputModel } from "../../src/models//BlogInputModel";
import { BlogViewModel } from "../../src/models/BlogViewModel";
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../src/db/mongo-db', () => ({
  blogsCollection: {
    find: jest.fn(),
    findOne: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

describe('BlogsDBRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBlogs', () => {
    it('should return an array of BlogViewModel', async () => {
      const mockBlogs: WithId<BlogViewModel>[] = [
        { _id: new ObjectId(), id: '1', name: 'Blog 1', description: 'Description 1', websiteUrl: 'https://blog1.com', createdAt: '2023-07-08T00:00:00.000Z', isMembership: false },
        { _id: new ObjectId(), id: '2', name: 'Blog 2', description: 'Description 2', websiteUrl: 'https://blog2.com', createdAt: '2023-07-09T00:00:00.000Z', isMembership: false },
      ];
      (blogsCollection.find as jest.Mock).mockReturnValueOnce({
        toArray: jest.fn().mockResolvedValueOnce(mockBlogs),
      });

      const blogs = await BlogsDBRepository.getBlogs();

      expect(blogsCollection.find).toHaveBeenCalledWith({});
      expect(blogs).toEqual([
        { id: '1', name: 'Blog 1', description: 'Description 1', websiteUrl: 'https://blog1.com', createdAt: '2023-07-08T00:00:00.000Z', isMembership: false },
        { id: '2', name: 'Blog 2', description: 'Description 2', websiteUrl: 'https://blog2.com', createdAt: '2023-07-09T00:00:00.000Z', isMembership: false },
      ]);
    });
  });

  describe('findBlog', () => {
    it('should return a BlogViewModel if the blog exists', async () => {
      const mockBlog: WithId<BlogViewModel> = {
        _id: new ObjectId(), id: '1', name: 'Blog 1', description: 'Description 1', websiteUrl: 'https://blog1.com', createdAt: '2023-07-08T00:00:00.000Z', isMembership: false,
      };
      (blogsCollection.findOne as jest.Mock).mockResolvedValueOnce(mockBlog);

      const blog = await BlogsDBRepository.findBlog('1');

      expect(blogsCollection.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(blog).toEqual({
        id: '1', name: 'Blog 1', description: 'Description 1', websiteUrl: 'https://blog1.com', createdAt: '2023-07-08T00:00:00.000Z', isMembership: false,
      });
    });

    it('should return null if the blog does not exist', async () => {
      (blogsCollection.findOne as jest.Mock).mockResolvedValueOnce(null);

      const blog = await BlogsDBRepository.findBlog('non-existing-id');

      expect(blogsCollection.findOne).toHaveBeenCalledWith({ id: 'non-existing-id' });
      expect(blog).toBeNull();
    });
  });

  describe('createBlog', () => {
    it('should create a new blog and return a BlogViewModel', async () => {
      const newBlog: BlogInputModel = {
        name: 'New Blog', description: 'New Description', websiteUrl: 'https://newblog.com',
      };
      const createdBlog: WithId<BlogViewModel> = {
        _id: new ObjectId(), id: uuidv4(), name: 'New Blog', description: 'New Description', websiteUrl: 'https://newblog.com', createdAt: '2023-07-08T00:00:00.000Z', isMembership: false,
      };
      (blogsCollection.insertOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true, insertedId: createdBlog._id });

      const blog = await BlogsDBRepository.createBlog(newBlog);

      expect(blogsCollection.insertOne).toHaveBeenCalled();
      expect(blog.description).toEqual('New Description');
      expect(blog.websiteUrl).toEqual('https://newblog.com');
      expect(blog.name).toEqual('New Blog');
    });
  });

  describe('updateBlog', () => {
    it('should update an existing blog and return true', async () => {
      const updatedBlog: BlogInputModel = {
        name: 'Updated Blog', description: 'Updated Description', websiteUrl: 'https://updatedblog.com',
      };
      (blogsCollection.updateOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true, matchedCount: 1, modifiedCount: 1 });

      const result = await BlogsDBRepository.updateBlog('1', updatedBlog);

      expect(blogsCollection.updateOne).toHaveBeenCalledWith({ id: '1' }, { $set: updatedBlog });
      expect(result).toBe(true);
    });

    it('should return false if the blog does not exist', async () => {
      const updatedBlog: BlogInputModel = {
        name: 'Updated Blog', description: 'Updated Description', websiteUrl: 'https://updatedblog.com',
      };
      (blogsCollection.updateOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true, matchedCount: 0, modifiedCount: 0 });

      const result = await BlogsDBRepository.updateBlog('non-existing-id', updatedBlog);

      expect(blogsCollection.updateOne).toHaveBeenCalledWith({ id: 'non-existing-id' }, { $set: updatedBlog });
      expect(result).toBe(false);
    });
  });

  describe('deleteBlog', () => {
    it('should delete an existing blog and return true', async () => {
      (blogsCollection.deleteOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true, deletedCount: 1 });

      const result = await BlogsDBRepository.deleteBlog('1');

      expect(blogsCollection.deleteOne).toHaveBeenCalledWith({ id: '1' });
      expect(result).toBe(true);
    });

    it('should return false if the blog does not exist', async () => {
      (blogsCollection.deleteOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true, deletedCount: 0 });

      const result = await BlogsDBRepository.deleteBlog('non-existing-id');

      expect(blogsCollection.deleteOne).toHaveBeenCalledWith({ id: 'non-existing-id' });
      expect(result).toBe(false);
    });
  });
});