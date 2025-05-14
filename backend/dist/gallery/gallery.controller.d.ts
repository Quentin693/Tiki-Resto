import { GalleryService } from './gallery.service';
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto';
import { UpdateGalleryItemDto } from './dto/update-gallery-item.dto';
export declare class GalleryController {
    private readonly galleryService;
    constructor(galleryService: GalleryService);
    create(createGalleryItemDto: CreateGalleryItemDto): Promise<import("./entities/gallery-item.entity").GalleryItem>;
    findAll(): Promise<import("./entities/gallery-item.entity").GalleryItem[]>;
    getCategories(): Promise<{
        id: string;
        name: string;
    }[]>;
    findByCategory(category: string): Promise<import("./entities/gallery-item.entity").GalleryItem[]>;
    findOne(id: string): Promise<import("./entities/gallery-item.entity").GalleryItem>;
    update(id: string, updateGalleryItemDto: UpdateGalleryItemDto): Promise<import("./entities/gallery-item.entity").GalleryItem>;
    remove(id: string): Promise<void>;
}
