import { Body, Controller, Get, NotFoundException, Param, Post, Put, Delete, Request, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('store/products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/')
    async getProducts(@Query() filterProductDTO: FilterProductDTO) {
        if(Object.keys(filterProductDTO).length) {
            const filteredProducts = await this.productService.getFilteredProducts(filterProductDTO);
            return filteredProducts;
        } else {
            const allProducts = await this.productService.getAllProducts();
            return allProducts;
        }
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/:id')
    async getProduct(@Param('id') id: string) {
        const product = await this.productService.getProduct(id);
        if(!product)
            throw new NotFoundException("Product does not exist!");
        return product;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('/')
    async addProduct(@Body() createProductDTO: CreateProductDTO) {
        const product = await this.productService.addProduct(createProductDTO);
        return product;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('/:id')
    async updateProduct(@Param('id') id: string, @Body() createProductDTO: CreateProductDTO) {
        const product = await this.productService.updateProduct(id, createProductDTO);
        if(!product)
            throw new NotFoundException("Product des not exist!");
        return product;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('/:id')
    async deleteProduct(@Param('id') id: string) {
        const product = await this.productService.deleteProduct(id);
        if(!product)
            throw new NotFoundException("Product does not exist!");
        return product;
    }
}
