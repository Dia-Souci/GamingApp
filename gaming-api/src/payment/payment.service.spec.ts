import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { OrdersService } from '../orders/orders.service';
import { GamesService } from '../games/games.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let configService: ConfigService;
  let ordersService: OrdersService;
  let gamesService: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'CHARGILY_API_KEY':
                  return 'test_api_key';
                case 'NODE_ENV':
                  return 'test';
                default:
                  return undefined;
              }
            }),
          },
        },
        {
          provide: OrdersService,
          useValue: {
            createGuestOrder: jest.fn(),
            updateOrderStatus: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: GamesService,
          useValue: {
            findOne: jest.fn(),
            markActivationKeyAsUsed: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    configService = module.get<ConfigService>(ConfigService);
    ordersService = module.get<OrdersService>(OrdersService);
    gamesService = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyWebhookSignature', () => {
    it('should verify valid webhook signature', () => {
      const signature = 'valid_signature';
      const rawBody = Buffer.from('test_body');
      
      // Mock crypto module
      jest.doMock('crypto', () => ({
        createHmac: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            digest: jest.fn().mockReturnValue('valid_signature'),
          }),
        }),
      }));

      const result = service.verifyWebhookSignature(signature, rawBody);
      expect(result).toBe(true);
    });

    it('should reject invalid webhook signature', () => {
      const signature = 'invalid_signature';
      const rawBody = Buffer.from('test_body');
      
      // Mock crypto module
      jest.doMock('crypto', () => ({
        createHmac: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            digest: jest.fn().mockReturnValue('valid_signature'),
          }),
        }),
      }));

      const result = service.verifyWebhookSignature(signature, rawBody);
      expect(result).toBe(false);
    });
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const healthCheck = service['healthCheck'];
      expect(healthCheck).toBeDefined();
    });
  });
});
