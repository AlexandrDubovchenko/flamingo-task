import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: 'Project name', example: 'My Project' })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'A description of my project',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Project color (hex)',
    example: '#3B82F6',
  })
  @IsOptional()
  @IsString()
  @Length(7, 7)
  color?: string;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({ description: 'Project name', example: 'My Project' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'A description of my project',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Project color (hex)',
    example: '#3B82F6',
  })
  @IsOptional()
  @IsString()
  @Length(7, 7)
  color?: string;
}
