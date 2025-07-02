import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn().mockResolvedValue({
        id: 1,
        email: 'mockEmail@joke.com',
        password: await bcrypt.hash('pwd123', 1),
      }),
      create: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          id: 1,
          ...dto,
        }),
      ),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService as UsersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a token when successfully login', async () => {
    const response = await service.login('mockEmail@joke.com', 'pwd123');

    expect(response).toEqual({ accessToken: 'jwt-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      email: 'mockEmail@joke.com',
    });
  });

  it('throws an error on unknown email', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      service.login('invalidEmail@not.com', 'pwd123'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws an error on invalid password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(
      service.login('mockEmail@joke.com', 'wrongPassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should register a customer', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
    const result = await service.register(
      'TestName',
      'TestingName@example.com',
      'newPassword000',
    );

    expect(result).toEqual({
      id: 1,
      email: 'TestingName@example.com',
      name: 'TestName',
      password: 'hashedPassword',
    });
    expect(usersService.create).toHaveBeenCalled();
  });

  it('register customer should throw an error if email already exists', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Claire',
      email: 'claire@gmail.com',
      password: 'password',
      createdAt: '2025-04-21T06:32:44.751Z',
    });

    await expect(
      service.register('claire', 'claire@gmail.com', 'password'),
    ).rejects.toThrow(ConflictException);
  });
});
