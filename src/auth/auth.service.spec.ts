import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;

  // let mockRepo = {
  //   create: jest.fn().mockImplementation((dto) => {
  //     return Promise.resolve({
  //       id: 1,
  //       name: dto.name,
  //       email: dto.email,
  //       password: dto.password,
  //     });
  //   }),
  // };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          id: 1,
          ...dto,
        }),
      ),
    };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
