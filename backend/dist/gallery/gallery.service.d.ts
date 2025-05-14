import { Repository } from 'typeorm';
import { GalleryItem } from './entities/gallery-item.entity';
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto';
import { UpdateGalleryItemDto } from './dto/update-gallery-item.dto';
export declare class GalleryService {
    private galleryItemRepository;
    private readonly logger;
    constructor(galleryItemRepository: Repository<GalleryItem>);
    create(createGalleryItemDto: CreateGalleryItemDto): Promise<GalleryItem>;
    findAll(): Promise<GalleryItem[]>;
    findByCategory(category: string): Promise<GalleryItem[]>;
    findOne(id: number): Promise<GalleryItem>;
    update(id: number, updateGalleryItemDto: UpdateGalleryItemDto): Promise<GalleryItem>;
    remove(id: number): Promise<void>;
    getCategories(): Promise<{
        id: string;
        name: string;
    }[]>;
}
