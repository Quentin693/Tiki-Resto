"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
let AuthService = AuthService_1 = class AuthService {
    jwtService;
    usersRepository;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(jwtService, usersRepository) {
        this.jwtService = jwtService;
        this.usersRepository = usersRepository;
        this.logger.log('AuthService initialized');
    }
    async validateUser(email, password) {
        try {
            this.logger.log(`Attempting to validate user with email: ${email}`);
            const user = await this.usersRepository.findOne({ where: { email } });
            if (!user) {
                this.logger.warn(`No user found with email: ${email}`);
                return null;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            this.logger.log(`Password validation result for ${email}: ${isPasswordValid}`);
            if (isPasswordValid) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        }
        catch (error) {
            this.logger.error('Error validating user:', error.message);
            throw new common_1.UnauthorizedException('Erreur lors de la validation');
        }
    }
    async register(userData) {
        try {
            this.logger.log(`Attempting to register user with email: ${userData.email}`);
            const existingUser = await this.usersRepository.findOne({
                where: { email: userData.email }
            });
            if (existingUser) {
                this.logger.warn(`Email already in use: ${userData.email}`);
                throw new common_1.UnauthorizedException('Cet email est déjà utilisé');
            }
            const isAdmin = userData.email.includes('admin') || userData.email.includes('tiki-admin');
            const role = isAdmin ? 'admin' : 'user';
            this.logger.log(`Assigning role "${role}" to user with email: ${userData.email}`);
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            this.logger.log(`Password hashed for user: ${userData.email}`);
            const newUser = new user_entity_1.Users();
            newUser.name = userData.name;
            newUser.email = userData.email;
            newUser.password = hashedPassword;
            newUser.role = role;
            newUser.phone_number = userData.phoneNumber;
            const savedUser = await this.usersRepository.save(newUser);
            this.logger.log(`User registered successfully with ID: ${savedUser.id} and role: ${savedUser.role}`);
            const payload = {
                sub: savedUser.id,
                email: savedUser.email,
                role: savedUser.role
            };
            this.logger.log(`Creating JWT payload for user ${savedUser.id}: ${JSON.stringify(payload)}`);
            const token = this.jwtService.sign(payload);
            this.logger.log(`Token generated successfully for user ${savedUser.id}`);
            return {
                user: {
                    id: savedUser.id,
                    name: savedUser.name,
                    email: savedUser.email,
                    role: savedUser.role,
                    phoneNumber: savedUser.phone_number
                },
                token
            };
        }
        catch (error) {
            this.logger.error('Error registering user:', error.message);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Erreur lors de l\'inscription');
        }
    }
    async login(user) {
        this.logger.log(`Generating token for user ID: ${user.id}, email: ${user.email}, role: ${user.role}`);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        this.logger.log(`JWT payload for login: ${JSON.stringify(payload)}`);
        const token = this.jwtService.sign(payload);
        this.logger.log(`Token generated successfully with signature: ${token.split('.')[2].substring(0, 10)}...`);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phone_number
            },
            token
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map