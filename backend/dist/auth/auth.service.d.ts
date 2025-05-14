import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/user.entity';
export declare class AuthService {
    private jwtService;
    private usersRepository;
    private readonly logger;
    constructor(jwtService: JwtService, usersRepository: Repository<Users>);
    validateUser(email: string, password: string): Promise<any>;
    register(userData: {
        name: string;
        email: string;
        password: string;
        phoneNumber: string;
    }): Promise<any>;
    login(user: any): Promise<{
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            phoneNumber: any;
        };
        token: string;
    }>;
}
