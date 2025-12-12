const { MongoClient } = require('mongodb');
require('dotenv').config();

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bailey', 'Bell'
];

const companies = [
  'TechCorp', 'InnovateLabs', 'Global Solutions', 'Digital Dynamics', 'NextGen Systems',
  'Smart Industries', 'FutureWorks', 'Quantum Technologies', 'Synergy Group', 'Prime Ventures',
  'Elite Consulting', 'Pacific Partners', 'Atlantic Enterprises', 'Summit Corporation', 'Apex Industries',
  'Zenith Solutions', 'Horizon Tech', 'Momentum Group', 'Catalyst Innovations', 'Vertex Systems',
  'Core Dynamics', 'Phoenix Technologies', 'Titan Industries', 'Omega Solutions', 'Alpha Group',
  'Beta Technologies', 'Gamma Enterprises', 'Delta Systems', 'Epsilon Innovations', 'Sigma Corp'
];

const roles = [
  'Software Engineer', 'Product Manager', 'Marketing Director', 'Sales Representative',
  'Senior Developer', 'UX Designer', 'Data Analyst', 'Project Manager', 'HR Manager',
  'Business Analyst', 'Account Executive', 'Recruiter', 'Operations Manager', 'CTO',
  'VP of Engineering', 'Creative Director', 'Finance Manager', 'Customer Success Manager',
  'DevOps Engineer', 'Content Strategist', 'Brand Manager', 'Research Scientist',
  'Technical Writer', 'Quality Assurance', 'System Administrator', 'Consultant'
];

const tags = [
  'client', 'prospect', 'recruiter', 'mentor', 'colleague', 'active', 'inactive',
  'hot-lead', 'cold-lead', 'partner', 'vendor', 'investor', 'advisor', 'friend'
];

const interactionTypes = ['meeting', 'call', 'email', 'message'];

const noteTemplates = [
  'Discussed project requirements and timeline expectations.',
  'Follow-up needed on previous conversation about collaboration.',
  'Great conversation about industry trends and opportunities.',
  'Shared portfolio and discussed potential projects.',
  'Reviewed contract terms and next steps.',
  'Coffee meeting to discuss career opportunities.',
  'Phone screening for open position. Positive conversation.',
  'Sent proposal and awaiting feedback.',
  'Quarterly check-in. Everything on track.',
  'Discussed budget constraints and adjusted scope.',
  'Networking event connection. Planning to follow up.',
  'Referred by mutual connection. Initial introduction.',
  'Attended presentation and had great Q&A session.',
  'Collaborative brainstorming session for new initiative.',
  'Feedback session on completed project deliverables.'
];

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateContacts(count) {
  const contacts = [];
  const usedEmails = new Set();

  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const name = `${firstName} ${lastName}`;
    
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomElement(companies).toLowerCase().replace(/\s+/g, '')}.com`;
    
    // Ensure unique emails
    let counter = 1;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@${randomElement(companies).toLowerCase().replace(/\s+/g, '')}.com`;
      counter++;
    }
    usedEmails.add(email);

    const numTags = Math.floor(Math.random() * 3) + 1;
    const contactTags = [];
    for (let j = 0; j < numTags; j++) {
      const tag = randomElement(tags);
      if (!contactTags.includes(tag)) {
        contactTags.push(tag);
      }
    }

    contacts.push({
      name,
      email,
      company: randomElement(companies),
      role: randomElement(roles),
      tags: contactTags,
      createdAt: randomDate(new Date(2023, 0, 1), new Date(2024, 11, 1)),
      updatedAt: new Date()
    });
  }

  return contacts;
}

function generateInteractions(contacts, interactionsPerContact) {
  const interactions = [];
  const startDate = new Date(2023, 0, 1);
  const endDate = new Date();

  for (const contact of contacts) {
    const numInteractions = Math.floor(Math.random() * interactionsPerContact) + 1;
    
    for (let i = 0; i < numInteractions; i++) {
      const duration = ['15min', '30min', '45min', '1hr', '2hr', null];
      
      interactions.push({
        contactId: contact._id,
        type: randomElement(interactionTypes),
        date: randomDate(startDate, endDate),
        notes: randomElement(noteTemplates),
        duration: randomElement(duration),
        createdAt: new Date()
      });
    }
  }

  return interactions;
}

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/connecthub';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Drop existing collections
    console.log('Dropping existing collections...');
    await db.collection('contacts').drop().catch(() => {});
    await db.collection('interactions').drop().catch(() => {});

    // Generate and insert contacts
    console.log('Generating 1000 contacts...');
    const contacts = generateContacts(1000);
    const contactResult = await db.collection('contacts').insertMany(contacts);
    console.log(`Inserted ${contactResult.insertedCount} contacts`);

    // Get inserted contacts with their IDs
    const insertedContacts = await db.collection('contacts').find({}).toArray();

    // Generate and insert interactions (2-5 per contact = 2000-5000 interactions)
    console.log('Generating interactions...');
    const interactions = generateInteractions(insertedContacts, 5);
    const interactionResult = await db.collection('interactions').insertMany(interactions);
    console.log(`Inserted ${interactionResult.insertedCount} interactions`);

    // Create indexes
    console.log('Creating indexes...');
    await db.collection('contacts').createIndex({ email: 1 }, { unique: true });
    await db.collection('contacts').createIndex({ name: 1 });
    await db.collection('contacts').createIndex({ company: 1 });
    await db.collection('interactions').createIndex({ contactId: 1 });
    await db.collection('interactions').createIndex({ date: -1 });

    console.log('Database seeded successfully!');
    console.log(`Total contacts: ${contactResult.insertedCount}`);
    console.log(`Total interactions: ${interactionResult.insertedCount}`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();