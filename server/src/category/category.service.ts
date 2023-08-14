import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private repository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, id: string) {
    const categoryExist = await this.repository.findBy({
      title: createCategoryDto.title,
      id: id,
    });
    if (categoryExist) throw new BadRequestException(`Category exists`);

    return await this.repository.save({
      user: { id },
      title: createCategoryDto.title,
    });
  }

  async findAll(id: string) {
    return await this.repository.find({
      where: { user: { id } },
      relations: {
        user: true,
        transactions: true,
      },
    });
  }

  async findOne(id: string) {
    const category = await this.repository.find({
      where: { user: { id } },
      relations: {
        user: true,
        transactions: true,
      },
    });
    if (!category) throw new NotFoundException('category not found');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.repository.find({
      where: { user: { id } },
    });

    if (!category) throw new NotFoundException('category not found');

    return await this.repository.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    const category = await this.repository.find({
      where: { user: { id } },
    });

    if (!category) throw new NotFoundException('category not found');

    return await this.repository.delete(id);
  }
}
