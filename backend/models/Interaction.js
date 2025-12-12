const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

class Interaction {
  static collection() {
    return getDB().collection('interactions');
  }

  static async findAll(query = {}) {
    return await this.collection().find(query).sort({ date: -1 }).toArray();
  }

  static async findById(id) {
    return await this.collection().findOne({ _id: new ObjectId(id) });
  }

  static async findByContactId(contactId) {
    return await this.collection()
      .find({ contactId: new ObjectId(contactId) })
      .sort({ date: -1 })
      .toArray();
  }

  static async create(interactionData) {
    const result = await this.collection().insertOne({
      ...interactionData,
      contactId: new ObjectId(interactionData.contactId),
      date: new Date(interactionData.date),
      createdAt: new Date()
    });
    return result.insertedId;
  }

  static async update(id, updateData) {
    const dataToUpdate = { ...updateData };
    if (dataToUpdate.date) {
      dataToUpdate.date = new Date(dataToUpdate.date);
    }
    if (dataToUpdate.contactId) {
      dataToUpdate.contactId = new ObjectId(dataToUpdate.contactId);
    }

    const result = await this.collection().updateOne(
      { _id: new ObjectId(id) },
      { $set: dataToUpdate }
    );
    return result.modifiedCount > 0;
  }

  static async delete(id) {
    const result = await this.collection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async deleteByContactId(contactId) {
    const result = await this.collection().deleteMany({ 
      contactId: new ObjectId(contactId) 
    });
    return result.deletedCount;
  }

  static async getStatsByContactId(contactId) {
    return await this.collection().aggregate([
      { $match: { contactId: new ObjectId(contactId) } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
  }
}

module.exports = Interaction;