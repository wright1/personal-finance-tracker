import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService as UsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a customer', async () => {
    const result = await service.register(
      'TestName',
      'TestingName@example.com',
      'newPassword000',
    );

    expect(result).toHaveProperty('email', 'TestingName@example.com');
    expect(usersService.create).toHaveBeenCalled();
  });
});
