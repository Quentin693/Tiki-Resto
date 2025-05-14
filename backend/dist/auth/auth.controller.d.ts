import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<{
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
