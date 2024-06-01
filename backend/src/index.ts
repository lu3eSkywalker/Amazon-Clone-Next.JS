import express from 'express';
import todoRoutes from './routes/Routes';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors())
app.use('/api/v1', todoRoutes);

// Prisma Client initialization and database connection
const prisma = new PrismaClient();

const dbConnect = async () => {
    try {
        await prisma.$connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit the process if unable to connect
    }
};

dbConnect(); // Call the function to connect

// Start server
app.listen(PORT, () => {
    console.log(`Server started successfully at ${PORT}`);
});

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
    console.log('Disconnected from database');
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('Disconnected from database');
    process.exit(0);
});