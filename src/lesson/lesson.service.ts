import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { CreateLessonInput } from './create-lesson.input';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>
  ) {}

  async createLesson(paylaod: CreateLessonInput): Promise<Lesson> {
    const { name, startDate, endDate, students } = paylaod;
    const lesson = this.lessonRepository.create({
      id: uuid(),
      name,
      startDate,
      endDate,
      students,
    });
    return await this.lessonRepository.save(lesson);
  }

  async getLessonById(id: string): Promise<Lesson> {
    const lesson = this.lessonRepository.findOne({ where: { id: id } });
    if (!lesson) throw new NotFoundException(`Lesson with is ${id} not found.`);
    return lesson;
  }

  async getAllLessons(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }

  async assignStudentsToLesson(lessonId: string, studentIds: string[]) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });
    lesson.students = [...lesson.students, ...studentIds];
    return await this.lessonRepository.save(lesson);
  }
}
