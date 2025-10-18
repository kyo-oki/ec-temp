import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactInput } from './dto/create-contact.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async createContact(storeId: string, input: CreateContactInput) {
    const contact = await this.prisma.contact.create({
      data: {
        ...input,
        storeId,
      },
    });

    return contact;
  }

  async getContacts(storeId: string, filter: { isRead?: boolean } = {}) {
    const where: Prisma.ContactWhereInput = {
      storeId,
    };

    if (filter.isRead !== undefined) {
      where.isRead = filter.isRead;
    }

    const contacts = await this.prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return contacts;
  }

  async getContactById(contactId: string, storeId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
        storeId,
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async markContactAsRead(contactId: string, storeId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
        storeId,
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const updatedContact = await this.prisma.contact.update({
      where: { id: contactId },
      data: { isRead: true },
    });

    return updatedContact;
  }

  async markContactAsUnread(contactId: string, storeId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
        storeId,
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const updatedContact = await this.prisma.contact.update({
      where: { id: contactId },
      data: { isRead: false },
    });

    return updatedContact;
  }

  async deleteContact(contactId: string, storeId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
        storeId,
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.prisma.contact.delete({
      where: { id: contactId },
    });

    return contact;
  }

  async getContactStats(storeId: string) {
    const [total, unread, read] = await Promise.all([
      this.prisma.contact.count({
        where: { storeId },
      }),
      this.prisma.contact.count({
        where: { storeId, isRead: false },
      }),
      this.prisma.contact.count({
        where: { storeId, isRead: true },
      }),
    ]);

    return {
      total,
      unread,
      read,
    };
  }
}
