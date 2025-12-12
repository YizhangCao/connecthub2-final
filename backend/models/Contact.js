const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

class Contact {
  static collection() {
    return getDB().collection('contacts');
  }

  static async findAll(query = {}) {
    return await this.collection().find(query).toArray();
  }

  static async findById(id) {
    return await this.collection().findOne({ _id: new ObjectId(id) });
  }

  static async create(contactData) {
    const result = await this.collection().insertOne({
      ...contactData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result.insertedId;
  }

  static async update(id, updateData) {
    const result = await this.collection().updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  static async delete(id) {
    const result = await this.collection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async search(searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    return await this.collection().find({
      $or: [
        { name: regex },
        { email: regex },
        { company: regex },
        { role: regex },
        { tags: regex }
      ]
    }).toArray();
  }

  static async getContactsNeedingFollowUp(days = 30) {
    const db = getDB();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await db.collection('contacts').aggregate([
      {
        $lookup: {
          from: 'interactions',
          localField: '_id',
          foreignField: 'contactId',
          as: 'interactions'
        }
      },
      {
        $addFields: {
          lastInteraction: { $max: '$interactions.date' }
        }
      },
      {
        $match: {
          $or: [
            { lastInteraction: { $lt: cutoffDate } },
            { lastInteraction: null }
          ]
        }
      }
    ]).toArray();
  }
}

module.exports = Contact;