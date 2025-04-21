import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
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
});
