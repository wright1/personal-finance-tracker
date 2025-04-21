import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: Partial<Repository<User>>;

  beforeEach(async () => {
    mockRepo = {
      findOneBy: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user by ID', async () => {
    const user = await service.findOne(1);
    expect(user).toEqual({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    });
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });
  it('should return an error if no user is found', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (mockRepo.findOneBy as jest.Mock).mockResolvedValueOnce(null),
      //const user = service.findOne(8);
      await expect(service.findOne(8)).rejects.toThrow(NotFoundException);
  });
});
